"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecentlyViewedState {
  items: any[];
  addItem: (product: any) => void;
  clearItems: () => void;
}

export const useRecentlyViewed = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const currentItems = get().items;
        // Keep only top 8 items, remove duplicates
        const filtered = currentItems.filter(i => i.id !== product.id);
        const updated = [product, ...filtered].slice(0, 8);
        set({ items: updated });
      },
      clearItems: () => set({ items: [] }),
    }),
    {
      name: 'recently-viewed-storage',
    }
  )
);
