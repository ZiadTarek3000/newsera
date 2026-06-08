"use client";

import { useActionState } from "react";
import Link from "next/link";
import Logo from "../_components/logo";
import ResendVerification from "../_components/resend-verification";
import { googleLogin, registerAction } from "@/lib/actions/auth";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, undefined);

  return (
    <div className="flex min-h-screen flex-grow items-center justify-center bg-background p-6 text-on-background">
      <div className="animate-rise-in w-full max-w-[480px] rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-12 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <header className="mb-12 text-center">
          <h1 className="mb-1 text-[48px] leading-[1.1]">
            <Logo className="uppercase" />
          </h1>
          <p className="text-[16px] leading-[1.6] text-on-surface-variant">
            {state?.success
              ? "One last step to activate your account."
              : "Create your account to access premium journalism."}
          </p>
        </header>

        {state?.success ? (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MailCheckIcon />
            </div>
            <div className="space-y-2">
              <h2 className="text-[20px] font-semibold text-on-surface">
                Check your inbox
              </h2>
              <p className="text-[15px] leading-[1.6] text-on-surface-variant">
                We sent a verification link to{" "}
                <span className="font-medium text-on-surface">
                  {state.email}
                </span>
                . Click it to activate your account, then sign in.
              </p>
            </div>
            <div className="space-y-3 text-left">
              <p className="text-center text-[13px] text-on-surface-variant">
                Didn&apos;t get it? Check spam, or resend below.
              </p>
              <ResendVerification email={state.email} />
            </div>
            <p className="text-center text-[14px] text-on-surface-variant">
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Back to sign in
              </Link>
            </p>
          </div>
        ) : (
          <div className="space-y-6">
          <div className="flex flex-col gap-3">
            <form action={googleLogin} className="contents">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-sm border border-outline-variant px-4 py-3 text-on-surface transition-colors duration-200 hover:border-outline hover:bg-surface-container-low active:scale-[0.99]"
              >
                <GoogleIcon />
                <span className="text-[14px] font-medium">
                  Continue with Google
                </span>
              </button>
            </form>
          </div>

          <div className="flex items-center gap-4">
            <hr className="flex-grow border-t border-outline-variant/50" />
            <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
              Or
            </span>
            <hr className="flex-grow border-t border-outline-variant/50" />
          </div>

          <form action={formAction} className="space-y-6">
            {state?.message && (
              <p
                role="alert"
                className="rounded-sm border border-error/30 bg-error/5 px-3 py-2 text-[13px] font-medium text-error"
              >
                {state.message}
              </p>
            )}

            <div className="space-y-3">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-[14px] font-medium text-on-surface"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  className="w-full rounded-sm border border-outline-variant bg-surface-container-lowest px-4 py-3 text-[16px] leading-[1.6] text-on-surface transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {state?.errors?.name && (
                  <p className="mt-1 text-[12px] text-error">
                    {state.errors.name[0]}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[14px] font-medium text-on-surface"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="jane@example.com"
                  className="w-full rounded-sm border border-outline-variant bg-surface-container-lowest px-4 py-3 text-[16px] leading-[1.6] text-on-surface transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {state?.errors?.email && (
                  <p className="mt-1 text-[12px] text-error">
                    {state.errors.email[0]}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-[14px] font-medium text-on-surface"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full rounded-sm border border-outline-variant bg-surface-container-lowest px-4 py-3 text-[16px] leading-[1.6] text-on-surface transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {state?.errors?.password && (
                  <p className="mt-1 text-[12px] text-error">
                    {state.errors.password[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-5 items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 cursor-pointer rounded-sm border-outline-variant accent-primary"
                />
              </div>
              <label
                htmlFor="terms"
                className="cursor-pointer text-[14px] leading-tight text-on-surface-variant"
              >
                I agree to NEWSERA&apos;s{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-primary py-4 text-[14px] font-medium text-on-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pending ? "Creating account…" : "Create Account"}
              {!pending && <ArrowRightIcon />}
            </button>
          </form>
          </div>
        )}

        <footer className="mt-12 text-center">
          <p className="text-[16px] leading-[1.6] text-on-surface-variant">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[14px] font-medium text-primary hover:underline"
            >
              Log in here
            </Link>
            .
          </p>
        </footer>
      </div>
    </div>
  );
}

function MailCheckIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      <path d="m16 19 2 2 4-4" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
