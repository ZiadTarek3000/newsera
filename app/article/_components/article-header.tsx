import Link from "next/link";
import HeaderAuth from "../../_components/header-auth";
import ThemeToggle from "../../_components/theme-toggle";
import { MenuIcon, SearchIcon } from "../../_components/icons";

const navLinks = [
  { label: "Latest", href: "#", active: false },
  { label: "Analysis", href: "#", active: true },
  { label: "Culture", href: "#", active: false },
  { label: "Politics", href: "#", active: false },
];

export default function ArticleHeader() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-outline-variant/30 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-8">
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="font-serif text-[32px] font-bold tracking-tight text-on-surface transition-colors hover:text-primary"
          >
            NEWSERA
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={
                  link.active
                    ? "border-b-2 border-primary pb-1 text-[12px] font-semibold tracking-[0.1em] text-primary"
                    : "link-underline text-[12px] font-semibold tracking-[0.1em] text-on-surface-variant transition-colors hover:text-on-surface"
                }
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button
            type="button"
            aria-label="Search"
            className="text-primary transition-all duration-300 hover:opacity-80 active:scale-90"
          >
            <SearchIcon />
          </button>
          <ThemeToggle className="text-primary transition-all duration-300 hover:opacity-80 active:scale-90" />
          <HeaderAuth />
          <button
            type="button"
            aria-label="Open menu"
            className="text-on-surface md:hidden"
          >
            <MenuIcon />
          </button>
        </div>
      </div>
    </nav>
  );
}
