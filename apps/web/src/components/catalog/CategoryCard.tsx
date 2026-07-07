'use client';

import * as React from 'react';
import Link from 'next/link';
import { Category } from '@motohub/types';
import { ChevronRight, Folder } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const childCount = category.children?.length || 0;

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative block bg-white border border-zinc-200 hover:border-primary/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-200/50 select-none"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/2 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/5 transition-all duration-300" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-500 group-hover:text-primary group-hover:border-primary/20 transition-all duration-300">
          <Folder className="h-5 w-5" />
        </div>
        <span className="flex items-center text-xs font-semibold text-zinc-400 group-hover:text-primary transition-colors">
          {childCount} {childCount === 1 ? 'Subcategory' : 'Subcategories'}
          <ChevronRight className="h-3.5 w-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>

      <div className="mt-4">
        <h3 className="text-base font-bold text-zinc-900 group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed line-clamp-2">
          {category.description ||
            `Browse high performance ${category.name.toLowerCase()} catalog selections.`}
        </p>
      </div>

      {category.children && category.children.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-zinc-100 group-hover:border-primary/10 transition-colors">
          {category.children.slice(0, 3).map((child) => (
            <span
              key={child.id}
              className="text-[10px] text-zinc-600 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded-full"
            >
              {child.name}
            </span>
          ))}
          {category.children.length > 3 && (
            <span className="text-[10px] text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
              +{category.children.length - 3} more
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
