'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { catalogService } from '@/services/catalog.service';
import Navbar from '@/components/layout/Navbar';
import ProductGrid from '@/components/catalog/ProductGrid';
import { Loader2, ChevronRight, Home, ShieldCheck, Globe } from 'lucide-react';
import Link from 'next/link';

interface BrandDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function BrandDetailPage({ params }: BrandDetailPageProps) {
  const { slug } = React.use(params);

  const {
    data: brand,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['brand', slug],
    queryFn: () => catalogService.getBrandBySlug(slug),
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FA] text-zinc-900">
      <Navbar />

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold">
            <Link href="/" className="flex items-center gap-1 hover:text-zinc-850 transition-colors">
              <Home className="h-3.5 w-3.5" />
            </Link>
            <ChevronRight className="h-3 w-3 text-zinc-300" />
            <Link href="/brands" className="hover:text-zinc-850 transition-colors">
              Brands
            </Link>
            {brand && (
              <>
                <ChevronRight className="h-3 w-3 text-zinc-300" />
                <span className="text-[#D71920] font-semibold">{brand.name}</span>
              </>
            )}
          </nav>

          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-[#D71920]" />
            </div>
          ) : error || !brand ? (
            <div className="text-center py-16 border border-dashed border-zinc-200 rounded-2xl bg-white">
              <p className="text-sm text-red-500">
                Failed to load brand details. It may not exist.
              </p>
              <Link
                href="/brands"
                className="inline-block mt-4 text-xs text-[#D71920] hover:underline"
              >
                Back to Brands
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#D71920]/2 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <ShieldCheck className="h-6 w-6" />
                      <span className="text-xs font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Official Partner
                      </span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                      {brand.name}
                    </h1>
                    <p className="text-sm text-zinc-500 max-w-2xl leading-relaxed">
                      {brand.description ||
                        `Browse premium catalog configurations manufactured by ${brand.name}.`}
                    </p>
                  </div>

                  {brand.website && (
                    <div className="flex-shrink-0">
                      <a
                        href={brand.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white border border-zinc-200 hover:border-[#D71920]/30 hover:text-[#D71920] text-xs font-bold text-zinc-700 px-4 py-2.5 rounded-xl transition-all"
                      >
                        <Globe className="h-4 w-4" />
                        Manufacturer Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Brand Products Section */}
              <BrandProductsSection slug={slug} brandName={brand.name} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

interface BrandProductsSectionProps {
  slug: string;
  brandName: string;
}

function BrandProductsSection({ slug, brandName }: BrandProductsSectionProps) {
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', 'brand', slug],
    queryFn: () => catalogService.getProducts({ brandSlug: slug, limit: 12 }),
  });

  const products = productsData?.items || [];

  return (
    <div className="space-y-4 pt-6 border-t border-zinc-100">
      <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
        Products under {brandName}
      </h2>
      <ProductGrid products={products} isLoading={isLoading} limit={6} />
    </div>
  );
}
