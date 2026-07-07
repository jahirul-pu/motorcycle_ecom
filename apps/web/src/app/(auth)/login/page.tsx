import * as React from 'react';
import Link from 'next/link';
import { Bike } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - MotoHub',
  description: 'Log in to your MotoHub account to track orders and manage details.',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50 justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <Bike className="h-10 w-10 text-amber-500" />
          <span className="text-2xl font-extrabold tracking-tight text-white">
            MOTO<span className="text-amber-500">HUB</span>
          </span>
        </Link>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Sign In</h2>
        <p className="mt-2 text-sm text-zinc-400">
          New to MotoHub?{' '}
          <Link
            href="/register"
            className="font-medium text-amber-500 hover:text-amber-400 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
