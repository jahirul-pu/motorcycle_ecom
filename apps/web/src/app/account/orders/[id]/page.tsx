'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, MapPin, CreditCard, Clock } from 'lucide-react';
import { ordersService } from '@/services/orders.service';
import { useAuthStore } from '@/store/auth.store';
import OrderTimeline from '@/components/orders/OrderTimeline';
import type { Order } from '@motohub/types';

const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Packed: 'bg-indigo-100 text-indigo-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
  Returned: 'bg-zinc-100 text-zinc-600',
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated } = useAuthStore();
  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [orderId, setOrderId] = React.useState<string | null>(null);

  React.useEffect(() => {
    params.then((p) => setOrderId(p.id));
  }, [params]);

  React.useEffect(() => {
    if (!isAuthenticated || !orderId) {
      setLoading(false);
      return;
    }
    ordersService
      .getOrder(orderId)
      .then(setOrder)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [isAuthenticated, orderId]);

  if (!isAuthenticated) {
    return (
      <main className="container mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-zinc-500">Sign in to view this order.</p>
        <Link href="/login" className="mt-4 inline-block text-sm font-semibold text-primary">
          Sign In →
        </Link>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="container mx-auto max-w-3xl px-4 py-10 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-zinc-100" />
        ))}
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="container mx-auto max-w-2xl px-4 py-24 text-center">
        <Package className="mx-auto h-14 w-14 text-zinc-200 mb-4" />
        <p className="text-lg font-semibold text-zinc-700">Order not found</p>
        <Link
          href="/account/orders"
          className="mt-4 inline-block text-sm font-semibold text-primary"
        >
          ← Back to Orders
        </Link>
      </main>
    );
  }

  const addr = order.addressSnapshot as Record<string, string>;
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/account/orders"
            className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-700 transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Orders
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 font-mono">
            {order.orderNumber}
          </h1>
          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
            <Clock className="h-3.5 w-3.5" />
            {orderDate}
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1.5 text-xs font-bold ${STATUS_COLORS[order.status] ?? 'bg-zinc-100 text-zinc-600'}`}
        >
          {order.status}
        </span>
      </div>

      {/* Timeline */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <OrderTimeline currentStatus={order.status} />
      </div>

      {/* Items */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4">
        <h2 className="text-sm font-bold text-zinc-700 flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          Items Ordered
        </h2>
        <ul className="divide-y divide-zinc-100">
          {order.items?.map((item) => {
            const productImages = (item as any).product?.images;
            const imageUrl = productImages?.[0]?.media?.storageKey;
            return (
              <li key={item.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                  {imageUrl ? (
                    <Image src={imageUrl} alt={item.name} fill className="object-cover" />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-800 line-clamp-1">{item.name}</p>
                  <p className="text-xs text-zinc-400 font-mono">{item.sku}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-zinc-900">
                    ৳{item.subtotal.toLocaleString()}
                  </p>
                  <p className="text-xs text-zinc-400">
                    Qty: {item.quantity} × ৳{item.price.toLocaleString()}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Pricing + Address grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pricing */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 space-y-2 text-sm">
          <h3 className="font-bold text-zinc-700 flex items-center gap-2 mb-3">
            <CreditCard className="h-4 w-4 text-primary" />
            Payment Summary
          </h3>
          <div className="flex justify-between text-zinc-500">
            <span>Subtotal</span>
            <span className="font-medium text-zinc-800">৳{order.subtotal.toLocaleString()}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>–৳{order.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-zinc-500">
            <span>Shipping</span>
            <span className="font-medium text-zinc-800">৳{order.shipping.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-zinc-200 pt-2 font-bold text-zinc-900">
            <span>Total</span>
            <span>৳{order.total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-zinc-400 text-xs pt-1">
            <span>Method</span>
            <span className="font-medium">{order.payment?.method ?? 'N/A'}</span>
          </div>
          <div className="flex justify-between text-zinc-400 text-xs">
            <span>Payment Status</span>
            <span
              className={`font-semibold ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}
            >
              {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 space-y-1 text-sm">
          <h3 className="font-bold text-zinc-700 flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-primary" />
            Delivery Address
          </h3>
          <p className="font-semibold text-zinc-800">{addr.recipientName}</p>
          <p className="text-zinc-500">{addr.phone}</p>
          <p className="text-zinc-500">{addr.addressLine1}</p>
          {addr.addressLine2 && <p className="text-zinc-500">{addr.addressLine2}</p>}
          <p className="text-zinc-500">
            {addr.area}, {addr.city}
          </p>
          {addr.postalCode && <p className="text-zinc-500">Postal: {addr.postalCode}</p>}
          {addr.deliveryNote && (
            <p className="mt-2 text-xs text-zinc-400 italic">Note: {addr.deliveryNote}</p>
          )}
        </div>
      </div>
    </main>
  );
}
