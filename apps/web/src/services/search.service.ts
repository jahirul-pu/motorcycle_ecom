import { api } from '@/lib/api';
import { Product } from '@motohub/types';

export interface SearchResponse {
  items: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SuggestionProduct {
  id: string;
  name: string;
  slug: string;
  price: {
    regularPrice: number;
    salePrice: number | null;
  } | null;
  image: string | null;
}

export interface SuggestionCategory {
  id: string;
  name: string;
  slug: string;
}

export interface SuggestionBrand {
  id: string;
  name: string;
  slug: string;
}

export interface SuggestionsResponse {
  products: SuggestionProduct[];
  categories: SuggestionCategory[];
  brands: SuggestionBrand[];
}

export const searchService = {
  search: async (params: {
    q?: string;
    page?: number;
    limit?: number;
    categories?: string;
    brands?: string;
    priceMin?: number;
    priceMax?: number;
    attributes?: string;
    sort?: string;
    inStock?: boolean;
  }): Promise<SearchResponse> => {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.categories) query.append('categories', params.categories);
    if (params.brands) query.append('brands', params.brands);
    if (params.priceMin !== undefined) query.append('priceMin', String(params.priceMin));
    if (params.priceMax !== undefined) query.append('priceMax', String(params.priceMax));
    if (params.attributes) query.append('attributes', params.attributes);
    if (params.sort) query.append('sort', params.sort);
    if (params.inStock !== undefined) query.append('inStock', String(params.inStock));

    const queryString = query.toString();
    return api.get(`/search${queryString ? `?${queryString}` : ''}`);
  },

  getSuggestions: async (q: string): Promise<SuggestionsResponse> => {
    if (!q || q.trim().length === 0) {
      return { products: [], categories: [], brands: [] };
    }
    return api.get(`/search/suggestions?q=${encodeURIComponent(q)}`);
  },
};
