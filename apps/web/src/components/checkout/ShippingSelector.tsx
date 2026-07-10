'use client';

import * as React from 'react';
import { Truck } from 'lucide-react';

const SHIPPING_OPTIONS = [
  {
    id: 'inside-dhaka',
    label: 'Inside Dhaka',
    description: 'Deliver within Dhaka city',
    price: 60,
    estimatedDays: '1–2 business days',
  },
  {
    id: 'outside-dhaka',
    label: 'Outside Dhaka',
    description: 'Deliver anywhere in Bangladesh',
    price: 120,
    estimatedDays: '3–5 business days',
  },
];

interface ShippingSelectorProps {
  selected: string;
  onChange: (id: string, price: number) => void;
}

export default function ShippingSelector({ selected, onChange }: ShippingSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
        <Truck className="h-4 w-4 text-primary" />
        Shipping Method
      </h3>
      <div className="space-y-2">
        {SHIPPING_OPTIONS.map((opt) => (
          <label
            key={opt.id}
            className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
              selected === opt.id
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-zinc-200 bg-white hover:border-zinc-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="shipping"
                value={opt.id}
                checked={selected === opt.id}
                onChange={() => onChange(opt.id, opt.price)}
                className="accent-primary"
              />
              <div>
                <p className="text-sm font-semibold text-zinc-800">{opt.label}</p>
                <p className="text-xs text-zinc-400">
                  {opt.description} · {opt.estimatedDays}
                </p>
              </div>
            </div>
            <span className="text-sm font-bold text-zinc-900">৳{opt.price}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
