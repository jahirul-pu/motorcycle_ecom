// apps/web/src/app/products/[slug]/page.tsx

'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { catalogService } from '@/services/catalog.service';
import Navbar from '@/components/layout/Navbar';
import { Loader2, ChevronRight, Home, AlertCircle, Bike, Wrench } from 'lucide-react';
import Link from 'next/link';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = React.use(params);

  // Fetch product detail
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => catalogService.getProductBySlug(slug),
  });

  // State for image gallery
  const [activeImage, setActiveImage] = React.useState<string>('');

  // Set initial active image when product finishes loading
  React.useEffect(() => {
    if (product?.images && product.images.length > 0) {
      const primary = product.images.find((img) => img.isPrimary) || product.images[0];
      setActiveImage(primary.media?.storageKey || '');
    }
  }, [product]);

  // Compatibility checking tool states
  const [selectedBrand, setSelectedBrand] = React.useState('');
  const [selectedModel, setSelectedModel] = React.useState('');
  const [selectedYear, setSelectedYear] = React.useState('');
  const [compatibilityResult, setCompatibilityResult] = React.useState<{
    checked: boolean;
    compatible: boolean;
    message: string;
  } | null>(null);

  // Parse compatibility list to build lookup dropdown lists
  const compatData = React.useMemo(() => {
    if (!product?.compatibility)
      return {
        brands: [],
        modelsMap: new Map<string, Set<string>>(),
        yearsMap: new Map<string, Set<number>>(),
      };

    const brandsSet = new Set<string>();
    const modelsMap = new Map<string, Set<string>>(); // brandName -> Set of modelNames
    const yearsMap = new Map<string, Set<number>>(); // modelName -> Set of years

    product.compatibility.forEach((fit) => {
      const variant = fit.variant;
      if (!variant) return;
      const gen = variant.generation;
      if (!gen) return;
      const model = gen.model;
      if (!model) return;
      const brand = model.brand;
      if (!brand) return;

      brandsSet.add(brand.name);

      if (!modelsMap.has(brand.name)) {
        modelsMap.set(brand.name, new Set());
      }
      modelsMap.get(brand.name)!.add(model.name);

      if (!yearsMap.has(model.name)) {
        yearsMap.set(model.name, new Set());
      }

      // Add all years in range
      const endYear = fit.yearTo || new Date().getFullYear();
      for (let y = fit.yearFrom; y <= endYear; y++) {
        yearsMap.get(model.name)!.add(y);
      }
    });

    return {
      brands: Array.from(brandsSet).sort(),
      modelsMap,
      yearsMap,
    };
  }, [product]);

  // Derived options for dropdowns based on previous selections
  const models = React.useMemo(() => {
    if (!selectedBrand) return [];
    const set = compatData.modelsMap.get(selectedBrand);
    return set ? Array.from(set).sort() : [];
  }, [selectedBrand, compatData]);

  const years = React.useMemo(() => {
    if (!selectedModel) return [];
    const set = compatData.yearsMap.get(selectedModel);
    return set ? Array.from(set).sort((a, b) => b - a) : [];
  }, [selectedModel, compatData]);

  // Reset secondary selections when parent changes
  React.useEffect(() => {
    setSelectedModel('');
    setSelectedYear('');
    setCompatibilityResult(null);
  }, [selectedBrand]);

  React.useEffect(() => {
    setSelectedYear('');
    setCompatibilityResult(null);
  }, [selectedModel]);

  const checkCompatibility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrand || !selectedModel || !selectedYear) return;

    const numericYear = Number(selectedYear);

    // Look for a fit in product compatibility records
    const isFit = product?.compatibility?.some((fit) => {
      const variant = fit.variant;
      if (!variant) return false;
      const gen = variant.generation;
      if (!gen) return false;
      const model = gen.model;
      if (!model) return false;
      const brand = model.brand;
      if (!brand) return false;

      if (brand.name !== selectedBrand || model.name !== selectedModel) return false;

      const endYear = fit.yearTo || new Date().getFullYear();
      return numericYear >= fit.yearFrom && numericYear <= endYear;
    });

    if (isFit) {
      setCompatibilityResult({
        checked: true,
        compatible: true,
        message: `✓ Compatible: Fits your ${selectedBrand} ${selectedModel} (${selectedYear})!`,
      });
    } else {
      setCompatibilityResult({
        checked: true,
        compatible: false,
        message: `✗ Not Compatible: This part does not fit a ${selectedBrand} ${selectedModel} (${selectedYear}).`,
      });
    }
  };

  const resetChecker = () => {
    setSelectedBrand('');
    setSelectedModel('');
    setSelectedYear('');
    setCompatibilityResult(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F8F9FA] text-zinc-900">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#D71920]" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F8F9FA] text-zinc-900">
        <Navbar />
        <main className="flex-1 container mx-auto py-16 px-4 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h1 className="text-xl font-bold">Product Not Found</h1>
            <p className="text-sm text-zinc-500">
              The product you are looking for may have been archived or deleted.
            </p>
            <Link
              href="/products"
              className="inline-block bg-[#D71920] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#BF141A] transition-colors"
            >
              Back to Catalog
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const regularPrice = product.price?.regularPrice || 0;
  const salePrice = product.price?.salePrice;
  const onSale = typeof salePrice === 'number' && salePrice < regularPrice;
  const discountPercent = onSale
    ? Math.round(((regularPrice - (salePrice as number)) / regularPrice) * 100)
    : 0;

  const qty = product.inventory?.availableQuantity ?? 0;
  const lowStock = product.inventory?.lowStockThreshold ?? 5;

  let stockLabel = 'In Stock';
  let stockClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (qty === 0) {
    stockLabel = 'Out of Stock';
    stockClass = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (qty <= lowStock) {
    stockLabel = 'Low Stock';
    stockClass = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FA] text-zinc-900">
      <Navbar />

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-zinc-800 transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
            </Link>
            <ChevronRight className="h-3 w-3 text-zinc-300" />
            <Link href="/products" className="hover:text-zinc-800 transition-colors">
              Products
            </Link>
            {product.category && (
              <>
                <ChevronRight className="h-3 w-3 text-zinc-300" />
                <Link
                  href={`/categories/${product.category.slug}`}
                  className="hover:text-zinc-800 transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="h-3 w-3 text-zinc-300" />
            <span className="text-[#D71920] font-semibold truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>

          {/* Product Overview Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery Column */}
            <div className="space-y-4">
              <div className="relative aspect-square w-full rounded-2xl bg-white border border-zinc-200 overflow-hidden flex items-center justify-center">
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Loader2 className="h-8 w-8 animate-spin text-[#D71920]" />
                )}

                {onSale && (
                  <span className="absolute top-4 left-4 bg-[#D71920] text-white text-xs font-black uppercase px-2.5 py-1 rounded shadow-sm">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails strip */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {product.images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(img.media?.storageKey || '')}
                      className={`relative h-20 w-20 flex-shrink-0 rounded-xl bg-white border overflow-hidden transition-all ${
                        activeImage === img.media?.storageKey
                          ? 'border-[#D71920] scale-95 shadow-md shadow-zinc-200/50'
                          : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <img
                        src={img.media?.storageKey}
                        alt="thumbnail"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {product.brand && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-zinc-100 border border-zinc-200 text-zinc-600 px-2 py-0.5 rounded">
                      {product.brand.name}
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded ${stockClass}`}
                  >
                    {stockLabel}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 leading-tight">
                  {product.name}
                </h1>
                <div className="text-xs text-zinc-500">
                  SKU: <span className="font-mono text-zinc-600">{product.sku}</span>
                </div>
              </div>

              {/* Price Row */}
              <div className="bg-white border border-zinc-200 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Price
                  </div>
                  <div className="flex items-baseline gap-2.5 mt-1">
                    {onSale ? (
                      <>
                        <span className="text-2xl font-black text-[#D71920]">
                          ৳{salePrice!.toLocaleString()}
                        </span>
                        <span className="text-sm text-zinc-400 line-through">
                          ৳{regularPrice.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-black text-zinc-900">
                        ৳{regularPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-zinc-500 block">Currency</span>
                  <span className="text-xs font-bold text-zinc-700">Bangladeshi Taka (BDT)</span>
                </div>
              </div>

              {/* Short Description */}
              {product.shortDescription && (
                <div className="text-sm text-zinc-600 leading-relaxed bg-white border border-zinc-200 p-4 rounded-xl">
                  {product.shortDescription}
                </div>
              )}

              {/* Fitment Compatibility Checking Tool */}
              {compatData.brands.length > 0 && (
                <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                    <Bike className="h-4.5 w-4.5 text-[#D71920]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                      Bike Fitment Checker
                    </h3>
                  </div>

                  <form
                    onSubmit={checkCompatibility}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                  >
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-zinc-500">Brand</label>
                      <select
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="bg-white border border-zinc-200 text-xs text-zinc-700 rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:border-[#D71920]/40 focus:ring-1 focus:ring-[#D71920]/40"
                      >
                        <option value="">Select Brand</option>
                        {compatData.brands.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-zinc-500">Model</label>
                      <select
                        disabled={!selectedBrand}
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-white border border-zinc-200 text-xs text-zinc-700 rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:border-[#D71920]/40 focus:ring-1 focus:ring-[#D71920]/40 disabled:opacity-40"
                      >
                        <option value="">Select Model</option>
                        {models.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-zinc-500">Year</label>
                      <select
                        disabled={!selectedModel}
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="bg-white border border-zinc-200 text-xs text-zinc-700 rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:border-[#D71920]/40 focus:ring-1 focus:ring-[#D71920]/40 disabled:opacity-40"
                      >
                        <option value="">Select Year</option>
                        {years.map((y) => (
                          <option key={y} value={String(y)}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-3 flex items-center justify-between gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={!selectedBrand || !selectedModel || !selectedYear}
                        className="bg-[#D71920] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#BF141A] disabled:opacity-40 disabled:hover:bg-[#D71920] transition-all flex items-center justify-center gap-1.5"
                      >
                        <Wrench className="h-3.5 w-3.5" />
                        Check Compatibility
                      </button>

                      {compatibilityResult && (
                        <button
                          type="button"
                          onClick={resetChecker}
                          className="text-[11px] font-semibold text-zinc-400 hover:text-zinc-600"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </form>

                  {compatibilityResult && (
                    <div
                      className={`p-3 rounded-xl border text-xs font-bold mt-2 ${
                        compatibilityResult.compatible
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {compatibilityResult.message}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Details & Specs Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6 border-t border-zinc-200">
            {/* Main Desc Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-zinc-900">Product Description</h2>
                <div className="text-sm text-zinc-600 leading-relaxed space-y-4">
                  {product.description || 'No description provided.'}
                </div>
              </div>

              {/* Compatibility fitment checklist */}
              {product.compatibility && product.compatibility.length > 0 && (
                <div className="space-y-3 pt-4">
                  <h2 className="text-lg font-bold text-zinc-900">Compatible Motorcycles</h2>
                  <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-zinc-200 text-zinc-500 uppercase font-black tracking-wider bg-zinc-50">
                          <th className="p-3">Brand</th>
                          <th className="p-3">Model</th>
                          <th className="p-3">Generation</th>
                          <th className="p-3">Variant</th>
                          <th className="p-3">Year Fitment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 text-zinc-600">
                        {product.compatibility.map((fit) => {
                          const variant = fit.variant;
                          if (!variant) return null;
                          const gen = variant.generation;
                          if (!gen) return null;
                          const model = gen.model;
                          if (!model) return null;
                          const brand = model.brand;
                          if (!brand) return null;

                          return (
                            <tr key={fit.id} className="hover:bg-zinc-50">
                              <td className="p-3 font-semibold text-zinc-900">{brand.name}</td>
                              <td className="p-3">{model.name}</td>
                              <td className="p-3 text-zinc-500">{gen.name}</td>
                              <td className="p-3 text-zinc-500">{variant.name}</td>
                              <td className="p-3 font-mono">
                                {fit.yearFrom} - {fit.yearTo || 'Present'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Specifications Column */}
            <div className="space-y-6">
              {/* Technical Specifications */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-lg font-bold text-zinc-900">Specifications</h2>
                  <div className="bg-white border border-zinc-200 rounded-2xl p-4 space-y-3 shadow-sm">
                    {product.specifications.map((spec) => (
                      <div
                        key={spec.id}
                        className="flex justify-between items-center py-1.5 border-b border-zinc-100 last:border-0 text-xs"
                      >
                        <span className="font-semibold text-zinc-500">
                          {spec.specification?.name}
                        </span>
                        <span className="text-zinc-700 text-right">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attributes (e.g. Viscosity, Color) */}
              {product.attributes && product.attributes.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-lg font-bold text-zinc-900">Product Attributes</h2>
                  <div className="bg-white border border-zinc-200 rounded-2xl p-4 space-y-3 shadow-sm">
                    {product.attributes.map((attr) => {
                      const option = attr.option;
                      if (!option) return null;
                      return (
                        <div
                          key={attr.id}
                          className="flex justify-between items-center py-1.5 border-b border-zinc-100 last:border-0 text-xs"
                        >
                          <span className="font-semibold text-zinc-500">
                            {option.attribute?.name}
                          </span>
                          <span className="text-zinc-700">{option.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
