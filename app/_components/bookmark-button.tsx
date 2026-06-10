"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { ArticleSummary } from "@/types";
import { useBookmarkStore } from "@/store/bookmark-store";
import { useSavedStore } from "@/store/saved-store";
import { toggleBookmark } from "@/lib/actions/bookmarks";
import { BookmarkIcon } from "./icons";

type BookmarkButtonProps = {
  articleId: string;
  /**
   * Pass the full summary to keep the Saved Articles list in sync in real time:
   * saving adds this card to the list instantly, un-saving removes it. Omit it
   * for places that only need the icon's saved/unsaved state.
   */
  article?: ArticleSummary;
  className?: string;
  iconClassName?: string;
};

export default function BookmarkButton({
  articleId,
  article,
  className,
  iconClassName = "size-6",
}: BookmarkButtonProps) {
  const { status } = useSession();
  const router = useRouter();
  const bookmarked = useBookmarkStore((s) => s.ids.has(articleId));
  const toggle = useBookmarkStore((s) => s.toggle);
  const savedAdd = useSavedStore((s) => s.add);
  const savedRemove = useSavedStore((s) => s.remove);
  const [pending, startTransition] = useTransition();

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    const willSave = !bookmarked;

    // Optimistic: flip the icon and reflect the change in the saved list now.
    toggle(articleId);
    if (article) {
      if (willSave) savedAdd(article);
      else savedRemove(articleId);
    }

    startTransition(async () => {
      const res = await toggleBookmark(articleId);
      if ("error" in res) {
        // Roll back both the icon and the saved list on failure.
        toggle(articleId);
        if (article) {
          if (willSave) savedRemove(articleId);
          else savedAdd(article);
        }
      }
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "Remove bookmark" : "Save article"}
      className={`transition-transform hover:scale-110 active:scale-95 ${className ?? ""}`}
    >
      <BookmarkIcon className={iconClassName} filled={bookmarked} />
    </button>
  );
}
