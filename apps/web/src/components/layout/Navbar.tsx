'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bike, LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';
import { Button } from '@motohub/ui';
import { useRouter } from 'next/navigation';

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
    <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Bike className="h-8 w-8 text-amber-500" />
          <span className="text-xl font-bold tracking-tight text-white">
            MOTO<span className="text-amber-500">HUB</span>
          </span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-zinc-400">
          <span className="hover:text-white transition-colors cursor-pointer">Parts</span>
          <span className="hover:text-white transition-colors cursor-pointer">Gear</span>
          <span className="hover:text-white transition-colors cursor-pointer">Accessories</span>
          <span className="hover:text-white transition-colors cursor-pointer">Compatibility</span>
        </nav>

        <div className="flex items-center gap-4">
          {mounted && isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/account/profile"
                className="text-sm text-zinc-300 hover:text-white transition-colors hidden sm:inline-flex items-center gap-1.5"
              >
                <UserIcon className="h-4 w-4 text-amber-500" />
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
