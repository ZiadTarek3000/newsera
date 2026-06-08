import { create } from "zustand";

type BookmarkState = {
  ids: Set<string>;
  hydrated: boolean;
  setAll: (ids: string[]) => void;
  toggle: (id: string) => void;
};

export const useBookmarkStore = create<BookmarkState>((set) => ({
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
}));
