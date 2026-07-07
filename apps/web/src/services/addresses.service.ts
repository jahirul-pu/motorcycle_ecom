import { api } from '@/lib/api';
import { CreateAddressDto, UpdateAddressDto, Address } from '@motohub/types';

export const addressesService = {
  getAddresses: async (): Promise<Address[]> => {
    return api.get('/me/addresses');
  },

  createAddress: async (dto: CreateAddressDto): Promise<Address> => {
    return api.post('/me/addresses', dto);
  },

  updateAddress: async (id: string, dto: UpdateAddressDto): Promise<Address> => {
    return api.patch(`/me/addresses/${id}`, dto);
  },

  deleteAddress: async (id: string): Promise<void> => {
    return api.delete(`/me/addresses/${id}`);
  },
};
