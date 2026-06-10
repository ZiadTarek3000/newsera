"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HeaderAuth from "./header-auth";
import CategoryNav from "./category-nav";
import ThemeToggle from "./theme-toggle";
import { BookmarksIcon, MenuIcon } from "./icons";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu as soon as a navigation happens, so it never lingers
  // open over the newly-loaded page. Reset during render (the React-recommended
  // alternative to a state-setting effect) so it's applied before paint.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-outline-variant/30 bg-surface/80 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-serif text-[26px] font-bold tracking-tight text-on-surface transition-colors hover:text-primary sm:text-[32px]"
        >
          NEWSERA
        </Link>

        <CategoryNav />

        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/dashboard"
            aria-label="Saved articles"
            className="text-on-surface-variant transition-colors hover:text-primary active:scale-90"
          >
            <BookmarksIcon />
          </Link>
          <ThemeToggle className="text-on-surface-variant transition-colors hover:text-primary active:scale-90" />
          <HeaderAuth />
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="text-on-surface-variant md:hidden"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {menuOpen && (
        <CategoryNav
          variant="mobile"
          className="border-t border-outline-variant/30 px-4 py-4 sm:px-6 md:hidden"
        />
      )}
    </header>
  );
}
