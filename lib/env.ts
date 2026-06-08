import "server-only";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().min(1, "DIRECT_URL is required"),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
  CURRENTS_API_KEY: z.string().optional(),
  CRON_SECRET: z.string().optional(),
  BREVO_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().default("no-reply@newsera.app"),
  EMAIL_FROM_NAME: z.string().default("Newsera"),
  NEXT_PUBLIC_SITE_URL: z.string().default("http://localhost:3000"),
});

export const env = envSchema.parse(process.env);

export const hasGoogle = Boolean(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET);
export const hasNews = Boolean(env.CURRENTS_API_KEY);
export const hasEmail = Boolean(env.BREVO_API_KEY);
