"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";
import type { CurrentUser } from "@/types";
import CategoryNav from "../../_components/category-nav";
import ThemeToggle from "../../_components/theme-toggle";
import { LogoutIcon, MenuIcon } from "../../_components/icons";

type DashboardHeaderProps = {
  user: CurrentUser;
};

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const initial = (user.name ?? user.email).charAt(0).toUpperCase();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-outline-variant/30 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-4 sm:px-6 md:px-16">
        <div className="flex items-center gap-6 lg:gap-12">
          <Link
            href="/"
            className="font-serif text-[26px] font-bold tracking-tight text-on-surface transition-colors hover:text-primary sm:text-[28px] md:text-[32px]"
          >
            NEWSERA
          </Link>
          <CategoryNav />
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-1 text-[12px] font-semibold tracking-[0.1em] text-on-surface-variant transition-colors hover:text-error active:scale-95"
            >
              <LogoutIcon className="size-[18px]" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </form>
          <ThemeToggle className="text-primary transition-opacity duration-300 hover:opacity-80 active:scale-95" />
          <div className="flex size-9 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-surface-container-high text-[15px] font-semibold text-on-surface-variant sm:size-10">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "User profile"}
                width={40}
                height={40}
                className="size-full object-cover"
              />
            ) : (
              initial
            )}
          </div>
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
