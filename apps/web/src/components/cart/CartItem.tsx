'use client';

import * as React from 'react';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '@motohub/types';
import { cartService } from '@/services/cart.service';
import { useCartStore } from '@/store/cart.store';
import { toast } from 'sonner';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { setCart } = useCartStore();
  const [loading, setLoading] = React.useState(false);

  const product = item.product;
  const price = product?.price?.salePrice ?? product?.price?.regularPrice ?? 0;
  const primaryImage = product?.images?.[0];
  const imageUrl = primaryImage?.media?.storageKey;
  const maxQty = product?.inventory?.availableQuantity ?? 99;

  const update = async (newQty: number) => {
    if (newQty < 1) return;
    if (newQty > maxQty) {
      toast.warning(`Only ${maxQty} available`);
      return;
    }
    setLoading(true);
    try {
      const cart = await cartService.updateItem(item.id, newQty);
      setCart(cart);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    setLoading(true);
    try {
      const cart = await cartService.removeItem(item.id);
      setCart(cart);
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex gap-3 py-4 border-b border-zinc-100 last:border-0 ${loading ? 'opacity-60' : ''}`}>
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
        {imageUrl ? (
          <Image src={imageUrl} alt={product?.name ?? 'Product'} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-300 text-[10px]">
            No img
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wide truncate">
              {product?.brand?.name}
            </p>
            <p className="text-sm font-semibold text-zinc-800 line-clamp-1">{product?.name}</p>
          </div>
          <button
            onClick={remove}
            disabled={loading}
            className="shrink-0 p-1 text-zinc-300 hover:text-red-500 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50">
            <button
              onClick={() => update(item.quantity - 1)}
              disabled={loading || item.quantity <= 1}
              className="flex h-6 w-6 items-center justify-center text-zinc-500 hover:text-zinc-900 disabled:opacity-40 transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="min-w-[1.5rem] text-center text-sm font-semibold text-zinc-800">
              {item.quantity}
            </span>
            <button
              onClick={() => update(item.quantity + 1)}
              disabled={loading || item.quantity >= maxQty}
              className="flex h-6 w-6 items-center justify-center text-zinc-500 hover:text-zinc-900 disabled:opacity-40 transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <span className="text-sm font-bold text-zinc-900">
            ৳{(price * item.quantity).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
