"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useBookmarkStore } from "@/store/bookmark-store";
import { getMyBookmarkIds } from "@/lib/actions/bookmarks";

export default function BookmarkHydrator() {
  const { status } = useSession();
  const setAll = useBookmarkStore((s) => s.setAll);
  const clear = useBookmarkStore((s) => s.clear);

  useEffect(() => {
    // Drop any locally-persisted ids once we know there's no signed-in user, so
    // a previous account's saved state never leaks across sessions.
    if (status === "unauthenticated") {
      clear();
      return;
    }
    if (status !== "authenticated") return;

    // The persisted set gives an instant optimistic paint; this overwrites it
    // with the server's source of truth as soon as it resolves.
    let active = true;
    getMyBookmarkIds()
      .then((ids) => {
        if (active) setAll(ids);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [status, setAll, clear]);

  return null;
}
