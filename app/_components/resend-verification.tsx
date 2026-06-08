"use client";

import { useActionState } from "react";
import { resendVerificationAction } from "@/lib/actions/auth";

type Props = {
  /** When provided, the email is fixed and submitted via a hidden field. */
  email?: string;
  className?: string;
};

export default function ResendVerification({ email, className }: Props) {
  const [state, formAction, pending] = useActionState(
    resendVerificationAction,
    undefined,
  );

  return (
    <form action={formAction} className={className}>
      {state?.message && (
        <p
          role="status"
          className="mb-3 rounded-sm border border-primary/30 bg-primary/5 px-3 py-2 text-[13px] font-medium text-primary"
        >
          {state.message}
        </p>
      )}

      {email ? (
        <input type="hidden" name="email" value={email} />
      ) : (
        <div className="mb-3">
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            className="w-full rounded-sm border border-outline-variant bg-surface-container-lowest px-4 py-3 text-[14px] font-medium text-on-surface placeholder-outline transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {state?.errors?.email && (
            <p className="mt-1 text-[12px] text-error">{state.errors.email[0]}</p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-sm border border-outline-variant px-4 py-3 text-[14px] font-medium text-on-surface transition-colors duration-200 hover:border-outline hover:bg-surface-container-low active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Sending…" : "Resend verification email"}
      </button>
    </form>
  );
}
