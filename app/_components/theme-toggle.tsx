"use client";

import { useTheme } from "next-themes";
import { ContrastIcon } from "./icons";

type ThemeToggleProps = {
  className?: string;
};

/** Toggles light/dark. Renders a theme-agnostic icon (no hydration mismatch). */
export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={className}
    >
      <ContrastIcon />
    </button>
  );
}
