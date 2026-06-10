"use client";

import { Suspense, useActionState, useState } from "react";
import Link from "next/link";
import Logo from "../_components/logo";
import OAuthError from "../_components/oauth-error";
import ResendVerification from "../_components/resend-verification";
import { googleLogin, loginAction } from "@/lib/actions/auth";

const CROSS_TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231b1b24' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background text-on-background">
      <div className="bg-auth-radial absolute inset-0 z-0 opacity-80" />
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{ backgroundImage: CROSS_TEXTURE }}
      />

      <main className="relative z-10 w-full max-w-md px-6 py-12">
        <div className="glass-panel animate-rise-in flex flex-col items-center rounded-lg p-6 sm:p-8">
          <div className="mb-10 w-full text-center sm:mb-12">
            <h1 className="mb-1 text-[40px] leading-[1.1] tracking-[-0.02em] sm:text-[48px]">
              <Logo />
            </h1>
            <p className="text-[14px] font-medium leading-[1.4] text-on-surface-variant">
              Sign in to your account
            </p>
          </div>

          <div className="mb-6 flex w-full flex-col gap-3">
            <Suspense fallback={null}>
              <OAuthError />
            </Suspense>
            <form action={googleLogin} className="contents">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded border border-outline-variant px-4 py-3 text-on-surface transition-colors duration-200 hover:border-outline hover:bg-surface-container-low active:scale-[0.99]"
              >
                <GoogleIcon />
                <span className="text-[14px] font-medium">
                  Continue with Google
                </span>
              </button>
            </form>
            <div className="flex items-center gap-4">
              <div className="flex-1 border-t border-outline-variant/50" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
                Or
              </span>
              <div className="flex-1 border-t border-outline-variant/50" />
            </div>
          </div>

          <form action={formAction} className="flex w-full flex-col gap-3">
            {state?.message && (
              <p
                role="alert"
                className={`rounded border px-3 py-2 text-[13px] font-medium ${
                  state.unverified
                    ? "border-primary/30 bg-primary/5 text-primary"
                    : "border-error/30 bg-error/5 text-error"
                }`}
              >
                {state.message}
              </p>
            )}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-[12px] font-semibold uppercase leading-none tracking-[0.08em] text-on-surface-variant"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
                  <MailIcon />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  className="w-full rounded border border-outline-variant bg-surface-container-lowest py-3 pl-10 pr-4 text-[14px] font-medium text-on-surface placeholder-outline transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              {state?.errors?.email && (
                <p className="text-[12px] text-error">{state.errors.email[0]}</p>
              )}
            </div>

            <div className="mt-1 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-[12px] font-semibold uppercase leading-none tracking-[0.08em] text-on-surface-variant"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[14px] font-medium text-primary transition-colors hover:text-on-primary-fixed-variant"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
                  <LockIcon />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded border border-outline-variant bg-surface-container-lowest py-3 pl-10 pr-10 text-[14px] font-medium text-on-surface placeholder-outline transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline transition-colors hover:text-on-surface-variant"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {state?.errors?.password && (
                <p className="text-[12px] text-error">
                  {state.errors.password[0]}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={pending}
              className="mt-6 w-full transform rounded bg-primary px-6 py-3 text-[14px] font-medium text-on-primary shadow-sm transition-all duration-300 hover:bg-on-primary-fixed-variant hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pending ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {state?.unverified && (
            <div className="mt-4 w-full">
              <ResendVerification email={state.email} />
            </div>
          )}

          <div className="mt-6 w-full text-center">
            <p className="text-[14px] font-medium text-on-surface-variant">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary underline-offset-4 decoration-primary/30 transition-all hover:underline"
              >
                Subscribe Now
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[12px] uppercase tracking-[0.08em] text-on-surface-variant/70">
            © 2026 Newsera ·{" "}
            <Link href="/privacy" className="transition-colors hover:text-primary">
              Privacy
            </Link>{" "}
            ·{" "}
            <Link href="/terms" className="transition-colors hover:text-primary">
              Terms
            </Link>
          </p>
        </div>
      </main>
    </div>
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

function MailIcon() {
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
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LockIcon() {
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
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon() {
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
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
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
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c6.5 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3.5 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <path d="m2 2 20 20" />
    </svg>
  );
}
