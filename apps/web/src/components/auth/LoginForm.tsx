'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { Button } from '@motohub/ui';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const setCredentials = useAuthStore((state) => state.setCredentials);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const response = await authService.login({
        email: data.email,
        password: data.password,
      });
      setCredentials(response.user, response.accessToken, response.refreshToken);
      toast.success('Welcome back to MotoHub!');
      router.push('/');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Check credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1.5" htmlFor="email">
          Email Address
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 pointer-events-none">
            <Mail className="h-4 w-4" />
          </span>
          <input
            id="email"
            type="email"
            placeholder="rider@example.com"
            disabled={isLoading}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:opacity-50"
            {...register('email')}
          />
        </div>
        {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email.message}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-zinc-300" htmlFor="password">
            Password
          </label>
          <a
            href="/forgot-password"
            className="text-xs text-amber-500 hover:text-amber-400 transition-colors"
          >
            Forgot Password?
          </a>
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 pointer-events-none">
            <Lock className="h-4 w-4" />
          </span>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            disabled={isLoading}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-10 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:opacity-50"
            {...register('password')}
          />
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-400 focus:outline-none"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 mt-1.5">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            disabled={isLoading}
            className="h-4 w-4 rounded bg-zinc-900 border-zinc-800 text-amber-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            {...register('rememberMe')}
          />
          <span className="text-xs text-zinc-400">Remember me</span>
        </label>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold mt-2"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-black" />}
        Sign In
      </Button>
    </form>
  );
}
