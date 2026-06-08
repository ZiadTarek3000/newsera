import Image from "next/image";
import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";
import type { CurrentUser } from "@/types";
import ThemeToggle from "../../_components/theme-toggle";
import { LogoutIcon } from "../../_components/icons";

const navLinks = ["Latest", "Analysis", "Culture", "Politics"];

type DashboardHeaderProps = {
  user: CurrentUser;
};

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const initial = (user.name ?? user.email).charAt(0).toUpperCase();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-outline-variant/30 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-5 md:px-16">
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="font-serif text-[40px] font-bold tracking-tight text-on-surface transition-colors hover:text-primary md:text-[32px]"
          >
            NEWSERA
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((label) => (
              <a
                key={label}
                href="#"
                className="link-underline text-[12px] font-semibold tracking-[0.1em] text-on-surface-variant transition-colors hover:text-on-surface"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-1 text-[12px] font-semibold tracking-[0.1em] text-on-surface-variant transition-colors hover:text-error active:scale-95"
            >
              <LogoutIcon className="size-[18px]" />
              Logout
            </button>
          </form>
          <ThemeToggle className="text-primary transition-opacity duration-300 hover:opacity-80 active:scale-95" />
          <div className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-surface-container-high text-[15px] font-semibold text-on-surface-variant">
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
        </div>
      </div>
    </header>
  );
}
