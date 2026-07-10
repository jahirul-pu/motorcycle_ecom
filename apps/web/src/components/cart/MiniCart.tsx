'use client';

import * as React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { cartService } from '@/services/cart.service';

export default function MiniCart() {
  const { itemCount, setCart, toggleDrawer, cart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // Load cart on mount if authenticated and no cart loaded
    if (isAuthenticated && !cart) {
      cartService.getCart().then(setCart).catch(() => {});
    }
  }, [isAuthenticated, cart, setCart]);


  const count = mounted ? itemCount() : 0;

  return (
    <button
      onClick={toggleDrawer}
      aria-label="Open cart"
      className="relative inline-flex items-center justify-center rounded-full p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}
