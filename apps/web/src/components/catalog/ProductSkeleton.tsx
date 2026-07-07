// apps/web/src/components/catalog/ProductSkeleton.tsx

import * as React from 'react';

export default function ProductSkeleton() {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4 animate-pulse select-none">
      {/* Product Image */}
      <div className="aspect-square bg-zinc-100 rounded-xl w-full" />
      {/* Brand & Title */}
      <div className="space-y-2">
        <div className="h-3 w-16 bg-zinc-200 rounded" />
        <div className="h-5 w-4/5 bg-zinc-200 rounded" />
      </div>
      {/* Specs Summary / Short Desc */}
      <div className="space-y-1.5">
        <div className="h-3 w-full bg-zinc-200 rounded" />
        <div className="h-3 w-2/3 bg-zinc-200 rounded" />
      </div>
      {/* Price & Stock status */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
        <div className="h-5 w-20 bg-zinc-200 rounded" />
        <div className="h-5 w-16 bg-zinc-200 rounded" />
      </div>
    </div>
  );
}
