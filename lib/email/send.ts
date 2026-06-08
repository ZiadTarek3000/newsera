import "server-only";
import { env, hasEmail } from "@/lib/env";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

export type EmailMessage = {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text: string;
};

/**
 * Sends a transactional email via Brevo's HTTP API.
 *
 * When BREVO_API_KEY is not configured, the message (and any embedded link) is
 * logged to the server console instead, so the verification flow stays testable
 * in local development without an email provider.
 */
export async function sendEmail(message: EmailMessage): Promise<void> {
  if (!hasEmail) {
    console.info(
      `[email:dev] To: ${message.to}\n` +
        `[email:dev] Subject: ${message.subject}\n` +
        `[email:dev] ${message.text}`,
    );
    return;
  }

  const res = await fetch(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      "api-key": env.BREVO_API_KEY as string,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: env.EMAIL_FROM_NAME, email: env.EMAIL_FROM },
      to: [{ email: message.to, name: message.toName ?? message.to }],
      subject: message.subject,
      htmlContent: message.html,
      textContent: message.text,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Brevo send failed: ${res.status} ${detail}`.trim());
  }
}
