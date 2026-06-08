import Link from "next/link";

const footerLinks = [
  { label: "About", href: "#" },
  { label: "Archives", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
];

export default function AppFooter() {
  return (
    <footer className="w-full border-t border-outline-variant bg-surface-container-low py-16">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-8 px-5 md:px-16">
        <div className="font-serif text-[32px] font-semibold text-on-surface">
          NEWSERA
        </div>
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
        <p className="text-[12px] font-semibold tracking-[0.1em] text-on-surface-variant">
          © 2024 NEWSERA. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
