import { create } from 'zustand';

interface FilterState {
  category: string | null;
  tag: string | null;
  setCategory: (category: string | null) => void;
  setTag: (tag: string | null) => void;
  clear: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  category: null,
  tag: null,
  setCategory: (category) => set({ category, tag: null }),
  setTag: (tag) => set({ tag, category: null }),
  clear: () => set({ category: null, tag: null }),
}));
