'use client';

import * as React from 'react';
import Link from 'next/link';
import { Brand } from '@motohub/types';
import { ShieldAlert, ExternalLink, ChevronRight } from 'lucide-react';

interface BrandCardProps {
  brand: Brand;
}

export default function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="group relative block bg-zinc-900/35 border border-zinc-800 hover:border-amber-500/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/5 select-none"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/2 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/5 transition-all duration-300" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 group-hover:text-amber-500 group-hover:border-amber-500/20 transition-all duration-300">
          <ShieldAlert className="h-5 w-5" />
        </div>
        {brand.website && (
          <a
            href={brand.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-[10px] font-semibold text-zinc-500 hover:text-amber-500 transition-colors"
          >
            Visit Website
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-base font-bold text-white group-hover:text-amber-500 transition-colors flex items-center justify-between">
          {brand.name}
          <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
        </h3>
        <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed line-clamp-2">
          {brand.description ||
            `Explore premium parts and configurations manufactured by ${brand.name}.`}
        </p>
      </div>
    </Link>
  );
}
