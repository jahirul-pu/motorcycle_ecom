import * as React from 'react';
import Link from 'next/link';
import { Bike, Home, Compass } from 'lucide-react';
import { Button } from '@motohub/ui';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      <header className="border-b border-zinc-900 bg-zinc-950">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <Bike className="h-8 w-8 text-amber-500" />
            <span className="text-xl font-bold tracking-tight text-white">
              MOTO<span className="text-amber-500">HUB</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="max-w-md w-full space-y-6">
          <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
            <Compass className="h-10 w-10 animate-[spin_3s_linear_infinite]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-7xl font-extrabold text-white tracking-tighter">404</h1>
            <h2 className="text-xl font-bold text-zinc-200">Lost on the Trail?</h2>
            <p className="text-zinc-400 text-sm max-w-sm mx-auto">
              The page you are looking for doesn't exist or has been relocated to another segment.
            </p>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <Link href="/" passHref legacyBehavior>
              <Button variant="primary" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Back Home
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-sm text-zinc-600">
        <p>© 2026 MotoHub. All rights reserved.</p>
      </footer>
    </div>
  );
}
