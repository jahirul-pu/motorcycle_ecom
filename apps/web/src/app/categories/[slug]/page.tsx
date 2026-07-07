'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { catalogService } from '@/services/catalog.service';
import Navbar from '@/components/layout/Navbar';
import ProductGrid from '@/components/catalog/ProductGrid';
import { Loader2, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

interface CategoryDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { slug } = React.use(params);

  const {
    data: category,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => catalogService.getCategoryBySlug(slug),
  });

  const getBreadcrumbs = () => {
    if (!category) return [];
    const crumbs = [];

    // Add parent hierarchies if available
    let currentParent = category.parent;
    while (currentParent) {
      crumbs.unshift({ name: currentParent.name, slug: currentParent.slug });
      currentParent = currentParent.parent;
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      <Navbar />

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
            <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors">
              <Home className="h-3.5 w-3.5" />
            </Link>
            <ChevronRight className="h-3 w-3 text-zinc-700" />
            <Link href="/categories" className="hover:text-white transition-colors">
              Categories
            </Link>
            {breadcrumbs.map((crumb) => (
              <React.Fragment key={crumb.slug}>
                <ChevronRight className="h-3 w-3 text-zinc-700" />
                <Link
                  href={`/categories/${crumb.slug}`}
                  className="hover:text-white transition-colors"
                >
                  {crumb.name}
                </Link>
              </React.Fragment>
            ))}
            {category && (
              <>
                <ChevronRight className="h-3 w-3 text-zinc-700" />
                <span className="text-amber-500 font-semibold">{category.name}</span>
              </>
            )}
          </nav>

          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : error || !category ? (
            <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10">
              <p className="text-sm text-red-500">
                Failed to load category details. It may not exist.
              </p>
              <Link
                href="/categories"
                className="inline-block mt-4 text-xs text-amber-500 hover:underline"
              >
                Back to Categories
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="border-b border-zinc-800 pb-5">
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  {category.name}
                </h1>
                <p className="text-sm text-zinc-400 mt-2 max-w-3xl leading-relaxed">
                  {category.description ||
                    `Explore our high quality ${category.name.toLowerCase()} catalog selections.`}
                </p>
              </div>

              {/* Query products belonging to this category */}
              <CategoryProductsSection slug={slug} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

interface CategoryProductsSectionProps {
  slug: string;
}

function CategoryProductsSection({ slug }: CategoryProductsSectionProps) {
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', 'category', slug],
    queryFn: () => catalogService.getProducts({ categorySlug: slug, limit: 12 }),
  });

  const products = productsData?.items || [];

  return (
    <div className="space-y-4 pt-6 border-t border-zinc-900">
      <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
        Products in this Category
      </h2>
      <ProductGrid products={products} isLoading={isLoading} limit={6} />
    </div>
  );
}

