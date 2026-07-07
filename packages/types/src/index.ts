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
