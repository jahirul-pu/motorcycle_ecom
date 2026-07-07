import * as React from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-50">
      <div className="space-y-4 flex flex-col items-center">
        <LoadingSpinner size="lg" />
        <p className="text-sm font-medium tracking-wide text-zinc-400 animate-pulse">
          Loading MotoHub...
        </p>
      </div>
    </div>
  );
}
