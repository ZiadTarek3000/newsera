import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type BookmarkState = {
  ids: Set<string>;
  hydrated: boolean;
  setAll: (ids: string[]) => void;
  toggle: (id: string) => void;
  clear: () => void;
};

// Persisted to localStorage so saved-state renders correctly on the very first
// paint of a reload — no empty→filled flash while the server reconciles. A
// `Set` isn't JSON-serializable, so we store it as an array and rehydrate it.
export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set) => ({
      ids: new Set<string>(),
      hydrated: false,
      setAll: (ids) => set({ ids: new Set(ids), hydrated: true }),
      toggle: (id) =>
        set((state) => {
          const next = new Set(state.ids);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return { ids: next };
        }),
      clear: () => set({ ids: new Set<string>(), hydrated: false }),
    }),
    {
      name: "newsera-bookmarks",
      storage: createJSONStorage(() => localStorage),
      // Only the ids are durable; `hydrated` tracks the live server reconcile.
      partialize: (state) => ({ ids: Array.from(state.ids) }),
      merge: (persisted, current) => {
        const saved = (persisted as { ids?: string[] } | undefined)?.ids ?? [];
        return { ...current, ids: new Set(saved) };
      },
    },
  ),
);
