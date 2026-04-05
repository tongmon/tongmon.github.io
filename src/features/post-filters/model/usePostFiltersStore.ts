import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type PostListViewMode = "grid" | "compact";

interface PostFiltersState {
  searchQuery: string;
  selectedTag: string | null;
  viewMode: PostListViewMode;
  resetFilters: () => void;
  setSearchQuery: (value: string) => void;
  setSelectedTag: (value: string | null) => void;
  setViewMode: (value: PostListViewMode) => void;
}

export const usePostFiltersStore = create<PostFiltersState>()(
  persist(
    (set) => ({
      searchQuery: "",
      selectedTag: null,
      viewMode: "grid",
      resetFilters: () =>
        set({
          searchQuery: "",
          selectedTag: null,
          viewMode: "grid",
        }),
      setSearchQuery: (value) => set({ searchQuery: value }),
      setSelectedTag: (value) => set({ selectedTag: value }),
      setViewMode: (value) => set({ viewMode: value }),
    }),
    {
      name: "tongmon-post-filters",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        searchQuery: state.searchQuery,
        selectedTag: state.selectedTag,
        viewMode: state.viewMode,
      }),
    },
  ),
);
