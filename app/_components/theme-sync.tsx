"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { setThemePreference } from "@/lib/actions/preferences";

export default function ThemeSync({ initialTheme }: { initialTheme: string }) {
  const { theme, setTheme } = useTheme();
  const applied = useRef(false);

  useEffect(() => {
    if (!applied.current) {
      applied.current = true;
      if (initialTheme && initialTheme !== "system" && initialTheme !== theme) {
        setTheme(initialTheme);
      }
      return;
    }
    if (theme) void setThemePreference(theme);
  }, [theme, initialTheme, setTheme]);

  return null;
}
