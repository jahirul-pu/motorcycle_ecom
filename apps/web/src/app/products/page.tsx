// apps/web/src/app/products/page.tsx

'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { catalogService } from '@/services/catalog.service';
import Navbar from '@/components/layout/Navbar';
import ProductGrid from '@/components/catalog/ProductGrid';
import {
  Loader2,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse state from URL search params
  const categorySlug = searchParams.get('category') || '';
  const brandSlug = searchParams.get('brand') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page')) || 1;
  const limit = 6;

  // Fetch categories and brands for the filter sidebar
  const { data: categories = [], isLoading: isLoadingCats } = useQuery({
    queryKey: ['categories'],
    queryFn: catalogService.getCategories,
  });

  const { data: brands = [], isLoading: isLoadingBrands } = useQuery({
    queryKey: ['brands'],
    queryFn: catalogService.getBrands,
  });

  // Fetch products based on filters
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', categorySlug, brandSlug, sort, page],
    queryFn: () =>
      catalogService.getProducts({
        categorySlug,
        brandSlug,
        sort,
        page,
        limit,
      }),
  });

  const products = productsData?.items || [];
  const meta = productsData?.meta || { total: 0, totalPages: 1 };

  // Update query params function
  const updateQuery = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '') {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    });
    // Reset page on filter changes (if page is not explicitly updated)
    if (!updates.page && updates.page !== null) {
      params.set('page', '1');
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleReset = () => {
    router.push('/products');
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-zinc-200 pb-5">
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
          <SlidersHorizontal className="h-7 w-7 text-[#D71920]" />
          Catalog Products
        </h1>
        <p className="text-sm text-zinc-500 mt-2">
          Explore top quality components and original accessories fitted for your motorcycle.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="space-y-6 lg:border-r lg:border-zinc-200 lg:pr-8">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Filters</h2>
            {(categorySlug || brandSlug || sort !== 'newest') && (
              <button
                onClick={handleReset}
                className="text-[11px] text-[#D71920] hover:text-[#BF141A] flex items-center gap-1 font-semibold transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>

          {/* Categories filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-zinc-400">Categories</h3>
            {isLoadingCats ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#D71920]" />
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => updateQuery({ category: '' })}
                  className={`text-left text-xs px-3 py-2 rounded-xl transition-all ${
                    !categorySlug
                      ? 'bg-[#D71920]/10 text-[#D71920] border border-[#D71920]/20 font-bold'
                      : 'text-zinc-600 hover:bg-zinc-100 border border-transparent'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateQuery({ category: cat.slug })}
                    className={`text-left text-xs px-3 py-2 rounded-xl transition-all ${
                      categorySlug === cat.slug
                        ? 'bg-[#D71920]/10 text-[#D71920] border border-[#D71920]/20 font-bold'
                        : 'text-zinc-600 hover:bg-zinc-100 border border-transparent'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Brands filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-zinc-400">Brands</h3>
            {isLoadingBrands ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#D71920]" />
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => updateQuery({ brand: '' })}
                  className={`text-left text-xs px-3 py-2 rounded-xl transition-all ${
                    !brandSlug
                      ? 'bg-[#D71920]/10 text-[#D71920] border border-[#D71920]/20 font-bold'
                      : 'text-zinc-600 hover:bg-zinc-100 border border-transparent'
                  }`}
                >
                  All Brands
                </button>
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => updateQuery({ brand: brand.slug })}
                    className={`text-left text-xs px-3 py-2 rounded-xl transition-all ${
                      brandSlug === brand.slug
                        ? 'bg-[#D71920]/10 text-[#D71920] border border-[#D71920]/20 font-bold'
                        : 'text-zinc-600 hover:bg-zinc-100 border border-transparent'
                    }`}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-zinc-200 p-4 rounded-2xl">
            <div className="text-xs text-zinc-500">
              Showing <span className="font-semibold text-zinc-950">{products.length}</span> of{' '}
              <span className="font-semibold text-zinc-950">{meta.total}</span> products
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" />
              <select
                value={sort}
                onChange={(e) => updateQuery({ sort: e.target.value })}
                className="bg-white border border-zinc-200 text-xs text-zinc-700 rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#D71920]/40 focus:ring-1 focus:ring-[#D71920]/40 cursor-pointer"
              >
                <option value="newest">Newest Arrival</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <ProductGrid products={products} isLoading={isLoadingProducts} limit={limit} />

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-8">
              <button
                disabled={page <= 1}
                onClick={() => updateQuery({ page: page - 1 })}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-semibold text-zinc-500">
                Page {page} of {meta.totalPages}
              </span>
              <button
                disabled={page >= meta.totalPages}
                onClick={() => updateQuery({ page: page + 1 })}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FA] text-zinc-900">
      <Navbar />
      <main className="flex-1 container mx-auto py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center py-36">
                <Loader2 className="h-8 w-8 animate-spin text-[#D71920]" />
              </div>
            }
          >
            <ProductsContent />
          </React.Suspense>
        </div>
      </main>
    </div>
  );
}
