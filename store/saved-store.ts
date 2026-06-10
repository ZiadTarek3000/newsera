import { create } from "zustand";
import type { ArticleSummary } from "@/types";

type SavedState = {
  /** The saved articles, newest first — mirrors the dashboard "Saved" list. */
  articles: ArticleSummary[];
  /** True once seeded from server data, so SSR uses props and the client store
   *  takes over only afterwards (avoids a hydration mismatch). */
  seeded: boolean;
  seed: (articles: ArticleSummary[]) => void;
  add: (article: ArticleSummary) => void;
  remove: (id: string) => void;
};

// Shared, in-memory source of truth for the Saved Articles list. Seeded from the
// server on the dashboard; bookmark buttons add/remove optimistically so a save
// shows up in the list instantly, then the server reconciles via revalidation.
export const useSavedStore = create<SavedState>((set) => ({
  articles: [],
  seeded: false,
  seed: (articles) => set({ articles, seeded: true }),
  add: (article) =>
    set((state) =>
      state.articles.some((a) => a.id === article.id)
        ? state
        : { articles: [article, ...state.articles] },
    ),
  remove: (id) =>
    set((state) => ({
      articles: state.articles.filter((a) => a.id !== id),
    })),
}));
