"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/db";
import { signIn, signOut } from "@/lib/auth/auth";
import { sendVerificationEmail } from "@/lib/auth/verification";

export type AuthFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
      /** Set after a successful registration: show the "check your inbox" panel. */
      success?: boolean;
      /** Set when login is blocked because the email isn't verified yet. */
      unverified?: boolean;
      /** The email involved, so the UI can offer to resend the verification link. */
      email?: string;
    }
  | undefined;

function fieldErrors(error: z.ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    (errors[key] ??= []).push(issue.message);
  }
  return errors;
}

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export async function registerAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("fullName") ?? formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { message: "An account with this email already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, password: hashedPassword, preferences: { create: {} } },
  });

  // Send the confirmation email immediately. A delivery failure must not lose
  // the account — the user can request a fresh link from the login screen.
  try {
    await sendVerificationEmail({ email, name });
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }

  return { success: true, email };
}

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const { email, password } = parsed.data;

  // Surface a clear, actionable message for unverified accounts (with a resend
  // option) — but only to someone who proves they own the credentials, so we
  // don't leak account/verification status to others.
  const user = await prisma.user.findUnique({ where: { email } });
  if (user?.password && !user.emailVerified) {
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      return {
        unverified: true,
        email,
        message: "Please verify your email address before signing in.",
      };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: "Invalid email or password." };
    }
    throw error; // re-throw redirect
  }
  return undefined;
}

const resendSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

/**
 * Re-sends the verification email for an unverified account. Always reports
 * success regardless of whether the account exists or is already verified, to
 * avoid leaking which emails are registered.
 */
export async function resendVerificationAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = resendSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && !user.emailVerified) {
    try {
      await sendVerificationEmail({ email: user.email, name: user.name });
    } catch (error) {
      console.error("Failed to resend verification email:", error);
      return { message: "Could not send the email. Please try again shortly." };
    }
  }

  return {
    success: true,
    email,
    message: "If that account needs verification, a new link is on its way.",
  };
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}

export async function googleLogin() {
  await signIn("google", { redirectTo: "/dashboard" });
}
