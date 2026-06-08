import "server-only";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { sendEmail } from "@/lib/email/send";
import { verificationEmail } from "@/lib/email/templates";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

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
