import Link from "next/link";
import HeaderAuth from "./header-auth";
import ThemeToggle from "./theme-toggle";
import { BookmarksIcon, MenuIcon, SearchIcon } from "./icons";

const navLinks = [
  { label: "Top Headlines", href: "#", active: true },
  { label: "Business", href: "#", active: false },
  { label: "Technology", href: "#", active: false },
  { label: "Science", href: "#", active: false },
];

export default function SiteHeader() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-outline-variant/30 bg-surface/80 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-8">
        <Link
          href="/"
          className="font-serif text-[32px] font-bold tracking-tight text-on-surface transition-colors hover:text-primary"
        >
          NEWSERA
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
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
        </nav>

        <div className="flex items-center gap-6">
          <button
            type="button"
            aria-label="Saved articles"
            className="text-on-surface-variant transition-colors hover:text-primary active:scale-90"
          >
            <BookmarksIcon />
          </button>
          <button
            type="button"
            aria-label="Search"
            className="text-on-surface-variant transition-colors hover:text-primary active:scale-90"
          >
            <SearchIcon />
          </button>
          <ThemeToggle className="text-on-surface-variant transition-colors hover:text-primary active:scale-90" />
          <HeaderAuth />
          <button
            type="button"
            aria-label="Open menu"
            className="text-on-surface-variant md:hidden"
          >
            <MenuIcon />
          </button>
        </div>
      </div>
    </header>
  );
}
