"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useBookmarkStore } from "@/store/bookmark-store";
import { getMyBookmarkIds } from "@/lib/actions/bookmarks";

export default function BookmarkHydrator() {
  const { status } = useSession();
  const setAll = useBookmarkStore((s) => s.setAll);

  useEffect(() => {
    if (status !== "authenticated") return;
    let active = true;
    getMyBookmarkIds()
      .then((ids) => {
        if (active) setAll(ids);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [status, setAll]);

  return null;
}
