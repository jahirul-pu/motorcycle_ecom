import { create } from 'zustand';
import type { Cart, CartItem } from '@motohub/types';

interface CartState {
  cart: Cart | null;
  isOpen: boolean; // drawer open state
  couponCode: string | null;
  discount: number;
  setCart: (cart: Cart) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  setCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()((set, get) => ({
  cart: null,
  isOpen: false,
  couponCode: null,
  discount: 0,

  setCart: (cart) => set({ cart }),
  clearCart: () => set({ cart: null, couponCode: null, discount: 0 }),
  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),
  toggleDrawer: () => set((s) => ({ isOpen: !s.isOpen })),

  setCoupon: (code, discount) => set({ couponCode: code, discount }),
  removeCoupon: () => set({ couponCode: null, discount: 0 }),

  itemCount: () => {
    const cart = get().cart;
    if (!cart) return 0;
    return cart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  },

  subtotal: () => {
    const cart = get().cart;
    if (!cart) return 0;
    return cart.items.reduce((sum: number, item: CartItem) => {
      const price = item.product?.price?.salePrice ?? item.product?.price?.regularPrice ?? 0;
      return sum + price * item.quantity;
    }, 0);
  },
}));
