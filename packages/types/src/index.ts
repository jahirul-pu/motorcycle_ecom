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

export interface Category {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  description: string | null;
  imageId: string | null;
  sortOrder: number;
  isActive: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
  parent?: Category | null;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoId: string | null;
  description: string | null;
  website: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
