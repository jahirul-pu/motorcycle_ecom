'use client';

import * as React from 'react';
import Link from 'next/link';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import CartItem from './CartItem';
import CouponInput from './CouponInput';

export default function CartDrawer() {
  const { cart, isOpen, closeDrawer, subtotal, discount, couponCode } = useCartStore();

  const sub = subtotal();
  const shippingEstimate = sub > 0 ? 60 : 0;
  const total = sub + shippingEstimate - discount;

  // Trap body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        role="dialog"
        aria-label="Shopping cart"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-zinc-900">Your Cart</h2>
            {cart && cart.items.length > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {cart.items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={closeDrawer}
            className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5">
          {!cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <ShoppingBag className="h-14 w-14 text-zinc-200" />
              <div>
                <p className="text-base font-semibold text-zinc-700">Your cart is empty</p>
                <p className="mt-1 text-sm text-zinc-400">Add some products to get started</p>
              </div>
              <button
                onClick={closeDrawer}
                className="mt-2 text-sm font-semibold text-primary hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div>
              {cart.items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="border-t border-zinc-100 bg-zinc-50/80 px-5 py-5 space-y-4">
            <CouponInput />

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span className="font-medium text-zinc-800">৳{sub.toLocaleString()}</span>
              </div>
              {discount > 0 && couponCode && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({couponCode})</span>
                  <span className="font-medium">–৳{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-500">
                <span>Shipping (est.)</span>
                <span className="font-medium text-zinc-800">৳{shippingEstimate}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-200 pt-2 text-base font-bold text-zinc-900">
                <span>Total</span>
                <span>৳{Math.max(0, total).toLocaleString()}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary/90 transition-colors"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/cart"
              onClick={closeDrawer}
              className="block text-center text-xs font-medium text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
