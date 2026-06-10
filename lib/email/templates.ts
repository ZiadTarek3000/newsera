import "server-only";
import type { EmailMessage } from "@/lib/email/send";

const BRAND = "#4648d4";

export function verificationEmail({
  to,
  name,
  url,
}: {
  to: string;
  name: string | null;
  url: string;
}): EmailMessage {
  const greeting = name ? `Hi ${name},` : "Welcome to Newsera,";

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1b1b24;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6e6ec;">
            <tr>
              <td style="padding:40px 40px 24px;">
                <p style="margin:0 0 24px;font-size:22px;font-weight:700;letter-spacing:0.04em;color:${BRAND};">NEWSERA</p>
                <h1 style="margin:0 0 16px;font-size:20px;line-height:1.4;">Confirm your email address</h1>
                <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#44444f;">${greeting}</p>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#44444f;">
                  Thanks for signing up. Please confirm this email address to activate your account and start reading.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                  <tr>
                    <td style="border-radius:8px;background:${BRAND};">
                      <a href="${url}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">
                        Verify email address
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#8a8a96;">
                  Or paste this link into your browser:
                </p>
                <p style="margin:0 0 24px;font-size:13px;line-height:1.6;word-break:break-all;">
                  <a href="${url}" style="color:${BRAND};">${url}</a>
                </p>
                <p style="margin:0;font-size:13px;line-height:1.6;color:#8a8a96;">
                  This link expires in 24 hours. If you didn't create a Newsera account, you can safely ignore this email.
                </p>
              </td>
            </tr>
          </table>
          <p style="margin:24px 0 0;font-size:12px;color:#a0a0aa;">© Newsera</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `${greeting}

Thanks for signing up for Newsera. Confirm your email address to activate your account:

${url}

This link expires in 24 hours. If you didn't create a Newsera account, you can ignore this email.`;

  return {
    to,
    toName: name ?? undefined,
    subject: "Confirm your Newsera email address",
    html,
    text,
  };
}

export function passwordResetEmail({
  to,
  name,
  url,
}: {
  to: string;
  name: string | null;
  url: string;
}): EmailMessage {
  const greeting = name ? `Hi ${name},` : "Hello,";

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1b1b24;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6e6ec;">
            <tr>
              <td style="padding:40px 40px 24px;">
                <p style="margin:0 0 24px;font-size:22px;font-weight:700;letter-spacing:0.04em;color:${BRAND};">NEWSERA</p>
                <h1 style="margin:0 0 16px;font-size:20px;line-height:1.4;">Reset your password</h1>
                <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#44444f;">${greeting}</p>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#44444f;">
                  We received a request to reset your Newsera password. Click the button below to choose a new one.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                  <tr>
                    <td style="border-radius:8px;background:${BRAND};">
                      <a href="${url}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">
                        Reset password
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#8a8a96;">
                  Or paste this link into your browser:
                </p>
                <p style="margin:0 0 24px;font-size:13px;line-height:1.6;word-break:break-all;">
                  <a href="${url}" style="color:${BRAND};">${url}</a>
                </p>
                <p style="margin:0;font-size:13px;line-height:1.6;color:#8a8a96;">
                  This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
                </p>
              </td>
            </tr>
          </table>
          <p style="margin:24px 0 0;font-size:12px;color:#a0a0aa;">© Newsera</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `${greeting}

We received a request to reset your Newsera password. Use the link below to choose a new one:

${url}

This link expires in 1 hour. If you didn't request a password reset, you can ignore this email.`;

  return {
    to,
    toName: name ?? undefined,
    subject: "Reset your Newsera password",
    html,
    text,
  };
}
