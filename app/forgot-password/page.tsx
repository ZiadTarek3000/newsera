"use client";

import { useActionState } from "react";
import Link from "next/link";
import Logo from "../_components/logo";
import { forgotPasswordAction } from "@/lib/actions/auth";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(
    forgotPasswordAction,
    undefined,
  );

  return (
    <div className="flex min-h-screen flex-grow items-center justify-center bg-background p-4 text-on-background sm:p-6">
      <div className="animate-rise-in w-full max-w-[480px] rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] sm:p-10 md:p-12">
        <header className="mb-8 text-center">
          <h1 className="mb-1 text-[36px] leading-[1.1] sm:text-[40px]">
            <Logo className="uppercase" />
          </h1>
          <p className="text-[15px] leading-[1.6] text-on-surface-variant">
            Reset your password
          </p>
        </header>

        {state?.success ? (
          <div className="space-y-6 text-center">
            <p className="rounded border border-primary/30 bg-primary/5 px-3 py-3 text-[14px] font-medium text-primary">
              {state.message}
            </p>
            <p className="text-[14px] text-on-surface-variant">
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Back to sign in
              </Link>
            </p>
          </div>
        ) : (
          <form action={formAction} className="space-y-5">
            <p className="text-[14px] leading-[1.6] text-on-surface-variant">
              Enter the email associated with your account and we&apos;ll send
              you a link to reset your password.
            </p>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                className="w-full rounded border border-outline-variant bg-surface-container-lowest px-4 py-3 text-[14px] font-medium text-on-surface placeholder-outline transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {state?.errors?.email && (
                <p className="mt-1 text-[12px] text-error">
                  {state.errors.email[0]}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded bg-primary px-6 py-3 text-[14px] font-medium text-on-primary shadow-sm transition-all duration-300 hover:bg-on-primary-fixed-variant hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pending ? "Sending…" : "Send reset link"}
            </button>
            <p className="text-center text-[14px] text-on-surface-variant">
              Remembered it?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Back to sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
