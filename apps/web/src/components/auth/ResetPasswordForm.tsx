'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authService } from '@/services/auth.service';
import { Button } from '@motohub/ui';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const resetSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetInput = z.infer<typeof resetSchema>;

export default function ResetPasswordForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetInput>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetInput) => {
    if (!token) {
      toast.error('Reset token is missing in URL.');
      return;
    }
    setIsLoading(true);
    try {
      await authService.resetPassword({
        token,
        password: data.password,
      });
      setIsSuccess(true);
      toast.success('Your password has been reset successfully.');
    } catch (error: any) {
      toast.error(error.message || 'Reset token is invalid or has expired.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-red-500 font-medium leading-relaxed">
          Invalid recovery link. The recovery token is missing. Please initiate a new recovery
          request.
        </p>
        <div className="mt-5">
          <Link href="/forgot-password" passHref legacyBehavior>
            <Button variant="secondary" className="px-4 py-2">
              Forgot Password
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-600 mb-2">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-bold text-zinc-900">Password Updated</h3>
        <p className="text-sm text-zinc-600 max-w-sm mx-auto leading-relaxed">
          Your new password has been applied. You can now use it to sign in to your rider account.
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-zinc-700 mb-1.5" htmlFor="password">
          New Password
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400 pointer-events-none">
            <Lock className="h-4 w-4" />
          </span>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            disabled={isLoading}
            className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-10 py-2.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#D71920] focus:border-transparent transition-all disabled:opacity-50"
            {...register('password')}
          />
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 focus:outline-none"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 mt-1.5">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-zinc-700 mb-1.5" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400 pointer-events-none">
            <Lock className="h-4 w-4" />
          </span>
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            disabled={isLoading}
            className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#D71920] focus:border-transparent transition-all disabled:opacity-50"
            {...register('confirmPassword')}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 mt-1.5">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold mt-4"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-white" />}
        Reset Password
      </Button>
    </form>
  );
}
