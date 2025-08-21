import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  salePrice?: number;
  image: string;
  shortDescription: string;
  category: string | { id: string; name: string; slug: string };
  rating: number;
  addedAt: Date;
}

interface WishlistState {
  items: WishlistItem[];
  add: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => void;
  remove: (productId: string) => void;
  clear: () => void;
  isInWishlist: (productId: string) => boolean;
  count: () => number;
  getItems: () => WishlistItem[];
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      add: (item) => {
        const existingItem = get().items.find(i => i.productId === item.productId);
        if (existingItem) {
          // Update existing item
          set((state) => ({
            items: state.items.map(i => 
              i.productId === item.productId 
                ? { ...item, id: i.id, addedAt: i.addedAt }
                : i
            )
          }));
        } else {
          // Add new item
          const newItem: WishlistItem = {
            ...item,
            id: `wishlist-${item.productId}`,
            addedAt: new Date()
          };
          set((state) => ({ items: [...state.items, newItem] }));
        }
      },
      
      remove: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.productId !== productId)
        }));
      },
      
      clear: () => {
        set({ items: [] });
      },
      
      isInWishlist: (productId) => {
        return get().items.some(item => item.productId === productId);
      },
      
      count: () => {
        return get().items.length;
      },
      
      getItems: () => {
        return get().items;
      }
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Convert string dates back to Date objects when rehydrating from localStorage
        if (state?.items) {
          state.items = state.items.map(item => ({
            ...item,
            addedAt: item.addedAt instanceof Date ? item.addedAt : new Date(item.addedAt)
          }));
        }
      }
    }
  )
);
