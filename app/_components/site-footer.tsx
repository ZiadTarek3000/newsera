import Link from "next/link";
import { ApiIcon, CodeIcon, MailIcon } from "./icons";

const footerLinks = [
  { label: "About the App", href: "#" },
  { label: "Sources", href: "#" },
  { label: "API Documentation", href: "#" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

export default function SiteFooter() {
  return (
    <footer className="w-full border-t border-outline-variant/50 bg-surface-container-low py-16">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-8 px-8 text-center">
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

        <nav className="flex flex-wrap justify-center gap-x-12 gap-y-4">
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

        <div className="flex gap-6">
          <a
            href="#"
            aria-label="Source code"
            className="text-on-surface-variant transition-colors hover:text-primary"
          >
            <CodeIcon />
          </a>
          <a
            href="#"
            aria-label="API"
            className="text-on-surface-variant transition-colors hover:text-primary"
          >
            <ApiIcon />
          </a>
          <a
            href="#"
            aria-label="Email"
            className="text-on-surface-variant transition-colors hover:text-primary"
          >
            <MailIcon />
          </a>
        </div>

        <p className="text-[10px] font-semibold tracking-[0.1em] text-on-surface-variant/60">
          © 2024 NEWSERA Aggregator. Data provided by Currents API.
        </p>
      </div>
    </footer>
  );
}
