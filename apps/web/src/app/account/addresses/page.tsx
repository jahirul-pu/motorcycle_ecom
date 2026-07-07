'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import Navbar from '@/components/layout/Navbar';
import AddressBook from '@/components/account/AddressBook';
import { User, CreditCard, MapPin, Package } from 'lucide-react';
import Link from 'next/link';

export default function AddressesPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FA] text-zinc-900">
      <Navbar />

      <main className="flex-1 container mx-auto py-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="space-y-1.5 md:col-span-1">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-3 mb-3">
              Rider Account
            </h2>
            <Link
              href="/account/profile"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-100 hover:text-zinc-900 text-zinc-500 text-sm font-medium transition-all"
            >
              <User className="h-4.5 w-4.5" />
              Profile Details
            </Link>
            <span className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-100 hover:text-zinc-900 text-zinc-500 text-sm font-medium transition-all cursor-pointer">
              <Package className="h-4.5 w-4.5" />
              My Orders
            </span>
            <Link
              href="/account/addresses"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white border border-zinc-200 text-primary text-sm font-semibold shadow-sm transition-all"
            >
              <MapPin className="h-4.5 w-4.5" />
              Addresses
            </Link>
            <span className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-100 hover:text-zinc-900 text-zinc-500 text-sm font-medium transition-all cursor-pointer">
              <CreditCard className="h-4.5 w-4.5" />
              Payment Methods
            </span>
          </aside>

          <section className="md:col-span-3 space-y-6">
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <AddressBook />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
