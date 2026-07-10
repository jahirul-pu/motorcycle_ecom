import { api } from '@/lib/api';

export const couponService = {
  apply: (code: string, subtotal: number) => api.post('/coupons/apply', { code, subtotal }),
};
