import "server-only";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { sendEmail } from "@/lib/email/send";
import { passwordResetEmail, verificationEmail } from "@/lib/email/templates";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const RESET_TTL_MS = 60 * 60 * 1000;
// Password-reset tokens reuse the VerificationToken table with a namespaced
// identifier so they never collide with email-verification tokens.
const RESET_PREFIX = "pwreset:";

export async function sendVerificationEmail(user: {
  email: string;
  name: string | null;
}): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + TOKEN_TTL_MS);

  await prisma.verificationToken.deleteMany({
    where: { identifier: user.email },
  });
  await prisma.verificationToken.create({
    data: { identifier: user.email, token, expires },
  });

  const url = `${env.NEXT_PUBLIC_SITE_URL}/verify-email?token=${token}`;
  await sendEmail(verificationEmail({ to: user.email, name: user.name, url }));
}

export type VerificationResult = "verified" | "already" | "expired" | "invalid";

export async function verifyEmailToken(
  token: string | undefined,
): Promise<VerificationResult> {
  if (!token) return "invalid";

  const record = await prisma.verificationToken.findFirst({
    where: { token },
  });
  if (!record) return "invalid";

  await prisma.verificationToken.deleteMany({ where: { token } });

  if (record.expires < new Date()) return "expired";

  const user = await prisma.user.findUnique({
    where: { email: record.identifier },
  });
  if (!user) return "invalid";
  if (user.emailVerified) return "already";

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date() },
  });
  return "verified";
}

/**
 * Issue a password-reset email. Always resolves without revealing whether the
 * account exists or uses a password (avoids account enumeration). Google-only
 * accounts (no password) are skipped silently.
 */
export async function sendPasswordResetEmail(email: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.password) return;

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + RESET_TTL_MS);
  const identifier = `${RESET_PREFIX}${email}`;

  await prisma.verificationToken.deleteMany({ where: { identifier } });
  await prisma.verificationToken.create({
    data: { identifier, token, expires },
  });

  const url = `${env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`;
  await sendEmail(passwordResetEmail({ to: email, name: user.name, url }));
}

export type ResetResult = "success" | "expired" | "invalid";

/**
 * Consume a password-reset token and set a new password. Single-use: the token
 * is deleted whether or not it was valid/expired.
 */
export async function resetPasswordWithToken(
  token: string | undefined,
  newPassword: string,
): Promise<ResetResult> {
  if (!token) return "invalid";

  const record = await prisma.verificationToken.findFirst({
    where: { token, identifier: { startsWith: RESET_PREFIX } },
  });
  if (!record) return "invalid";

  await prisma.verificationToken.deleteMany({ where: { token } });

  if (record.expires < new Date()) return "expired";

  const email = record.identifier.slice(RESET_PREFIX.length);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return "invalid";

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    // Completing reset via emailed link also proves ownership of the address.
    data: {
      password: hashedPassword,
      emailVerified: user.emailVerified ?? new Date(),
    },
  });
  return "success";
}
