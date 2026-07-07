export interface BaseUser {
  id: string;
  email: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  phone?: string;
  password?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password?: string;
}

export interface UpdateProfileDto {
  name?: string;
  phone?: string;
}

export interface VerifyEmailDto {
  token: string;
}

export interface Address {
  id: string;
  userId: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  area: string;
  city: string;
  postalCode?: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressDto {
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  area: string;
  city: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface UpdateAddressDto {
  recipientName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  area?: string;
  city?: string;
  postalCode?: string;
  isDefault?: boolean;
}
