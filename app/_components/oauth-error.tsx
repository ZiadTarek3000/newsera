"use client";

import { useSearchParams } from "next/navigation";

// Maps NextAuth OAuth error codes (delivered as `?error=` on the sign-in page)
// to friendly, actionable messages.
const MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked:
    "This email is already registered with a different sign-in method. Sign in that way, then link Google from your account.",
  OAuthSignin: "Could not start Google sign-in. Please try again.",
  OAuthCallback:
    "Google sign-in could not be completed. Please try again.",
  OAuthCreateAccount: "We couldn't create your account from Google. Please try again.",
  AccessDenied: "Access was denied. Please grant permission to continue.",
  Configuration:
    "Google sign-in is temporarily unavailable. Please try email sign-in.",
  Verification: "That sign-in link has expired. Please request a new one.",
};

export default function OAuthError() {
  const error = useSearchParams().get("error");
  if (!error) return null;

  const message =
    MESSAGES[error] ?? "Something went wrong during sign-in. Please try again.";

  return (
    <p
      role="alert"
      className="w-full rounded border border-error/30 bg-error/5 px-3 py-2 text-[13px] font-medium text-error"
    >
      {message}
    </p>
  );
}
