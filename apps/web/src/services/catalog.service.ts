import { api } from '@/lib/api';
import { Category, Brand, Product, ProductCompatibility } from '@motohub/types';

export const catalogService = {
  getCategories: async (): Promise<Category[]> => {
    return api.get('/categories');
  },

  getCategoryBySlug: async (slug: string): Promise<Category> => {
    return api.get(`/categories/${slug}`);
  },

  getBrands: async (): Promise<Brand[]> => {
    return api.get('/brands');
  },

  getBrandBySlug: async (slug: string): Promise<Brand> => {
    return api.get(`/brands/${slug}`);
  },

  getProducts: async (params?: {
    page?: number;
    limit?: number;
    categorySlug?: string;
    brandSlug?: string;
    sort?: string;
  }): Promise<{
    items: Product[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> => {
    const query = new URLSearchParams();
    if (params) {
      if (params.page) query.append('page', String(params.page));
      if (params.limit) query.append('limit', String(params.limit));
      if (params.categorySlug) query.append('categorySlug', params.categorySlug);
      if (params.brandSlug) query.append('brandSlug', params.brandSlug);
      if (params.sort) query.append('sort', params.sort);
    }
    const queryString = query.toString();
    return api.get(`/products${queryString ? `?${queryString}` : ''}`);
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    return api.get(`/products/${slug}`);
  },

  getProductCompatibility: async (id: string): Promise<ProductCompatibility[]> => {
    return api.get(`/products/${id}/compatibility`);
  },
};
