'use client';

import * as React from 'react';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlist.store';
import { useAuthStore } from '@/store/auth.store';
import { wishlistService } from '@/services/wishlist.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export default function WishlistButton({ productId, className = '' }: WishlistButtonProps) {
  const { has, addId, removeId } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const isWishlisted = has(productId);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info('Please sign in to save items to your wishlist');
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      if (isWishlisted) {
        await wishlistService.removeFromWishlist(productId);
        removeId(productId);
        toast.success('Removed from wishlist');
      } else {
        await wishlistService.addToWishlist(productId);
        addId(productId);
        toast.success('Added to wishlist');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`group inline-flex items-center justify-center rounded-full p-2 transition-all duration-200
        ${isWishlisted
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : 'bg-white/80 text-zinc-400 hover:bg-zinc-100 hover:text-red-400'}
        disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <Heart
        className={`h-5 w-5 transition-all duration-200 ${
          isWishlisted ? 'fill-red-500 stroke-red-500' : 'fill-none group-hover:fill-red-100'
        }`}
      />
    </button>
  );
}
