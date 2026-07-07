'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { catalogService } from '@/services/catalog.service';
import Navbar from '@/components/layout/Navbar';
import CategoryCard from '@/components/catalog/CategoryCard';
import { Loader2, FolderOpen } from 'lucide-react';

export default function CategoriesPage() {
  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: catalogService.getCategories,
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FA] text-zinc-900">
      <Navbar />

      <main className="flex-1 container mx-auto py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="border-b border-zinc-200 pb-5">
            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
              <FolderOpen className="h-8 w-8 text-[#D71920]" />
              Browse Categories
            </h1>
            <p className="text-sm text-zinc-500 mt-2">
              Select a parts category to browse high-performance motorcycle replacements.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-[#D71920]" />
            </div>
          ) : error ? (
            <div className="text-center py-16 border border-dashed border-zinc-200 rounded-2xl bg-white">
              <p className="text-sm text-red-500">
                Failed to load categories. Please try again later.
              </p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-zinc-200 rounded-2xl bg-white">
              <p className="text-sm text-zinc-500">No categories found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
