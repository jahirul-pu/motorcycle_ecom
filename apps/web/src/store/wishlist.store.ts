import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface WishlistState {
  productIds: Set<string>;
  _productIdsArray: string[]; // serializable form for persist
  addId: (id: string) => void;
  removeId: (id: string) => void;
  setIds: (ids: string[]) => void;
  has: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: new Set<string>(),
      _productIdsArray: [],
      addId: (id) =>
        set((s) => {
          const next = new Set(s.productIds);
          next.add(id);
          return { productIds: next, _productIdsArray: Array.from(next) };
        }),
      removeId: (id) =>
        set((s) => {
          const next = new Set(s.productIds);
          next.delete(id);
          return { productIds: next, _productIdsArray: Array.from(next) };
        }),
      setIds: (ids) => set({ productIds: new Set(ids), _productIdsArray: ids }),
      has: (id) => get().productIds.has(id),
    }),
    {
      name: 'motohub-wishlist',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : sessionStorage,
      ),
      // Rehydrate Set from serializable array
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.productIds = new Set(state._productIdsArray ?? []);
        }
      },
    },
  ),
);
