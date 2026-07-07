'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bike, LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';
import { Button } from '@motohub/ui';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/navigation/SearchBar';

export default function Navbar() {
  const { user, refreshToken, clearCredentials, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearCredentials();
      toast.success('Successfully logged out.');
      router.push('/');
      router.refresh();
    }
  };

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Bike className="h-8 w-8 text-primary" />
          <span className="text-xl font-extrabold tracking-tight text-zinc-900">
            MOTO<span className="text-primary">HUB</span>
          </span>
        </Link>

        {/* Center Search Bar */}
        <div className="hidden sm:flex flex-1 justify-center max-w-md mx-6">
          <SearchBar />
        </div>

        <nav className="hidden md:flex gap-6 text-sm font-semibold text-zinc-500 mr-4">
          <Link href="/products" className="hover:text-zinc-950 transition-colors cursor-pointer">
            Parts
          </Link>
          <span className="hover:text-zinc-950 transition-colors cursor-pointer">Gear</span>
          <span className="hover:text-zinc-950 transition-colors cursor-pointer">Accessories</span>
          <span className="hover:text-zinc-950 transition-colors cursor-pointer">
            Compatibility
          </span>
        </nav>

        <div className="flex items-center gap-4">
          {mounted && isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/account/profile"
                className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors hidden sm:inline-flex items-center gap-1.5 font-semibold"
              >
                <UserIcon className="h-4 w-4 text-primary" />
                Hi, {user.name}
              </Link>
              <Button
                variant="secondary"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" passHref legacyBehavior>
                <Button variant="secondary" className="px-3.5 py-1.5 text-xs font-medium">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" passHref legacyBehavior>
                <Button variant="primary" className="px-3.5 py-1.5 text-xs font-medium">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
