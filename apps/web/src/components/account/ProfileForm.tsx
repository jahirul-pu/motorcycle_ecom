'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/auth.store';
import { profileService } from '@/services/profile.service';
import { Button } from '@motohub/ui';
import { toast } from 'sonner';
import { Mail, User, Phone, Loader2, Save } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .regex(/^(?:\+8801|01)[3-9]\d{8}$/, 'Please enter a valid Bangladeshi mobile number')
    .optional()
    .or(z.literal('')),
});

type ProfileInput = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(true);
  const { user, updateUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      phone: '',
    },
  });

  // Fetch latest profile state from API on mount
  React.useEffect(() => {
    async function loadProfile() {
      try {
        const data = await profileService.getProfile();
        reset({
          name: data.name || '',
          phone: data.phone || '',
        });
        updateUser({
          ...user!,
          name: data.name,
          role: data.role,
        });
      } catch (err: any) {
        toast.error('Failed to load profile details.');
      } finally {
        setIsFetching(false);
      }
    }
    if (user) {
      loadProfile();
    } else {
      setIsFetching(false);
    }
  }, [reset, user, updateUser]);

  const onSubmit = async (data: ProfileInput) => {
    setIsLoading(true);
    try {
      const response = await profileService.updateProfile({
        name: data.name,
        phone: data.phone || undefined,
      });
      updateUser({
        ...user!,
        name: response.name,
      });
      reset({
        name: response.name,
        phone: response.phone || '',
      });
      toast.success('Profile details updated successfully.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-zinc-500 mb-1.5">
          Email Address <span className="text-zinc-400 text-xs font-normal">(Read-Only)</span>
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400 pointer-events-none">
            <Mail className="h-4 w-4" />
          </span>
          <input
            type="email"
            readOnly
            value={user?.email || ''}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-10 pr-4 py-2.5 text-zinc-500 cursor-not-allowed outline-none select-none text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-zinc-700 mb-1.5" htmlFor="name">
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
            className="w-full bg-white border border-zinc-200 rounded-lg pl-10 pr-4 py-2.5 text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 text-sm"
            {...register('name')}
          />
        </div>
        {errors.name && <p className="text-xs text-red-500 mt-1.5">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-zinc-700 mb-1.5" htmlFor="phone">
          Mobile Number <span className="text-zinc-400 text-xs font-normal">(Optional)</span>
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
            className="w-full bg-white border border-zinc-200 rounded-lg pl-10 pr-4 py-2.5 text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 text-sm"
            {...register('phone')}
          />
        </div>
        {errors.phone && <p className="text-xs text-red-500 mt-1.5">{errors.phone.message}</p>}
      </div>

      <div className="pt-2 flex justify-end">
        <Button
          type="submit"
          disabled={isLoading || !isDirty}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          ) : (
            <Save className="h-4 w-4 text-white" />
          )}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
