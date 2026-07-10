'use client';

import * as React from 'react';
import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';
import type { Order } from '@motohub/types';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  Pending:   { label: 'Pending',   color: 'bg-amber-100 text-amber-700' },
  Confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700' },
  Packed:    { label: 'Packed',    color: 'bg-indigo-100 text-indigo-700' },
  Shipped:   { label: 'Shipped',   color: 'bg-purple-100 text-purple-700' },
  Delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
  Cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
  Returned:  { label: 'Returned',  color: 'bg-zinc-100 text-zinc-600' },
};

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.Pending;
  const itemCount = order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
  const date = new Date(order.createdAt).toLocaleDateString('en-BD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      href={`/account/orders/${order.id}`}
      className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100">
          <Package className="h-5 w-5 text-zinc-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-zinc-900 font-mono">{order.orderNumber}</p>
          <p className="mt-0.5 text-xs text-zinc-400">{date} · {itemCount} item{itemCount !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-base font-bold text-zinc-900">৳{order.total.toLocaleString()}</p>
          <p className="text-xs text-zinc-400">{order.payment?.method ?? 'N/A'}</p>
        </div>
        <span className={`hidden sm:inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${status.color}`}>
          {status.label}
        </span>
        <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
      </div>
    </Link>
  );
}
