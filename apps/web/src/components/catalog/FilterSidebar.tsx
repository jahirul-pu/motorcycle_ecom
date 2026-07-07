'use client';

import * as React from 'react';
import { catalogService } from '@/services/catalog.service';
import { Category, Brand } from '@motohub/types';
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';

interface FilterSidebarProps {
  selectedCategories: string[];
  selectedBrands: string[];
  priceMin?: number;
  priceMax?: number;
  selectedAttributes: Record<string, string[]>;
  inStock?: boolean;
  onFilterChange: (filters: {
    categories?: string[];
    brands?: string[];
    priceMin?: number;
    priceMax?: number;
    attributes?: Record<string, string[]>;
    inStock?: boolean;
  }) => void;
}

export default function FilterSidebar({
  selectedCategories,
  selectedBrands,
  priceMin,
  priceMax,
  selectedAttributes,
  inStock,
  onFilterChange,
}: FilterSidebarProps) {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [brands, setBrands] = React.useState<Brand[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Toggle state for accordion sections
  const [categoriesOpen, setCategoriesOpen] = React.useState(true);
  const [brandsOpen, setBrandsOpen] = React.useState(true);
  const [priceOpen, setPriceOpen] = React.useState(true);
  const [attributesOpen, setAttributesOpen] = React.useState(true);

  const [minInput, setMinInput] = React.useState(priceMin !== undefined ? String(priceMin) : '');
  const [maxInput, setMaxInput] = React.useState(priceMax !== undefined ? String(priceMax) : '');

  // Synchronize inputs with props changes
  React.useEffect(() => {
    setMinInput(priceMin !== undefined ? String(priceMin) : '');
  }, [priceMin]);

  React.useEffect(() => {
    setMaxInput(priceMax !== undefined ? String(priceMax) : '');
  }, [priceMax]);

  // Load catalog options
  React.useEffect(() => {
    async function loadFilterOptions() {
      try {
        const [catsData, brandsData] = await Promise.all([
          catalogService.getCategories(),
          catalogService.getBrands(),
        ]);
        setCategories(catsData);
        setBrands(brandsData);
      } catch (err) {
        console.error('Error loading filter options:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFilterOptions();
  }, []);

  const handleCategoryToggle = (slug: string) => {
    const updated = selectedCategories.includes(slug)
      ? selectedCategories.filter((s) => s !== slug)
      : [...selectedCategories, slug];
    onFilterChange({ categories: updated });
  };

  const handleBrandToggle = (slug: string) => {
    const updated = selectedBrands.includes(slug)
      ? selectedBrands.filter((s) => s !== slug)
      : [...selectedBrands, slug];
    onFilterChange({ brands: updated });
  };

  const handleAttributeToggle = (attrName: string, val: string) => {
    const currentVals = selectedAttributes[attrName] || [];
    const updatedVals = currentVals.includes(val)
      ? currentVals.filter((v) => v !== val)
      : [...currentVals, val];

    const updated = {
      ...selectedAttributes,
      [attrName]: updatedVals,
    };

    // Remove key if array is empty
    if (updatedVals.length === 0) {
      delete updated[attrName];
    }

    onFilterChange({ attributes: updated });
  };

  const applyPriceFilter = () => {
    const parsedMin = minInput.trim() !== '' ? Number(minInput) : undefined;
    const parsedMax = maxInput.trim() !== '' ? Number(maxInput) : undefined;
    onFilterChange({ priceMin: parsedMin, priceMax: parsedMax });
  };

  const handlePricePreset = (min?: number, max?: number) => {
    setMinInput(min !== undefined ? String(min) : '');
    setMaxInput(max !== undefined ? String(max) : '');
    onFilterChange({ priceMin: min, priceMax: max });
  };

  const handleInStockToggle = (checked: boolean) => {
    onFilterChange({ inStock: checked || undefined });
  };

  const resetAllFilters = () => {
    setMinInput('');
    setMaxInput('');
    onFilterChange({
      categories: [],
      brands: [],
      priceMin: undefined,
      priceMax: undefined,
      attributes: {},
      inStock: undefined,
    });
  };

  const staticAttributes = [
    { name: 'Color', options: ['Black', 'Red', 'Silver', 'Yellow', 'Blue'] },
    { name: 'Size', options: ['M', 'L', 'XL', 'XXL'] },
    { name: 'Viscosity', options: ['10W40', '20W50', '15W50'] },
    { name: 'Material', options: ['Carbon Fiber', 'Leather', 'Synthetic'] },
  ];

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-zinc-200 rounded-lg w-1/2" />
        <div className="h-32 bg-zinc-100 rounded-2xl" />
        <div className="h-32 bg-zinc-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <aside className="w-full space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-2">
        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
          <SlidersHorizontal className="h-4.5 w-4.5 text-primary" />
          Filter Catalog
        </h3>
        <button
          onClick={resetAllFilters}
          className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600 transition-colors uppercase tracking-wider"
        >
          Reset All
        </button>
      </div>

      {/* Availability (In Stock Only) */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!inStock}
            onChange={(e) => handleInStockToggle(e.target.checked)}
            className="h-4 w-4 rounded bg-white border-zinc-200 text-primary focus:ring-0 focus:ring-offset-0 cursor-pointer"
          />
          <span className="text-xs font-semibold text-zinc-700">Show In Stock Only</span>
        </label>
      </div>

      {/* Categories Filter Accordion */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => setCategoriesOpen(!categoriesOpen)}
          className="w-full flex items-center justify-between p-4 text-xs font-bold text-zinc-800 hover:bg-zinc-50 border-b border-zinc-100 transition-colors"
        >
          <span>CATEGORIES</span>
          {categoriesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {categoriesOpen && (
          <div className="p-4 space-y-2 max-h-[220px] overflow-y-auto">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.slug)}
                  onChange={() => handleCategoryToggle(cat.slug)}
                  className="h-4 w-4 rounded bg-white border-zinc-200 text-primary focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-zinc-600 hover:text-zinc-900 transition-colors font-medium">
                  {cat.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brands Filter Accordion */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => setBrandsOpen(!brandsOpen)}
          className="w-full flex items-center justify-between p-4 text-xs font-bold text-zinc-800 hover:bg-zinc-50 border-b border-zinc-100 transition-colors"
        >
          <span>BRANDS</span>
          {brandsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {brandsOpen && (
          <div className="p-4 space-y-2 max-h-[220px] overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center gap-2.5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.slug)}
                  onChange={() => handleBrandToggle(brand.slug)}
                  className="h-4 w-4 rounded bg-white border-zinc-200 text-primary focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-zinc-600 hover:text-zinc-900 transition-colors font-medium">
                  {brand.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Ranges Accordion */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => setPriceOpen(!priceOpen)}
          className="w-full flex items-center justify-between p-4 text-xs font-bold text-zinc-800 hover:bg-zinc-50 border-b border-zinc-100 transition-colors"
        >
          <span>PRICE RANGE (BDT)</span>
          {priceOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {priceOpen && (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minInput}
                onChange={(e) => setMinInput(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded-xl px-2.5 py-1.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/40"
              />
              <span className="text-zinc-300">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxInput}
                onChange={(e) => setMaxInput(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded-xl px-2.5 py-1.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/40"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handlePricePreset(undefined, 1000)}
                className="text-[10px] bg-zinc-50 border border-zinc-200 px-2 py-1 rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 font-medium transition-colors"
              >
                Under ৳1k
              </button>
              <button
                onClick={() => handlePricePreset(1000, 5000)}
                className="text-[10px] bg-zinc-50 border border-zinc-200 px-2 py-1 rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 font-medium transition-colors"
              >
                ৳1k - ৳5k
              </button>
              <button
                onClick={() => handlePricePreset(5000, 15000)}
                className="text-[10px] bg-zinc-50 border border-zinc-200 px-2 py-1 rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 font-medium transition-colors"
              >
                ৳5k - ৳15k
              </button>
              <button
                onClick={() => handlePricePreset(15000, undefined)}
                className="text-[10px] bg-zinc-50 border border-zinc-200 px-2 py-1 rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 font-medium transition-colors"
              >
                Over ৳15k
              </button>
            </div>

            <button
              onClick={applyPriceFilter}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-2 rounded-xl text-[10px] transition-colors"
            >
              Apply Price
            </button>
          </div>
        )}
      </div>

      {/* Dynamic Attributes Filter Accordions */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => setAttributesOpen(!attributesOpen)}
          className="w-full flex items-center justify-between p-4 text-xs font-bold text-zinc-800 hover:bg-zinc-50 border-b border-zinc-100 transition-colors"
        >
          <span>PRODUCT SPECIFICATIONS</span>
          {attributesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {attributesOpen && (
          <div className="p-4 space-y-4 divide-y divide-zinc-100 max-h-[300px] overflow-y-auto">
            {staticAttributes.map((attr, index) => (
              <div key={attr.name} className={`${index > 0 ? 'pt-3' : ''}`}>
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  {attr.name}
                </h4>
                <div className="space-y-1.5">
                  {attr.options.map((val) => {
                    const isChecked = (selectedAttributes[attr.name] || []).includes(val);
                    return (
                      <label key={val} className="flex items-center gap-2.5 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleAttributeToggle(attr.name, val)}
                          className="h-4 w-4 rounded bg-white border-zinc-200 text-primary focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="text-zinc-600 hover:text-zinc-900 transition-colors font-medium">
                          {val}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
