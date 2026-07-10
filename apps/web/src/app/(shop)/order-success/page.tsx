'use client';

import * as React from 'react';
import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function OrderSuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get('order');
  const orderId = params.get('id');

  return (
    <main className="container mx-auto max-w-xl px-4 py-20 text-center">
      {/* Animated success icon */}
      <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 ring-8 ring-green-50">
        <CheckCircle2 className="h-12 w-12 text-green-500" strokeWidth={1.5} />
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Order Placed!</h1>
      <p className="mt-3 text-zinc-500">
        Thank you for your order. We&apos;ll get it packed and on its way soon.
      </p>

      {orderNumber && (
        <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-3">
          <Package className="h-4 w-4 text-primary" />
          <span className="text-sm text-zinc-500">Order number:</span>
          <span className="font-mono text-sm font-bold text-zinc-900">{orderNumber}</span>
        </div>
      )}

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        {orderId && (
          <Link
            href={`/account/orders/${orderId}`}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90 transition-colors"
          >
            <Package className="h-4 w-4" />
            Track Order
          </Link>
        )}
        <Link
          href="/products"
          className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
        >
          Continue Shopping
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <p className="mt-10 text-xs text-zinc-400">
        A confirmation will be logged to your order history.
      </p>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <React.Suspense
      fallback={
        <main className="flex min-h-[60vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </main>
      }
    >
      <OrderSuccessContent />
    </React.Suspense>
  );
}
