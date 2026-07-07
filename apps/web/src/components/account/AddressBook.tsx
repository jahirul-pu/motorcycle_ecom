'use client';

import * as React from 'react';
import { addressesService } from '@/services/addresses.service';
import { Address } from '@motohub/types';
import { Button } from '@motohub/ui';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, MapPin, Loader2, Check } from 'lucide-react';
import AddressForm from './AddressForm';

export default function AddressBook() {
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [activeAddress, setActiveAddress] = React.useState<Address | null>(null);

  const fetchAddresses = React.useCallback(async () => {
    try {
      const data = await addressesService.getAddresses();
      setAddresses(data);
    } catch (err: any) {
      toast.error('Failed to load address book.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await addressesService.deleteAddress(id);
      toast.success('Address deleted successfully.');
      fetchAddresses();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete address.');
    }
  };

  const handleFormSuccess = () => {
    setIsEditing(false);
    setActiveAddress(null);
    fetchAddresses();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="max-w-2xl">
        <AddressForm
          initialData={activeAddress}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setIsEditing(false);
            setActiveAddress(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Address Book</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Manage your billing and shipping address destinations.
          </p>
        </div>
        <Button
          onClick={() => {
            setActiveAddress(null);
            setIsEditing(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold"
        >
          <Plus className="h-4 w-4 text-white" />
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-200 rounded-2xl bg-zinc-50">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-zinc-100 text-zinc-400 mb-3">
            <MapPin className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900">No Addresses Added</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
            Add a shipping destination address to speed up your checkout flows.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`p-5 rounded-xl border transition-all ${
                address.isDefault
                  ? 'bg-red-50/50 border-primary/20 shadow-sm'
                  : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h4 className="font-bold text-sm text-zinc-900">{address.recipientName}</h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{address.phone}</p>
                </div>
                {address.isDefault && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                    <Check className="h-3 w-3" />
                    Default
                  </span>
                )}
              </div>

              <div className="text-xs text-zinc-600 leading-relaxed min-h-[48px]">
                <p>{address.addressLine1}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                <p>
                  {address.area}, {address.city}
                  {address.postalCode ? ` - ${address.postalCode}` : ''}
                </p>
                <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-wide">
                  {address.country}
                </p>
              </div>

              <div className="flex justify-end gap-2 border-t border-zinc-100 pt-3 mt-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setActiveAddress(address);
                    setIsEditing(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px]"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleDelete(address.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
