// apps/web/src/components/catalog/ProductCard.tsx

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Product } from '@motohub/types';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const imageUrl = primaryImage?.media?.storageKey;

  const regularPrice = product.price?.regularPrice || 0;
  const salePrice = product.price?.salePrice;
  const onSale = typeof salePrice === 'number' && salePrice < regularPrice;

  // Calculate discount percentage
  const discountPercent = onSale
    ? Math.round(((regularPrice - (salePrice as number)) / regularPrice) * 100)
    : 0;

  // Stock status
  const qty = product.inventory?.availableQuantity ?? 0;
  const lowStock = product.inventory?.lowStockThreshold ?? 5;

  let stockLabel = 'In Stock';
  let stockClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (qty === 0) {
    stockLabel = 'Out of Stock';
    stockClass = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (qty <= lowStock) {
    stockLabel = `Low Stock (${qty})`;
    stockClass = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col bg-white border border-zinc-200 hover:border-[#D71920]/30 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-200/50 select-none"
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#D71920]/2 rounded-full blur-2xl pointer-events-none group-hover:bg-[#D71920]/5 transition-all duration-300" />

      {/* Image container */}
      <div className="relative aspect-square w-full rounded-xl bg-zinc-50 border border-zinc-100 overflow-hidden flex items-center justify-center mb-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="h-12 w-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400">
            <ShoppingBag className="h-6 w-6" />
          </div>
        )}

        {/* Discount Badge */}
        {onSale && (
          <span className="absolute top-3 left-3 bg-[#D71920] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
            {discountPercent}% OFF
          </span>
        )}

        {/* Brand Overlay Label */}
        {product.brand && (
          <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm border border-zinc-200 text-[10px] font-semibold text-zinc-700 px-2 py-0.5 rounded">
            {product.brand.name}
          </span>
        )}
      </div>

      {/* Title & Brand */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">
            {product.category?.name || 'Parts'}
          </div>
          <h3 className="text-sm font-bold text-zinc-900 group-hover:text-[#D71920] transition-colors mt-0.5 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-[11px] text-zinc-500 mt-1.5 leading-relaxed line-clamp-2">
            {product.shortDescription || 'High performance motorcycle part built for endurance.'}
          </p>
        </div>

        {/* Footer: pricing and inventory status */}
        <div className="mt-4 pt-4 border-t border-zinc-100 group-hover:border-[#D71920]/10 flex items-center justify-between transition-colors">
          <div>
            {onSale ? (
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-400 line-through">
                  ৳{regularPrice.toLocaleString()}
                </span>
                <span className="text-sm font-black text-[#D71920]">
                  ৳{salePrice.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-sm font-black text-zinc-900">
                ৳{regularPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span
              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${stockClass}`}
            >
              {stockLabel}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
