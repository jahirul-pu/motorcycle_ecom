'use client';

import * as React from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { ordersService } from '@/services/orders.service';
import { useAuthStore } from '@/store/auth.store';
import OrderCard from '@/components/orders/OrderCard';
import type { Order } from '@motohub/types';

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    ordersService
      .getOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <main className="container mx-auto max-w-2xl px-4 py-24 text-center">
        <Package className="mx-auto h-16 w-16 text-zinc-200 mb-4" />
        <h1 className="text-2xl font-bold text-zinc-800">My Orders</h1>
        <p className="mt-2 text-zinc-500">Sign in to view your order history.</p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90 transition-colors"
        >
          Sign In
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 flex items-center gap-3">
          <Package className="h-7 w-7 text-primary" />
          My Orders
        </h1>
        {!loading && (
          <p className="mt-1 text-sm text-zinc-400">
            {orders.length} order{orders.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-zinc-100" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <Package className="h-14 w-14 text-zinc-200" />
          <p className="text-lg font-semibold text-zinc-600">No orders yet</p>
          <p className="text-sm text-zinc-400">Your orders will appear here once you place one.</p>
          <Link
            href="/products"
            className="mt-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </main>
  );
}
