import { api } from '@/lib/api';
import { Category, Brand } from '@motohub/types';

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
};
