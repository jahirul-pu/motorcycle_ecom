'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { searchService } from '@/services/search.service';
import Navbar from '@/components/layout/Navbar';
import ProductGrid from '@/components/catalog/ProductGrid';
import FilterSidebar from '@/components/catalog/FilterSidebar';
import {
  Loader2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 1. Read / Deserialize search parameters from URL
  const queryText = searchParams.get('q') || '';
  const categoriesStr = searchParams.get('categories') || '';
  const brandsStr = searchParams.get('brands') || '';
  const priceMin = searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined;
  const priceMax = searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined;
  const attributesStr = searchParams.get('attributes') || '';
  const sort = searchParams.get('sort') || 'relevance';
  const page = Number(searchParams.get('page')) || 1;
  const inStock = searchParams.get('inStock') === 'true' ? true : undefined;

  const limit = 8; // products per page

  // Parse categories/brands to arrays for the sidebar props
  const selectedCategories = React.useMemo(() => {
    return categoriesStr.split(',').map((s) => s.trim()).filter(Boolean);
  }, [categoriesStr]);

  const selectedBrands = React.useMemo(() => {
    return brandsStr.split(',').map((s) => s.trim()).filter(Boolean);
  }, [brandsStr]);

  // Parse attributes string back to structured record for sidebar
  const selectedAttributes = React.useMemo(() => {
    const record: Record<string, string[]> = {};
    if (attributesStr) {
      attributesStr.split(',').forEach((pair) => {
        const parts = pair.split(':');
        if (parts.length === 2) {
          const name = parts[0].trim();
          const val = parts[1].trim();
          if (!record[name]) {
            record[name] = [];
          }
          record[name].push(val);
        }
      });
    }
    return record;
  }, [attributesStr]);

  // 2. Fetch products using TanStack useQuery
  const { data: searchResults, isLoading } = useQuery({
    queryKey: [
      'searchResults',
      queryText,
      categoriesStr,
      brandsStr,
      priceMin,
      priceMax,
      attributesStr,
      sort,
      page,
      inStock,
    ],
    queryFn: () =>
      searchService.search({
        q: queryText,
        categories: categoriesStr,
        brands: brandsStr,
        priceMin,
        priceMax,
        attributes: attributesStr,
        sort,
        page,
        limit,
        inStock,
      }),
  });

  const products = searchResults?.items || [];
  const meta = searchResults?.meta || { total: 0, totalPages: 1 };

  // 3. Serialize and apply URL parameter updates
  const updateQuery = (updates: {
    q?: string | null;
    categories?: string[] | null;
    brands?: string[] | null;
    priceMin?: number | null;
    priceMax?: number | null;
    attributes?: Record<string, string[]> | null;
    sort?: string | null;
    page?: number | null;
    inStock?: boolean | null;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    // Helper: apply or delete string params
    const setOrDelete = (key: string, val: string | number | boolean | null | undefined) => {
      if (val === null || val === undefined || val === '') {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    };

    if ('q' in updates) setOrDelete('q', updates.q);
    if ('priceMin' in updates) setOrDelete('priceMin', updates.priceMin);
    if ('priceMax' in updates) setOrDelete('priceMax', updates.priceMax);
    if ('sort' in updates) setOrDelete('sort', updates.sort);
    if ('page' in updates) setOrDelete('page', updates.page);
    if ('inStock' in updates) setOrDelete('inStock', updates.inStock);

    if ('categories' in updates) {
      const val = updates.categories;
      setOrDelete('categories', val && val.length > 0 ? val.join(',') : null);
    }

    if ('brands' in updates) {
      const val = updates.brands;
      setOrDelete('brands', val && val.length > 0 ? val.join(',') : null);
    }

    if ('attributes' in updates) {
      const record = updates.attributes;
      if (!record || Object.keys(record).length === 0) {
        params.delete('attributes');
      } else {
        const pairs: string[] = [];
        Object.entries(record).forEach(([name, values]) => {
          values.forEach((v) => pairs.push(`${name}:${v}`));
        });
        setOrDelete('attributes', pairs.join(','));
      }
    }

    // Reset pagination to page 1 whenever filters change
    if (!('page' in updates)) {
      params.delete('page');
    }

    router.push(`/search?${params.toString()}`);
  };

  // Helper handler for FilterSidebar triggers
  const handleSidebarFilterChange = (filters: {
    categories?: string[];
    brands?: string[];
    priceMin?: number;
    priceMax?: number;
    attributes?: Record<string, string[]>;
    inStock?: boolean;
  }) => {
    updateQuery(filters);
  };

  // Remove individual filter tag
  const removeFilterTag = (type: string, value: string, attrName?: string) => {
    if (type === 'q') updateQuery({ q: null });
    else if (type === 'inStock') updateQuery({ inStock: null });
    else if (type === 'price') updateQuery({ priceMin: null, priceMax: null });
    else if (type === 'category') {
      updateQuery({ categories: selectedCategories.filter((c) => c !== value) });
    } else if (type === 'brand') {
      updateQuery({ brands: selectedBrands.filter((b) => b !== value) });
    } else if (type === 'attribute' && attrName) {
      const currentVals = selectedAttributes[attrName] || [];
      const updatedVals = currentVals.filter((v) => v !== value);
      const updatedRecord = { ...selectedAttributes, [attrName]: updatedVals };
      if (updatedVals.length === 0) {
        delete updatedRecord[attrName];
      }
      updateQuery({ attributes: updatedRecord });
    }
  };

  const resetAllFilters = () => {
    updateQuery({
      q: null,
      categories: null,
      brands: null,
      priceMin: null,
      priceMax: null,
      attributes: null,
      inStock: null,
      page: null,
    });
  };

  const hasActiveFilters =
    queryText ||
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    priceMin !== undefined ||
    priceMax !== undefined ||
    Object.keys(selectedAttributes).length > 0 ||
    inStock !== undefined;

  // JSON-LD structured search results metadata schema
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    'mainEntity': {
      '@type': 'ItemList',
      'numberOfItems': meta.total,
      'itemListElement': products.map((prod, index) => ({
        '@type': 'ListItem',
        'position': index + 1 + (page - 1) * limit,
        'url': `http://localhost:3000/products/${prod.slug}`,
        'name': prod.name,
      })),
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FA] text-zinc-900">
      <Navbar />

      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      <main className="flex-1 container mx-auto py-8 px-4">
        {/* Results Header Summary */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-baseline gap-2">
            <span>Search Results</span>
            {queryText && (
              <span className="text-zinc-500 text-sm font-normal">
                for &ldquo;{queryText}&rdquo;
              </span>
            )}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            {!isLoading && `${meta.total} products matched your criteria.`}
          </p>
        </div>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 mb-6">
            <span className="text-[10px] uppercase font-bold text-zinc-400 mr-1">Active Filters:</span>
            {queryText && (
              <span className="inline-flex items-center gap-1 bg-white border border-zinc-200 text-[10px] font-semibold text-zinc-700 px-2 py-0.5 rounded-full shadow-sm">
                Keyword: {queryText}
                <button onClick={() => removeFilterTag('q', queryText)}>
                  <X className="h-3 w-3 text-zinc-400 hover:text-zinc-600" />
                </button>
              </span>
            )}
            {inStock && (
              <span className="inline-flex items-center gap-1 bg-white border border-zinc-200 text-[10px] font-semibold text-zinc-700 px-2 py-0.5 rounded-full shadow-sm">
                In Stock Only
                <button onClick={() => removeFilterTag('inStock', '')}>
                  <X className="h-3 w-3 text-zinc-400 hover:text-zinc-600" />
                </button>
              </span>
            )}
            {(priceMin !== undefined || priceMax !== undefined) && (
              <span className="inline-flex items-center gap-1 bg-white border border-zinc-200 text-[10px] font-semibold text-zinc-700 px-2 py-0.5 rounded-full shadow-sm">
                Price: ৳{priceMin || 0} - ৳{priceMax || '*'}
                <button onClick={() => removeFilterTag('price', '')}>
                  <X className="h-3 w-3 text-zinc-400 hover:text-zinc-600" />
                </button>
              </span>
            )}
            {selectedCategories.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1 bg-white border border-zinc-200 text-[10px] font-semibold text-zinc-700 px-2 py-0.5 rounded-full shadow-sm"
              >
                Category: {c}
                <button onClick={() => removeFilterTag('category', c)}>
                  <X className="h-3 w-3 text-zinc-400 hover:text-zinc-600" />
                </button>
              </span>
            ))}
            {selectedBrands.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1 bg-white border border-zinc-200 text-[10px] font-semibold text-zinc-700 px-2 py-0.5 rounded-full shadow-sm"
              >
                Brand: {b}
                <button onClick={() => removeFilterTag('brand', b)}>
                  <X className="h-3 w-3 text-zinc-400 hover:text-zinc-600" />
                </button>
              </span>
            ))}
            {Object.entries(selectedAttributes).map(([name, values]) =>
              values.map((v) => (
                <span
                  key={`${name}:${v}`}
                  className="inline-flex items-center gap-1 bg-white border border-zinc-200 text-[10px] font-semibold text-zinc-700 px-2 py-0.5 rounded-full shadow-sm"
                >
                  {name}: {v}
                  <button onClick={() => removeFilterTag('attribute', v, name)}>
                    <X className="h-3 w-3 text-zinc-400 hover:text-zinc-600" />
                  </button>
                </span>
              ))
            )}
          </div>
        )}

        {/* Sidebar & Products grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar
              selectedCategories={selectedCategories}
              selectedBrands={selectedBrands}
              priceMin={priceMin}
              priceMax={priceMax}
              selectedAttributes={selectedAttributes}
              inStock={inStock}
              onFilterChange={handleSidebarFilterChange}
            />
          </div>

          {/* Results Main Section */}
          <div className="lg:col-span-3 space-y-6">
            {/* Sorting Dropdown & Summary Bar */}
            <div className="flex items-center justify-between bg-white border border-zinc-200 rounded-2xl px-4 py-3 shadow-sm text-xs">
              <span className="text-zinc-500 font-medium">
                Showing {products.length} of {meta.total} products
              </span>
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 font-semibold flex items-center gap-1">
                  <ArrowUpDown className="h-3.5 w-3.5" /> Sort:
                </span>
                <select
                  value={sort}
                  onChange={(e) => updateQuery({ sort: e.target.value })}
                  className="bg-zinc-50 border border-zinc-200 text-zinc-700 font-bold rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer focus:border-primary/40 focus:ring-1 focus:ring-primary/40"
                >
                  <option value="relevance">Relevance Rank</option>
                  <option value="newest">New Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
              </div>
            </div>

            {!isLoading && products.length === 0 ? (
              /* Empty Results Page State */
              <div className="text-center py-24 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 border border-zinc-100 text-zinc-400">
                  <Search className="h-8 w-8" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-zinc-900">No Matching Products Found</h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Try broadening your search term keyword, adjusting price range boundaries, or clearing checklist filters.
                  </p>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={resetAllFilters}
                    className="inline-flex items-center gap-1.5 bg-zinc-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" /> Reset Search Filters
                  </button>
                )}
              </div>
            ) : (
              /* Product Grid results list */
              <ProductGrid products={products} isLoading={isLoading} limit={6} />
            )}

            {/* Pagination Controls */}
            {!isLoading && meta.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-4">
                <button
                  disabled={page <= 1}
                  onClick={() => updateQuery({ page: page - 1 })}
                  className="p-2 border border-zinc-200 rounded-xl bg-white hover:bg-zinc-50 text-zinc-600 disabled:opacity-40 disabled:hover:bg-white transition-colors"
                >
                  <ChevronLeft className="h-4.5 w-4.5" />
                </button>
                <div className="flex gap-1.5">
                  {Array.from({ length: meta.totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === page;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => updateQuery({ page: pageNum })}
                        className={`h-9 w-9 text-xs font-bold rounded-xl border transition-all ${
                          isActive
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  disabled={page >= meta.totalPages}
                  onClick={() => updateQuery({ page: page + 1 })}
                  className="p-2 border border-zinc-200 rounded-xl bg-white hover:bg-zinc-50 text-zinc-600 disabled:opacity-40 disabled:hover:bg-white transition-colors"
                >
                  <ChevronRight className="h-4.5 w-4.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SearchPageClient() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <SearchResultsContent />
    </React.Suspense>
  );
}
