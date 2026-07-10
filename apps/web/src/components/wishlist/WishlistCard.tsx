'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ShoppingCart } from 'lucide-react';
import type { WishlistItem } from '@motohub/types';
import { wishlistService } from '@/services/wishlist.service';
import { cartService } from '@/services/cart.service';
import { useWishlistStore } from '@/store/wishlist.store';
import { useCartStore } from '@/store/cart.store';
import { toast } from 'sonner';
import { Button } from '@motohub/ui';

interface WishlistCardProps {
  item: WishlistItem;
  onRemoved: (productId: string) => void;
}

export default function WishlistCard({ item, onRemoved }: WishlistCardProps) {
  const { removeId } = useWishlistStore();
  const { setCart, openDrawer } = useCartStore();
  const [removing, setRemoving] = React.useState(false);
  const [addingToCart, setAddingToCart] = React.useState(false);

  const product = item.product;
  if (!product) return null;

  const primaryImage = product.images?.find((i) => i.isPrimary) ?? product.images?.[0];
  const imageUrl = primaryImage?.media?.storageKey;
  const price = product.price?.salePrice ?? product.price?.regularPrice;
  const inStock = (product.inventory?.availableQuantity ?? 0) > 0;

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await wishlistService.removeFromWishlist(product.id);
      removeId(product.id);
      onRemoved(product.id);
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove');
    } finally {
      setRemoving(false);
    }
  };

  const handleAddToCart = async () => {
    if (!inStock) return;
    setAddingToCart(true);
    try {
      const cart = await cartService.addItem(product.id, 1);
      setCart(cart);
      openDrawer();
      toast.success('Added to cart');
    } catch (err: any) {
      toast.error(err.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="group flex gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/products/${product.slug}`} className="shrink-0">
        <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-zinc-100">
          {imageUrl ? (
            <Image src={imageUrl} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-300 text-xs">
              No image
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <p className="text-xs text-zinc-400 font-medium uppercase tracking-wide">
            {product.brand?.name}
          </p>
          <Link href={`/products/${product.slug}`}>
            <h3 className="mt-0.5 text-sm font-semibold text-zinc-800 hover:text-primary line-clamp-2 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <div>
            {price ? (
              <span className="text-base font-bold text-zinc-900">৳{price.toLocaleString()}</span>
            ) : (
              <span className="text-sm text-zinc-400">No price</span>
            )}
            {!inStock && (
              <span className="ml-2 text-xs text-red-500 font-medium">Out of Stock</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              disabled={!inStock || addingToCart}
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
            <button
              onClick={handleRemove}
              disabled={removing}
              className="rounded-md p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              aria-label="Remove from wishlist"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
