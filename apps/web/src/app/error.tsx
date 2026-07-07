'use client';

import * as React from 'react';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';
import { Button } from '@motohub/ui';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Unhandled app-level error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-50 px-4">
      <div className="max-w-md w-full text-center space-y-6 border border-zinc-800 bg-zinc-900/40 backdrop-blur rounded-2xl p-8">
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-red-500/10 text-red-500 animate-bounce">
          <AlertOctagon className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-white">System Error</h1>
          <p className="text-zinc-400 text-sm">
            Something unexpected occurred on our end. We've logged the error and are looking into
            it.
          </p>
        </div>

        {error.digest && (
          <div className="text-xs font-mono text-zinc-500 bg-zinc-950 p-2 rounded border border-zinc-800 break-all select-all">
            ID: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            variant="primary"
            onClick={reset}
            className="flex items-center justify-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reload Page
          </Button>
          <Link href="/" passHref legacyBehavior>
            <Button
              variant="secondary"
              className="flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
