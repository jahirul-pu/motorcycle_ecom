'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, Bike, Folder } from 'lucide-react';
import { searchService, SuggestionsResponse } from '@/services/search.service';
import Link from 'next/link';

export default function SearchBar() {
  const [query, setQuery] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<SuggestionsResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounce the keyword query
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // Fetch suggestions when debounced query changes
  React.useEffect(() => {
    async function fetchSuggestions() {
      if (debouncedQuery.trim().length < 2) {
        setSuggestions(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await searchService.getSuggestions(debouncedQuery);
        setSuggestions(data);
      } catch (error) {
        console.error('Error loading suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSuggestions();
  }, [debouncedQuery]);

  // Handle click outside to close dropdown suggestions
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length > 0) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = () => {
    setIsOpen(false);
    setQuery('');
  };

  const hasSuggestions = suggestions && (
    suggestions.products.length > 0 ||
    suggestions.categories.length > 0 ||
    suggestions.brands.length > 0
  );

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search parts, riding gear, brands..."
          className="w-full bg-zinc-50 border border-zinc-200 text-zinc-800 placeholder-zinc-400 rounded-full pl-10 pr-10 py-1.5 text-xs focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all shadow-inner"
        />
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
          <Search className="h-4 w-4" />
        </div>
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-primary">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          </div>
        )}
      </form>

      {/* Autocomplete Suggestions Dropdown Overlay */}
      {isOpen && (debouncedQuery.trim().length >= 2) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 overflow-hidden text-xs max-h-[420px] overflow-y-auto">
          {isLoading && !hasSuggestions && (
            <div className="p-4 text-center text-zinc-400">
              <Loader2 className="h-5 w-5 animate-spin mx-auto text-primary mb-1.5" />
              Searching suggestions...
            </div>
          )}

          {!isLoading && !hasSuggestions && (
            <div className="p-4 text-center text-zinc-500">
              No direct suggestions found for &ldquo;{debouncedQuery}&rdquo;. Press Enter to search catalog.
            </div>
          )}

          {hasSuggestions && (
            <div className="divide-y divide-zinc-100">
              {/* Category matches */}
              {suggestions.categories.length > 0 && (
                <div className="p-2.5">
                  <h4 className="px-2 pb-1.5 text-[9px] uppercase font-bold tracking-wider text-zinc-400 flex items-center gap-1">
                    <Folder className="h-3 w-3" />
                    Categories
                  </h4>
                  <div className="space-y-0.5">
                    {suggestions.categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/categories/${cat.slug}`}
                        onClick={handleSuggestionClick}
                        className="block px-2 py-1.5 hover:bg-zinc-50 rounded-lg text-zinc-700 hover:text-zinc-950 font-medium transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Brand matches */}
              {suggestions.brands.length > 0 && (
                <div className="p-2.5">
                  <h4 className="px-2 pb-1.5 text-[9px] uppercase font-bold tracking-wider text-zinc-400 flex items-center gap-1">
                    <Bike className="h-3 w-3" />
                    Brands
                  </h4>
                  <div className="space-y-0.5">
                    {suggestions.brands.map((b) => (
                      <Link
                        key={b.id}
                        href={`/brands/${b.slug}`}
                        onClick={handleSuggestionClick}
                        className="block px-2 py-1.5 hover:bg-zinc-50 rounded-lg text-zinc-700 hover:text-zinc-950 font-medium transition-colors"
                      >
                        {b.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Product matches */}
              {suggestions.products.length > 0 && (
                <div className="p-2.5">
                  <h4 className="px-2 pb-1.5 text-[9px] uppercase font-bold tracking-wider text-zinc-400 flex items-center gap-1">
                    <Search className="h-3 w-3" />
                    Products
                  </h4>
                  <div className="space-y-1 mt-0.5">
                    {suggestions.products.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/products/${prod.slug}`}
                        onClick={handleSuggestionClick}
                        className="flex items-center gap-3 p-1.5 hover:bg-zinc-50 rounded-xl transition-colors"
                      >
                        {prod.image ? (
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="h-9 w-9 object-cover rounded-lg border border-zinc-100 bg-white"
                          />
                        ) : (
                          <div className="h-9 w-9 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center justify-center text-zinc-400">
                            <Search className="h-4 w-4" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-zinc-800 truncate">{prod.name}</p>
                          <p className="text-[10px] text-primary font-bold mt-0.5">
                            {prod.price?.salePrice ? (
                              <>
                                ৳{prod.price.salePrice.toLocaleString()}
                                <span className="text-[9px] text-zinc-400 font-normal line-through ml-1.5">
                                  ৳{prod.price.regularPrice.toLocaleString()}
                                </span>
                              </>
                            ) : prod.price ? (
                              `৳${prod.price.regularPrice.toLocaleString()}`
                            ) : (
                              'Contact for Price'
                            )}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
