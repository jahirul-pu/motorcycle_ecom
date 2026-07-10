'use client';

import * as React from 'react';
import { CreditCard } from 'lucide-react';

const PAYMENT_METHODS = [
  {
    id: 'Cash on Delivery',
    label: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: '💵',
  },
  {
    id: 'bKash',
    label: 'bKash',
    description: 'Mobile financial service',
    icon: '📱',
  },
  {
    id: 'Nagad',
    label: 'Nagad',
    description: 'Digital financial service',
    icon: '💳',
  },
  {
    id: 'Rocket',
    label: 'Rocket',
    description: 'Dutch-Bangla mobile banking',
    icon: '🚀',
  },
];

interface PaymentSelectorProps {
  selected: string;
  onChange: (method: string) => void;
}

export default function PaymentSelector({ selected, onChange }: PaymentSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
        <CreditCard className="h-4 w-4 text-primary" />
        Payment Method
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {PAYMENT_METHODS.map((method) => (
          <label
            key={method.id}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${
              selected === method.id
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-zinc-200 bg-white hover:border-zinc-300'
            }`}
          >
            <input
              type="radio"
              name="payment"
              value={method.id}
              checked={selected === method.id}
              onChange={() => onChange(method.id)}
              className="accent-primary"
            />
            <span className="text-xl">{method.icon}</span>
            <div>
              <p className="text-sm font-semibold text-zinc-800">{method.label}</p>
              <p className="text-xs text-zinc-400">{method.description}</p>
            </div>
          </label>
        ))}
      </div>
      {selected !== 'Cash on Delivery' && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          ⚠️ Mobile payment integration is coming soon. Please use Cash on Delivery for now.
        </p>
      )}
    </div>
  );
}
