import { Shield, Settings } from 'lucide-react';
import { Button } from '@motohub/ui';
import { config } from '@motohub/config';
import { formatCurrency } from '@motohub/utils';
import Navbar from '@/components/layout/Navbar';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
            Premium Motorcycle Parts & Accessories
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            Engineered for performance, designed for riders. The best selection of genuine spares
            and riding gear in Bangladesh at {config.appName}.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button variant="primary">Shop Spares Now</Button>
            <Button variant="secondary">Check Compatibility</Button>
          </div>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 text-sm text-zinc-300">
              <Shield className="h-4 w-4 text-amber-500" />
              100% Genuine Products
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 text-sm text-zinc-300">
              <Settings className="h-4 w-4 text-amber-500" />
              Delivery starting at {formatCurrency(60)}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-800 bg-zinc-950 py-6 text-center text-sm text-zinc-500">
        <p>© 2026 {config.appName}. All rights reserved.</p>
      </footer>
    </div>
  );
}
