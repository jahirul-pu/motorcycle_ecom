import { api } from '@/lib/api';

export const wishlistService = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId: string) => api.post('/wishlist', { productId }),
  removeFromWishlist: (productId: string) => api.delete(`/wishlist/${productId}`),
};
