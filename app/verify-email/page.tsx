import Link from "next/link";
import type { Metadata } from "next";
import Logo from "../_components/logo";
import ResendVerification from "../_components/resend-verification";
import { verifyEmailToken } from "@/lib/auth/verification";

export const metadata: Metadata = {
  title: "Verify email",
  robots: { index: false },
};

type VerifyPageProps = {
  searchParams: Promise<{ token?: string }>;
};

const PANELS = {
  verified: {
    icon: "check",
    title: "Email verified",
    body: "Your email address is confirmed. You can now sign in to your account.",
  },
  already: {
    icon: "check",
    title: "Already verified",
    body: "This email address has already been confirmed. You can sign in any time.",
  },
  expired: {
    icon: "alert",
    title: "Link expired",
    body: "This verification link has expired or already been used. Request a fresh one below.",
  },
  invalid: {
    icon: "alert",
    title: "Invalid link",
    body: "We couldn't verify this link. Request a new verification email below.",
  },
} as const;

export default async function VerifyEmailPage({
  searchParams,
}: VerifyPageProps) {
  const { token } = await searchParams;
  const result = await verifyEmailToken(token);
  const panel = PANELS[result];
  const ok = result === "verified" || result === "already";

  return (
    <div className="flex min-h-screen flex-grow items-center justify-center bg-background p-4 text-on-background sm:p-6">
      <div className="animate-rise-in w-full max-w-[480px] rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-6 text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)] sm:p-10 md:p-12">
        <h1 className="mb-8 text-[36px] leading-[1.1] sm:text-[40px]">
          <Logo className="uppercase" />
        </h1>

        <div
          className={`mx-auto mb-6 flex size-14 items-center justify-center rounded-full ${
            ok ? "bg-primary/10 text-primary" : "bg-error/10 text-error"
          }`}
        >
          {panel.icon === "check" ? <CheckIcon /> : <AlertIcon />}
        </div>

        <h2 className="mb-3 text-[22px] font-semibold text-on-surface">
          {panel.title}
        </h2>
        <p className="mb-8 text-[15px] leading-[1.6] text-on-surface-variant">
          {panel.body}
        </p>

        {ok ? (
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center rounded-sm bg-primary py-3.5 text-[14px] font-medium text-on-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.99]"
          >
            Continue to sign in
          </Link>
        ) : (
          <div className="space-y-4 text-left">
            <ResendVerification />
            <p className="text-center text-[14px] text-on-surface-variant">
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Back to sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}
