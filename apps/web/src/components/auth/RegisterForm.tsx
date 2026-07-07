'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { Button } from '@motohub/ui';
import { toast } from 'sonner';
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z
      .string()
      .regex(/^(?:\+8801|01)[3-9]\d{8}$/, 'Please enter a valid Bangladeshi mobile number')
      .optional()
      .or(z.literal('')),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterInput = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const setCredentials = useAuthStore((state) => state.setCredentials);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const response = await authService.register({
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        password: data.password,
      });
      setCredentials(response.user, response.accessToken, response.refreshToken);
      toast.success('Registration successful! Welcome to MotoHub.');
      router.push('/');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-zinc-700 mb-1" htmlFor="name">
          Full Name
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400 pointer-events-none">
            <User className="h-4 w-4" />
          </span>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            disabled={isLoading}
            className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#D71920] focus:border-transparent transition-all disabled:opacity-50"
            {...register('name')}
          />
        </div>
        {errors.name && <p className="text-xs text-red-500 mt-1.5">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-zinc-700 mb-1" htmlFor="email">
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

      <div>
        <label className="block text-sm font-semibold text-zinc-700 mb-1" htmlFor="phone">
          Mobile Number <span className="text-zinc-400 text-xs">(Optional)</span>
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400 pointer-events-none">
            <Phone className="h-4 w-4" />
          </span>
          <input
            id="phone"
            type="tel"
            placeholder="017XXXXXXXX"
            disabled={isLoading}
            className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#D71920] focus:border-transparent transition-all disabled:opacity-50"
            {...register('phone')}
          />
        </div>
        {errors.phone && <p className="text-xs text-red-500 mt-1.5">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-zinc-700 mb-1" htmlFor="password">
          Password
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
        <label className="block text-sm font-semibold text-zinc-700 mb-1" htmlFor="confirmPassword">
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
        className="w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold mt-3"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-white" />}
        Create Account
      </Button>
    </form>
  );
}
