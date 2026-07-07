'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@motohub/ui';
import { Loader2, CheckCircle2, AlertCircle, Bike } from 'lucide-react';
import Link from 'next/link';

function VerifyEmailContent() {
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = React.useState('');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  React.useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus('error');
        setErrorMessage('Verification token is missing in recovery link.');
        return;
      }
      try {
        await api.post('/auth/verify-email', { token });
        setStatus('success');
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.message || 'Verification token is invalid or has expired.');
      }
    }
    verify();
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="text-center py-8 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-amber-500 mx-auto" />
        <h3 className="text-lg font-bold text-white">Verifying Email</h3>
        <p className="text-xs text-zinc-400">Please wait while we confirm your credentials...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-amber-500/10 text-amber-500 mb-2 mx-auto">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-bold text-white">Account Verified</h3>
        <p className="text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
          Your email address has been successfully verified! You can now access all customer
          benefits on MotoHub.
        </p>
        <div className="pt-4">
          <Link href="/login" passHref legacyBehavior>
            <Button className="px-6 py-2.5">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-6 space-y-4">
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-500/10 text-red-500 mb-2 mx-auto">
        <AlertCircle className="h-10 w-10" />
      </div>
      <h3 className="text-xl font-bold text-white">Verification Failed</h3>
      <p className="text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">{errorMessage}</p>
      <div className="pt-4">
        <Link href="/login" passHref legacyBehavior>
          <Button variant="secondary" className="px-6 py-2.5">
            Back to Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50 justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center gap-2 mb-6">
          <Bike className="h-10 w-10 text-amber-500" />
          <span className="text-2xl font-extrabold tracking-tight text-white">
            MOTO<span className="text-amber-500">HUB</span>
          </span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Email Verification</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          <React.Suspense
            fallback={
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
              </div>
            }
          >
            <VerifyEmailContent />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
