'use client';

import * as React from 'react';
import { Heart } from 'lucide-react';
import { wishlistService } from '@/services/wishlist.service';
import { useWishlistStore } from '@/store/wishlist.store';
import { useAuthStore } from '@/store/auth.store';
import WishlistCard from '@/components/wishlist/WishlistCard';
import type { WishlistItem } from '@motohub/types';
import Link from 'next/link';

export default function WishlistPage() {
  const { isAuthenticated } = useAuthStore();
  const { setIds } = useWishlistStore();
  const [items, setItems] = React.useState<WishlistItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    wishlistService
      .getWishlist()
      .then((data: WishlistItem[]) => {
        setItems(data);
        setIds(data.map((i) => i.productId));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, setIds]);

  const handleRemoved = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  if (!isAuthenticated) {
    return (
      <main className="container mx-auto max-w-2xl px-4 py-24 text-center">
        <Heart className="mx-auto h-16 w-16 text-zinc-200 mb-4" />
        <h1 className="text-2xl font-bold text-zinc-800">Your Wishlist</h1>
        <p className="mt-2 text-zinc-500">Sign in to save your favourite products.</p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90 transition-colors"
        >
          Sign In
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 flex items-center gap-3">
          <Heart className="h-7 w-7 text-red-500 fill-red-500" />
          My Wishlist
        </h1>
        {!loading && (
          <p className="mt-1 text-sm text-zinc-400">
            {items.length} saved item{items.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-zinc-100" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <Heart className="h-14 w-14 text-zinc-200" />
          <p className="text-lg font-semibold text-zinc-600">Your wishlist is empty</p>
          <p className="text-sm text-zinc-400">Browse our products and save the ones you love.</p>
          <Link
            href="/products"
            className="mt-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <WishlistCard key={item.id} item={item} onRemoved={handleRemoved} />
          ))}
        </div>
      )}
    </main>
  );
}
