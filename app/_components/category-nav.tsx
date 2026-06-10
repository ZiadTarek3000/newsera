"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HOME_NAV, NAV_CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";

/**
 * Unified top-navigation category bar, shared by every page header so the
 * headline categories are consistent across the entire application. Each item
 * links to its corresponding section; the active item is derived from the URL,
 * but the clicked item highlights *immediately* (optimistically) so a tap on the
 * bar responds instantly, before the destination route has finished loading.
 */
export default function CategoryNav({
  className,
  variant = "desktop",
}: {
  className?: string;
  variant?: "desktop" | "mobile";
}) {
  const pathname = usePathname();
  const activeSlug = pathname.startsWith("/category/")
    ? decodeURIComponent(pathname.split("/")[2] ?? "")
    : "";

  // Slug the user just clicked, highlighted instantly until the URL catches up.
  // Cleared during render (not via an effect) once the route settles.
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setPendingSlug(null);
  }

  const items = [HOME_NAV, ...NAV_CATEGORIES];
  const realActive = (slug: string) =>
    slug === "" ? pathname === "/" : slug === activeSlug;
  const isActive = (slug: string) =>
    pendingSlug !== null ? pendingSlug === slug : realActive(slug);

  if (variant === "mobile") {
    return (
      <nav className={cn("flex flex-col gap-1", className)}>
        {items.map((item) => {
          const active = isActive(item.slug);
          return (
            <Link
              key={item.slug || "home"}
              href={item.slug ? `/category/${item.slug}` : "/"}
              onClick={() => setPendingSlug(item.slug)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-2 text-[14px] font-semibold tracking-[0.05em] transition-colors",
                active
                  ? "bg-surface-container-low text-primary"
                  : "text-on-surface-variant hover:text-on-surface",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav
      aria-label="Categories"
      className={cn("hidden items-center gap-8 md:flex", className)}
    >
      {items.map((item) => {
        const active = isActive(item.slug);
        return (
          <Link
            key={item.slug || "home"}
            href={item.slug ? `/category/${item.slug}` : "/"}
            onClick={() => setPendingSlug(item.slug)}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "border-b-2 border-primary pb-1 text-[12px] font-semibold tracking-[0.1em] text-primary"
                : "link-underline text-[12px] font-semibold tracking-[0.1em] text-on-surface-variant transition-colors hover:text-on-surface"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
