import type { Metadata } from "next";
import SiteHeader from "../_components/site-header";
import SiteFooter from "../_components/site-footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Newsera collects, uses, and protects your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-[760px] px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
        <h1 className="font-serif text-[32px] font-bold tracking-[-0.02em] text-on-surface sm:text-[44px]">
          Privacy Policy
        </h1>
        <p className="mt-3 text-[14px] text-on-surface-variant">
          Last updated: June 2026
        </p>

        <div className="mt-10 space-y-8 text-[16px] leading-relaxed text-on-surface-variant">
          <section>
            <h2 className="mb-3 font-serif text-[22px] font-semibold text-on-surface">
              Overview
            </h2>
            <p>
              Newsera is a news aggregator. This policy explains what information
              we collect when you use the service, how we use it, and the choices
              you have. By using Newsera you agree to the practices described
              here.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-[22px] font-semibold text-on-surface">
              Information we collect
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong className="text-on-surface">Account data</strong> — your
                name, email address, and, for password accounts, a securely
                hashed password. If you sign in with Google, we receive your
                basic profile and email from Google.
              </li>
              <li>
                <strong className="text-on-surface">Usage data</strong> — the
                articles you bookmark and your reading history, used to power your
                dashboard and recommendations.
              </li>
              <li>
                <strong className="text-on-surface">Preferences</strong> — your
                theme, favorite categories, and notification settings.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-[22px] font-semibold text-on-surface">
              How we use information
            </h2>
            <p>
              We use your information to authenticate you, personalize your feed,
              remember your bookmarks and preferences, and—if you opt in—send the
              daily briefing. We do not sell your personal information.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-[22px] font-semibold text-on-surface">
              Third-party services
            </h2>
            <p>
              Article content is sourced from the Currents API and links back to
              the original publishers, whose own policies govern their sites.
              Authentication is provided via Auth.js and Google OAuth, and
              transactional email is delivered through Brevo.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-[22px] font-semibold text-on-surface">
              Your choices
            </h2>
            <p>
              You can update your preferences or remove bookmarks at any time from
              your dashboard, and you may request deletion of your account by
              contacting us. Disabling the daily briefing stops those emails.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-[22px] font-semibold text-on-surface">
              Contact
            </h2>
            <p>
              Questions about this policy can be sent to your Newsera
              administrator. This document is a template for a portfolio project
              and is not legal advice.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
