import { api } from '@/lib/api';
import { UpdateProfileDto } from '@motohub/types';

export const profileService = {
  getProfile: async (): Promise<any> => {
    return api.get('/me');
  },

  updateProfile: async (dto: UpdateProfileDto): Promise<any> => {
    return api.patch('/me', dto);
  },
};
