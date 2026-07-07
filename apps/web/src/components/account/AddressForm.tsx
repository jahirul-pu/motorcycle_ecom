'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addressesService } from '@/services/addresses.service';
import { Button } from '@motohub/ui';
import { toast } from 'sonner';
import { User, Phone, MapPin, Loader2, Save, X } from 'lucide-react';
import { Address } from '@motohub/types';

const addressSchema = z.object({
  recipientName: z.string().min(2, 'Recipient name must be at least 2 characters'),
  phone: z
    .string()
    .regex(/^(?:\+8801|01)[3-9]\d{8}$/, 'Please enter a valid Bangladeshi mobile number'),
  addressLine1: z.string().min(3, 'Address line 1 must be at least 3 characters'),
  addressLine2: z.string().optional().or(z.literal('')),
  area: z.string().min(2, 'Area must be at least 2 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  postalCode: z.string().optional().or(z.literal('')),
  isDefault: z.boolean().optional(),
});

type AddressInput = z.infer<typeof addressSchema>;

interface AddressFormProps {
  initialData?: Address | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddressForm({ initialData, onSuccess, onCancel }: AddressFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      recipientName: initialData?.recipientName || '',
      phone: initialData?.phone || '',
      addressLine1: initialData?.addressLine1 || '',
      addressLine2: initialData?.addressLine2 || '',
      area: initialData?.area || '',
      city: initialData?.city || '',
      postalCode: initialData?.postalCode || '',
      isDefault: initialData?.isDefault || false,
    },
  });

  const onSubmit = async (data: AddressInput) => {
    setIsLoading(true);
    try {
      if (initialData) {
        await addressesService.updateAddress(initialData.id, {
          ...data,
          addressLine2: data.addressLine2 || undefined,
          postalCode: data.postalCode || undefined,
        });
        toast.success('Address updated successfully.');
      } else {
        await addressesService.createAddress({
          ...data,
          addressLine2: data.addressLine2 || undefined,
          postalCode: data.postalCode || undefined,
        });
        toast.success('New address added to address book.');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-zinc-100">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <h3 className="text-lg font-bold text-white">
          {initialData ? 'Edit Address' : 'Add New Address'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5" htmlFor="recipientName">
            Recipient Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
              <User className="h-4 w-4" />
            </span>
            <input
              id="recipientName"
              type="text"
              placeholder="John Doe"
              disabled={isLoading}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-transparent transition-all"
              {...register('recipientName')}
            />
          </div>
          {errors.recipientName && (
            <p className="text-xs text-red-500 mt-1">{errors.recipientName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5" htmlFor="phone">
            Contact Number
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
              <Phone className="h-4 w-4" />
            </span>
            <input
              id="phone"
              type="tel"
              placeholder="017XXXXXXXX"
              disabled={isLoading}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-transparent transition-all"
              {...register('phone')}
            />
          </div>
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1.5" htmlFor="addressLine1">
          Address Line 1
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
            <MapPin className="h-4 w-4" />
          </span>
          <input
            id="addressLine1"
            type="text"
            placeholder="House/Holding #, Road/Lane Name"
            disabled={isLoading}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-transparent transition-all"
            {...register('addressLine1')}
          />
        </div>
        {errors.addressLine1 && (
          <p className="text-xs text-red-500 mt-1">{errors.addressLine1.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1.5" htmlFor="addressLine2">
          Address Line 2 <span className="text-zinc-600 text-[10px]">(Optional)</span>
        </label>
        <input
          id="addressLine2"
          type="text"
          placeholder="Flat, Apartment, Suite, Floor Details"
          disabled={isLoading}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-transparent transition-all"
          {...register('addressLine2')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5" htmlFor="area">
            Area / Thana
          </label>
          <input
            id="area"
            type="text"
            placeholder="Mirpur / Banani"
            disabled={isLoading}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-transparent transition-all"
            {...register('area')}
          />
          {errors.area && <p className="text-xs text-red-500 mt-1">{errors.area.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5" htmlFor="city">
            City
          </label>
          <input
            id="city"
            type="text"
            placeholder="Dhaka / Chattogram"
            disabled={isLoading}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-transparent transition-all"
            {...register('city')}
          />
          {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5" htmlFor="postalCode">
            Postal Code <span className="text-zinc-600 text-[10px]">(Optional)</span>
          </label>
          <input
            id="postalCode"
            type="text"
            placeholder="1216"
            disabled={isLoading}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-transparent transition-all"
            {...register('postalCode')}
          />
        </div>
      </div>

      <div className="pt-2">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            disabled={isLoading}
            className="h-4 w-4 rounded bg-zinc-950 border-zinc-800 text-amber-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            {...register('isDefault')}
          />
          <span className="text-xs text-zinc-400">Set as default shipping address</span>
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800 mt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-xs font-medium"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold"
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-black" />
          ) : (
            <Save className="h-3.5 w-3.5 text-black" />
          )}
          Save Address
        </Button>
      </div>
    </form>
  );
}
