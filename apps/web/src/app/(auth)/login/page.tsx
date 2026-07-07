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
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <Bike className="h-10 w-10 text-[#D71920]" />
          <span className="text-2xl font-extrabold tracking-tight text-zinc-900">
            MOTO<span className="text-[#D71920]">HUB</span>
          </span>
        </Link>
        <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Sign In</h2>
        <p className="mt-2 text-sm text-zinc-500">
          New to MotoHub?{' '}
          <Link
            href="/register"
            className="font-semibold text-[#D71920] hover:text-[#BF141A] transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
 
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white border border-zinc-200 py-8 px-6 shadow-md rounded-2xl sm:px-10">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
