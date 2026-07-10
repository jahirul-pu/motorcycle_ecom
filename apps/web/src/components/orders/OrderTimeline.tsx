'use client';

import * as React from 'react';
import { CheckCircle2, Clock, Package, Truck, Star } from 'lucide-react';

const TIMELINE_STEPS = [
  { status: 'Pending', label: 'Order Placed', icon: Clock },
  { status: 'Confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { status: 'Packed', label: 'Packed', icon: Package },
  { status: 'Shipped', label: 'Shipped', icon: Truck },
  { status: 'Delivered', label: 'Delivered', icon: Star },
];

const STATUS_ORDER = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

interface OrderTimelineProps {
  currentStatus: string;
}

export default function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  const isCancelled = currentStatus === 'Cancelled' || currentStatus === 'Returned';

  if (isCancelled) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
        Order {currentStatus}
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-between">
      {TIMELINE_STEPS.map((step, index) => {
        const Icon = step.icon;
        const completed = index <= currentIndex;
        const active = index === currentIndex;

        return (
          <React.Fragment key={step.status}>
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                  completed
                    ? 'border-primary bg-primary text-white'
                    : 'border-zinc-200 bg-white text-zinc-300'
                } ${active ? 'ring-4 ring-primary/20' : ''}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span
                className={`text-[10px] font-semibold text-center leading-tight ${
                  completed ? 'text-primary' : 'text-zinc-400'
                }`}
              >
                {step.label}
              </span>
            </div>

            {index < TIMELINE_STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-1 rounded-full transition-all ${
                  index < currentIndex ? 'bg-primary' : 'bg-zinc-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
