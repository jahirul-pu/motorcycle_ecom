'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { cartService } from '@/services/cart.service';
import CartItem from '@/components/cart/CartItem';
import CouponInput from '@/components/cart/CouponInput';
import type { CartItem as CartItemType } from '@motohub/types';

export default function CartPage() {
  const { cart, setCart, subtotal, discount, couponCode } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    cartService.getCart()
      .then(setCart)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, setCart]);


  const sub = subtotal();
  const shipping = sub > 0 ? 60 : 0;
  const total = sub + shipping - discount;

  if (!isAuthenticated) {
    return (
      <main className="container mx-auto max-w-2xl px-4 py-24 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-zinc-200 mb-4" />
        <h1 className="text-2xl font-bold text-zinc-800">Your Cart</h1>
        <p className="mt-2 text-zinc-500">Sign in to view your cart.</p>
        <Link href="/login" className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90 transition-colors">
          Sign In
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-zinc-900 flex items-center gap-3">
        <ShoppingBag className="h-7 w-7 text-primary" />
        Shopping Cart
      </h1>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-zinc-100" />
          ))}
        </div>
      ) : !cart || cart.items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <ShoppingBag className="h-14 w-14 text-zinc-200" />
          <p className="text-lg font-semibold text-zinc-600">Your cart is empty</p>
          <Link href="/products" className="mt-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2 space-y-2">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              {cart.items.map((item: CartItemType) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 space-y-4 sticky top-24">
              <h2 className="text-base font-bold text-zinc-900">Order Summary</h2>

              <CouponInput />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-zinc-800">৳{sub.toLocaleString()}</span>
                </div>
                {discount > 0 && couponCode && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({couponCode})</span>
                    <span>–৳{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-500">
                  <span>Shipping (est.)</span>
                  <span className="font-medium text-zinc-800">৳{shipping}</span>
                </div>
                <div className="flex justify-between border-t border-zinc-200 pt-3 text-base font-bold text-zinc-900">
                  <span>Total</span>
                  <span>৳{Math.max(0, total).toLocaleString()}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary/90 transition-colors"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
