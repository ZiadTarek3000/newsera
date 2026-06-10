"use client";

import { useState } from "react";
import Link from "next/link";
import HeaderAuth from "../../_components/header-auth";
import CategoryNav from "../../_components/category-nav";
import ThemeToggle from "../../_components/theme-toggle";
import { MenuIcon } from "../../_components/icons";

export default function ArticleHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-outline-variant/30 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 lg:gap-12">
          <Link
            href="/"
            className="font-serif text-[26px] font-bold tracking-tight text-on-surface transition-colors hover:text-primary sm:text-[32px]"
          >
            NEWSERA
          </Link>
          <CategoryNav />
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <ThemeToggle className="text-primary transition-all duration-300 hover:opacity-80 active:scale-90" />
          <HeaderAuth />
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="text-on-surface md:hidden"
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
    </nav>
  );
}
