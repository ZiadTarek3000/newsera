"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPasswordAction } from "@/lib/actions/auth";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(
    resetPasswordAction,
    undefined,
  );

  if (state?.success) {
    return (
      <div className="space-y-6 text-center">
        <p className="rounded border border-primary/30 bg-primary/5 px-3 py-3 text-[14px] font-medium text-primary">
          {state.message}
        </p>
        <Link
          href="/login"
          className="inline-flex w-full items-center justify-center rounded bg-primary py-3 text-[14px] font-medium text-on-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.99]"
        >
          Continue to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="token" value={token} />

      {state?.message && (
        <p
          role="alert"
          className="rounded border border-error/30 bg-error/5 px-3 py-2 text-[13px] font-medium text-error"
        >
          {state.message}
        </p>
      )}

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant"
        >
          New Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className="w-full rounded border border-outline-variant bg-surface-container-lowest px-4 py-3 text-[14px] font-medium text-on-surface placeholder-outline transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {state?.errors?.password && (
          <p className="mt-1 text-[12px] text-error">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirm"
          className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant"
        >
          Confirm Password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className="w-full rounded border border-outline-variant bg-surface-container-lowest px-4 py-3 text-[14px] font-medium text-on-surface placeholder-outline transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {state?.errors?.confirm && (
          <p className="mt-1 text-[12px] text-error">
            {state.errors.confirm[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-primary px-6 py-3 text-[14px] font-medium text-on-primary shadow-sm transition-all duration-300 hover:bg-on-primary-fixed-variant hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
