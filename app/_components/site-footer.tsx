import Link from "next/link";

const footerLinks = [
  { label: "Top Headlines", href: "/" },
  { label: "Technology", href: "/category/technology" },
  { label: "Business", href: "/category/business" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function SiteFooter() {
  return (
    <footer className="w-full border-t border-outline-variant/50 bg-surface-container-low py-16">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-8 px-4 text-center sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-serif text-[24px] font-bold text-on-surface"
        >
          NEWSERA
        </Link>
        <p className="max-w-md text-on-surface-variant">
          Aggregating the world&apos;s most important headlines from trusted
          sources in real-time.
        </p>

        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 sm:gap-x-12">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="link-underline text-[12px] font-semibold tracking-[0.1em] text-on-surface-variant transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-[10px] font-semibold tracking-[0.1em] text-on-surface-variant/60">
          © 2026 NEWSERA Aggregator. Data provided by Currents API.
        </p>
      </div>
    </footer>
  );
}
