"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ArticleSummary } from "@/types";
import { cn } from "@/lib/utils";
import { toggleBookmark } from "@/lib/actions/bookmarks";
import { useBookmarkStore } from "@/store/bookmark-store";
import { useSavedStore } from "@/store/saved-store";
import { BookmarkIcon, BookmarkRemoveIcon } from "../../_components/icons";

type SavedArticlesProps = {
  articles: ArticleSummary[];
};

export default function SavedArticles({ articles }: SavedArticlesProps) {
  const [removing, setRemoving] = useState<string[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const storeToggle = useBookmarkStore((s) => s.toggle);

  const seed = useSavedStore((s) => s.seed);
  const seeded = useSavedStore((s) => s.seeded);
  const storeArticles = useSavedStore((s) => s.articles);
  const removeSaved = useSavedStore((s) => s.remove);

  // Seed (and re-sync on every server refresh, e.g. after revalidatePath) so the
  // shared store is the source of truth. SSR/first paint uses the prop to stay
  // hydration-safe; the client store takes over once seeded.
  useEffect(() => {
    seed(articles);
  }, [articles, seed]);

  const items = seeded ? storeArticles : articles;

  // Briefly highlight cards that were just added, so a save lands with clear,
  // visible feedback rather than silently appearing.
  const knownIds = useRef<Set<string> | null>(null);
  const [flash, setFlash] = useState<string[]>([]);
  useEffect(() => {
    const ids = new Set(items.map((a) => a.id));
    if (knownIds.current === null) {
      knownIds.current = ids; // first run: don't flash the initial list
      return;
    }
    const added = [...ids].filter((id) => !knownIds.current!.has(id));
    knownIds.current = ids;
    if (added.length === 0) return;
    setFlash((prev) => [...prev, ...added]);
    const t = setTimeout(
      () => setFlash((prev) => prev.filter((id) => !added.includes(id))),
      1200,
    );
    return () => clearTimeout(t);
  }, [items]);

  const remove = (id: string) => {
    setRemoving((prev) => [...prev, id]);
    storeToggle(id);
    void toggleBookmark(id);
    setTimeout(() => {
      removeSaved(id);
      setRemoving((prev) => prev.filter((rid) => rid !== id));
    }, 300);
  };

  return (
    <div className="lg:col-span-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-serif text-[26px] font-semibold sm:text-[32px]">
          <BookmarkIcon className="size-6 text-secondary sm:size-7" />
          Saved Articles
        </h2>
        <div className="flex rounded-lg bg-surface-container-low p-1">
          <button
            type="button"
            onClick={() => setView("grid")}
            className={
              view === "grid"
                ? "rounded bg-primary px-4 py-1.5 text-[12px] font-semibold tracking-[0.1em] text-on-primary shadow-sm transition-all"
                : "rounded px-4 py-1.5 text-[12px] font-semibold tracking-[0.1em] text-on-surface-variant transition-all hover:text-on-surface"
            }
          >
            Grid
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={
              view === "list"
                ? "rounded bg-primary px-4 py-1.5 text-[12px] font-semibold tracking-[0.1em] text-on-primary shadow-sm transition-all"
                : "rounded px-4 py-1.5 text-[12px] font-semibold tracking-[0.1em] text-on-surface-variant transition-all hover:text-on-surface"
            }
          >
            List
          </button>
        </div>
      </div>

      <div
        className={
          view === "grid"
            ? "grid grid-cols-1 gap-4 md:grid-cols-2"
            : "grid grid-cols-1 gap-4"
        }
      >
        {items.map((article) => (
          <div
            key={article.id}
            className={cn(
              "group overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container-lowest ring-primary transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl",
              removing.includes(article.id)
                ? "scale-95 opacity-0"
                : "opacity-100",
              flash.includes(article.id)
                ? "ring-2 shadow-lg"
                : "ring-0",
            )}
          >
            <Link
              href={`/article/${article.slug}`}
              className="relative block aspect-[16/9] overflow-hidden"
            >
              <Image
                src={article.image}
                alt={article.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </Link>
            <div className="p-6">
              <span className="mb-2 block text-[12px] font-semibold uppercase tracking-wider text-secondary">
                {article.category}
              </span>
              <Link href={`/article/${article.slug}`}>
                <h3 className="mb-2 line-clamp-2 text-[16px] font-medium transition-colors group-hover:text-primary">
                  {article.title}
                </h3>
              </Link>
              <p className="mb-3 line-clamp-2 text-[13px] text-on-surface-variant">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between border-t border-outline-variant/20 pt-3">
                <span className="text-[11px] text-on-surface-variant opacity-60">
                  {article.readTime}
                </span>
                <button
                  type="button"
                  aria-label="Remove bookmark"
                  onClick={() => remove(article.id)}
                  className="text-error transition-transform hover:scale-110"
                >
                  <BookmarkRemoveIcon className="size-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-[14px] text-on-surface-variant">
            No saved articles yet.
          </p>
        )}
      </div>
    </div>
  );
}
