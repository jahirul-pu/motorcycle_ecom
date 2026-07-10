import { api } from '@/lib/api';
import type { CheckoutDto } from '@motohub/types';

export const ordersService = {
  checkout: (dto: CheckoutDto) => api.post('/orders/checkout', dto),
  getOrders: () => api.get('/orders'),
  getOrder: (id: string) => api.get(`/orders/${id}`),
};
