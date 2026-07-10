'use client';

import * as React from 'react';
import { Tag, X, Loader2 } from 'lucide-react';
import { couponService } from '@/services/coupon.service';
import { useCartStore } from '@/store/cart.store';
import { toast } from 'sonner';

export default function CouponInput() {
  const { subtotal, setCoupon, removeCoupon, couponCode, discount } = useCartStore();
  const [code, setCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    try {
      const result = await couponService.apply(code.trim().toUpperCase(), subtotal());
      setCoupon(result.coupon.code, result.discount);
      toast.success(`Coupon applied! You saved ৳${result.discount}`);
    } catch (err: any) {
      toast.error(err.message || 'Invalid coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    removeCoupon();
    setCode('');
    toast.info('Coupon removed');
  };

  if (couponCode) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-3 py-2">
        <div className="flex items-center gap-2 text-green-700">
          <Tag className="h-4 w-4" />
          <span className="text-sm font-semibold">{couponCode}</span>
          <span className="text-xs">– ৳{discount.toLocaleString()} off</span>
        </div>
        <button
          onClick={handleRemove}
          className="text-green-600 hover:text-green-800 transition-colors"
          aria-label="Remove coupon"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} className="flex gap-2">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Coupon code"
        className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-800 placeholder-zinc-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
        aria-label="Coupon code input"
      />
      <button
        type="submit"
        disabled={loading || !code.trim()}
        className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Tag className="h-3.5 w-3.5" />}
        Apply
      </button>
    </form>
  );
}
