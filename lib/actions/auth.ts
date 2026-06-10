"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/db";
import { signIn, signOut } from "@/lib/auth/auth";
import {
  resetPasswordWithToken,
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "@/lib/auth/verification";

export type AuthFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
      success?: boolean;
      unverified?: boolean;
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
    throw error;
  }
  return undefined;
}

const resendSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

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

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

export async function forgotPasswordAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = forgotSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  try {
    await sendPasswordResetEmail(parsed.data.email);
  } catch (error) {
    console.error("Failed to send password reset email:", error);
  }

  // Always report success to avoid revealing whether the account exists.
  return {
    success: true,
    email: parsed.data.email,
    message: "If an account exists for that email, a reset link is on its way.",
  };
}

const resetSchema = z
  .object({
    token: z.string().min(1, "Reset token is missing."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirm: z.string().min(1, "Please confirm your password."),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match.",
    path: ["confirm"],
  });

export async function resetPasswordAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = resetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const result = await resetPasswordWithToken(
    parsed.data.token,
    parsed.data.password,
  );

  if (result === "success") {
    return { success: true, message: "Your password has been updated." };
  }
  return {
    message:
      result === "expired"
        ? "This reset link has expired. Please request a new one."
        : "This reset link is invalid. Please request a new one.",
  };
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}

export async function googleLogin() {
  await signIn("google", { redirectTo: "/dashboard" });
}
