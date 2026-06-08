"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useBookmarkStore } from "@/store/bookmark-store";
import { toggleBookmark } from "@/lib/actions/bookmarks";
import { BookmarkIcon } from "./icons";

type BookmarkButtonProps = {
  articleId: string;
  className?: string;
  iconClassName?: string;
};

export default function BookmarkButton({
  articleId,
  className,
  iconClassName = "size-6",
}: BookmarkButtonProps) {
  const { status } = useSession();
  const router = useRouter();
  const bookmarked = useBookmarkStore((s) => s.ids.has(articleId));
  const toggle = useBookmarkStore((s) => s.toggle);
  const [pending, startTransition] = useTransition();

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    toggle(articleId);
    startTransition(async () => {
      const res = await toggleBookmark(articleId);
      if ("error" in res) toggle(articleId);
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
