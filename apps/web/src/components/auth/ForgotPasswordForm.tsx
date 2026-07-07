'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authService } from '@/services/auth.service';
import { Button } from '@motohub/ui';
import { toast } from 'sonner';
import { Mail, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotInput = z.infer<typeof forgotSchema>;

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSent, setIsSent] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotInput>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotInput) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setIsSent(true);
      toast.success('Recovery details sent successfully.');
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-600 mb-2">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-bold text-zinc-900">Check Your Mailbox</h3>
        <p className="text-sm text-zinc-600 max-w-sm mx-auto leading-relaxed">
          If an account exists for that email address, we have logged a mock password recovery link
          to the developer console log.
        </p>
        <div className="pt-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-[#D71920] hover:text-[#BF141A] font-semibold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <p className="text-sm text-zinc-500 leading-relaxed font-medium">
        Enter the email address registered with your account. We will send you instructions to reset
        your password.
      </p>

      <div>
        <label className="block text-sm font-semibold text-zinc-700 mb-1.5" htmlFor="email">
          Email Address
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400 pointer-events-none">
            <Mail className="h-4 w-4" />
          </span>
          <input
            id="email"
            type="email"
            placeholder="rider@example.com"
            disabled={isLoading}
            className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#D71920] focus:border-transparent transition-all disabled:opacity-50"
            {...register('email')}
          />
        </div>
        {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold mt-2"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-white" />}
        Send Reset Link
      </Button>

      <div className="text-center pt-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 transition-colors font-semibold"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Sign In
        </Link>
      </div>
    </form>
  );
}
