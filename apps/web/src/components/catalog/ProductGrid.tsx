// apps/web/src/components/catalog/ProductGrid.tsx

'use client';

import * as React from 'react';
import { Product } from '@motohub/types';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import { ShoppingBag } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  limit?: number;
}

export default function ProductGrid({ products, isLoading, limit = 6 }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: limit }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-zinc-900 text-zinc-500 mb-3">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-bold text-white">No Products Found</h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
          We couldn't find any catalog matches. Try resetting filters or browsing other categories.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
