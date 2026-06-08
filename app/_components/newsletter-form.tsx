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
          placeholder="Email Address"
          aria-label="Email Address"
          className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-low px-6 py-4 text-[16px] shadow-inner outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary md:w-80"
        />
        <button
          type="submit"
          className="rounded-lg bg-primary px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-on-primary shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary-container hover:shadow-lg active:translate-y-0 active:scale-[0.98]"
        >
          Subscribe
        </button>
      </form>
      <p className="mt-6 text-[10px] font-semibold tracking-[0.1em] text-outline">
        {subscribed ? "Subscribed! Check your inbox." : "Unsubscribe anytime."}
      </p>
    </>
  );
}
