"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center text-on-background">
      <p className="text-[14px] font-semibold uppercase tracking-[0.2em] text-error">
        Something went wrong
      </p>
      <h1 className="mt-4 font-serif text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-on-surface sm:text-[44px]">
        We hit an unexpected error
      </h1>
      <p className="mt-4 max-w-md text-[16px] leading-relaxed text-on-surface-variant">
        Please try again. If the problem persists, come back in a little while.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-primary px-8 py-3.5 text-[13px] font-semibold tracking-[0.1em] text-on-primary shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.99]"
        >
          Try again
        </button>
        {/* Full reload (not <Link>) to fully reset a broken React tree. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          className="rounded-lg border border-outline-variant px-8 py-3.5 text-[13px] font-semibold tracking-[0.1em] text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
        >
          Back to home
        </a>
      </div>
    </div>
  );
}
