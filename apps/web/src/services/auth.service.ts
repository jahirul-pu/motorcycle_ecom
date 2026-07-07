import { api } from '@/lib/api';
import { LoginDto, RegisterDto, AuthResponse } from '@motohub/types';

// Let's create helper types locally if they are not exposed, or write standard types.
// We will also import from @motohub/types if defined there.
export const authService = {
  login: async (dto: LoginDto): Promise<AuthResponse> => {
    return api.post('/auth/login', dto);
  },

  register: async (dto: RegisterDto): Promise<AuthResponse> => {
    return api.post('/auth/register', dto);
  },

  logout: async (refreshToken: string): Promise<void> => {
    return api.post('/auth/logout', { refreshToken });
  },

  getProfile: async (): Promise<any> => {
    return api.get('/auth/profile');
  },

  forgotPassword: async (email: string): Promise<{ success: boolean }> => {
    return api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (dto: {
    token: string;
    password?: string;
  }): Promise<{ success: boolean }> => {
    return api.post('/auth/reset-password', dto);
  },
};
