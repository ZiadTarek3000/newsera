"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <>
      <form
        className="flex flex-col justify-center gap-4 md:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          setSubscribed(true);
        }}
      >
        <input
          type="email"
          required
          disabled={subscribed}
          placeholder="Email Address"
          aria-label="Email Address"
          className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-low px-6 py-4 text-[16px] shadow-inner outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60 md:w-80"
        />
        <button
          type="submit"
          disabled={subscribed}
          aria-live="polite"
          className={`flex items-center justify-center gap-2 rounded-lg px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.1em] shadow-md transition-all active:translate-y-0 active:scale-[0.98] disabled:cursor-default ${
            subscribed
              ? "bg-primary/15 text-primary"
              : "bg-primary text-on-primary hover:-translate-y-0.5 hover:bg-primary-container hover:shadow-lg"
          }`}
        >
          {subscribed ? (
            <>
              <CheckIcon />
              Subscribed
            </>
          ) : (
            "Subscribe"
          )}
        </button>
      </form>
      <p
        role="status"
        className="mt-6 text-[10px] font-semibold tracking-[0.1em] text-outline"
      >
        {subscribed ? "Subscribed! Check your inbox." : "Unsubscribe anytime."}
      </p>
    </>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
