import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // The variant string/id
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  costPrice?: number;
  markup?: number;
  image?: string;
  quantity: number;
  attributes?: Record<string, string>; // E.g. { Size: "M", Color: "Navy" }
}

interface CartState {
  items: CartItem[];
  savedItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  moveToSaveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  syncWithDb: (userId: string) => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedItems: [],
      
      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === newItem.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === newItem.id ? { ...i, quantity: i.quantity + newItem.quantity } : i
              ),
            };
          }
          return { items: [...state.items, newItem] };
        });
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
          savedItems: state.savedItems.filter((i) => i.id !== id),
        }));
      },
      
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
          savedItems: state.savedItems.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      setItems: (newItems) => set({ items: newItems }),

      moveToSaveForLater: (id) => {
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          if (!item) return state;
          return {
            items: state.items.filter((i) => i.id !== id),
            savedItems: [...state.savedItems, item]
          };
        });
      },

      moveToCart: (id) => {
        set((state) => {
          const item = state.savedItems.find((i) => i.id === id);
          if (!item) return state;
          return {
            savedItems: state.savedItems.filter((i) => i.id !== id),
            items: [...state.items, item]
          };
        });
      },

      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      syncWithDb: async (userId) => {
        const items = get().items;
        try {
          await fetch('http://localhost:4000/api/cart/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              items: items.map(i => ({
                variantId: i.id.includes('-') ? i.id.split('-')[1] : i.id,
                quantity: i.quantity
              }))
            })
          });
        } catch (error) {
          console.error("Cart Sync Failed:", error);
        }
      },
    }),
    {
      name: 'essential-eleven-cart-storage', // Keys in local storage
    }
  )
);
