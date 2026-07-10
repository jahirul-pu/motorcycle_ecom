'use client';

import * as React from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/cart.store';
import type { CartItem } from '@motohub/types';

interface OrderSummaryProps {
  shipping: number;
}

export default function OrderSummary({ shipping }: OrderSummaryProps) {
  const { cart, subtotal, discount, couponCode } = useCartStore();
  const sub = subtotal();
  const total = sub + shipping - discount;

  if (!cart) return null;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 space-y-5 sticky top-24">
      <h3 className="text-base font-bold text-zinc-900">Order Summary</h3>

      {/* Items */}
      <ul className="space-y-3 max-h-64 overflow-y-auto">
        {cart.items.map((item: CartItem) => {
          const price = item.product?.price?.salePrice ?? item.product?.price?.regularPrice ?? 0;
          const imageUrl = item.product?.images?.[0]?.media?.storageKey;
          return (
            <li key={item.id} className="flex gap-3 items-center">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-200">
                {imageUrl ? (
                  <Image src={imageUrl} alt={item.product?.name ?? ''} fill className="object-cover" />
                ) : null}
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-700 text-[9px] font-bold text-white">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-zinc-700 line-clamp-1">{item.product?.name}</p>
                <p className="text-xs text-zinc-400">{item.product?.brand?.name}</p>
              </div>
              <span className="text-sm font-bold text-zinc-900 shrink-0">
                ৳{(price * item.quantity).toLocaleString()}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-zinc-200 pt-4 space-y-2 text-sm">
        <div className="flex justify-between text-zinc-500">
          <span>Subtotal</span>
          <span className="font-medium text-zinc-800">৳{sub.toLocaleString()}</span>
        </div>
        {discount > 0 && couponCode && (
          <div className="flex justify-between text-green-600">
            <span>Coupon ({couponCode})</span>
            <span className="font-medium">–৳{discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-zinc-500">
          <span>Shipping</span>
          <span className="font-medium text-zinc-800">৳{shipping}</span>
        </div>
        <div className="flex justify-between border-t border-zinc-200 pt-3 text-base font-bold text-zinc-900">
          <span>Total</span>
          <span>৳{Math.max(0, total).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
