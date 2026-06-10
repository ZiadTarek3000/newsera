import type { Metadata } from "next";
import SiteHeader from "../_components/site-header";
import SiteFooter from "../_components/site-footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of Newsera.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-[760px] px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
        <h1 className="font-serif text-[32px] font-bold tracking-[-0.02em] text-on-surface sm:text-[44px]">
          Terms of Service
        </h1>
        <p className="mt-3 text-[14px] text-on-surface-variant">
          Last updated: June 2026
        </p>

        <div className="mt-10 space-y-8 text-[16px] leading-relaxed text-on-surface-variant">
          <section>
            <h2 className="mb-3 font-serif text-[22px] font-semibold text-on-surface">
              Acceptance of terms
            </h2>
            <p>
              By accessing or using Newsera, you agree to these terms. If you do
              not agree, please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-[22px] font-semibold text-on-surface">
              Use of the service
            </h2>
            <p>
              Newsera aggregates headlines and links to original publishers. You
              agree to use the service lawfully and not to attempt to disrupt it,
              access it through automated means beyond normal browsing, or misuse
              other users&apos; data.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-[22px] font-semibold text-on-surface">
              Accounts
            </h2>
            <p>
              You are responsible for the activity on your account and for keeping
              your credentials secure. You may sign in with email and password or
              with Google. Notify your administrator of any unauthorized use.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-[22px] font-semibold text-on-surface">
              Content and intellectual property
            </h2>
            <p>
              Article headlines, summaries, and images belong to their respective
              publishers and are shown for reference, with links to the source.
              Newsera does not claim ownership of third-party content.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-[22px] font-semibold text-on-surface">
              Disclaimer
            </h2>
            <p>
              The service is provided &ldquo;as is,&rdquo; without warranties of
              any kind. Aggregated content may contain inaccuracies; always refer
              to the original publisher for the authoritative version.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-[22px] font-semibold text-on-surface">
              Changes
            </h2>
            <p>
              We may update these terms from time to time. Continued use after
              changes constitutes acceptance. This document is a template for a
              portfolio project and is not legal advice.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
