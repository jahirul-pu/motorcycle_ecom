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

export interface Media {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  storageKey: string;
  createdAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  mediaId: string;
  position: number;
  isPrimary: boolean;
  createdAt: string;
  media?: Media;
}

export interface Price {
  id: string;
  productId: string;
  regularPrice: number;
  salePrice: number | null;
  saleStart: string | null;
  saleEnd: string | null;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Inventory {
  id: string;
  productId: string;
  availableQuantity: number;
  reservedQuantity: number;
  lowStockThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface Attribute {
  id: string;
  name: string;
  options?: AttributeOption[];
}

export interface AttributeOption {
  id: string;
  attributeId: string;
  value: string;
  attribute?: Attribute;
}

export interface ProductAttribute {
  id: string;
  productId: string;
  optionId: string;
  option?: AttributeOption;
}

export interface Specification {
  id: string;
  name: string;
}

export interface ProductSpecification {
  id: string;
  productId: string;
  specificationId: string;
  value: string;
  specification?: Specification;
}

export interface MotorcycleBrand {
  id: string;
  name: string;
}

export interface MotorcycleModel {
  id: string;
  brandId: string;
  name: string;
  brand?: MotorcycleBrand;
}

export interface MotorcycleGeneration {
  id: string;
  modelId: string;
  name: string;
  yearFrom: number;
  yearTo: number | null;
  model?: MotorcycleModel;
}

export interface MotorcycleVariant {
  id: string;
  generationId: string;
  name: string;
  generation?: MotorcycleGeneration;
}

export interface ProductCompatibility {
  id: string;
  productId: string;
  variantId: string | null;
  yearFrom: number;
  yearTo: number | null;
  variant?: MotorcycleVariant | null;
}

export interface Product {
  id: string;
  brandId: string;
  categoryId: string;
  sku: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  status: string;
  weight: number | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  
  brand?: Brand;
  category?: Category;
  images?: ProductImage[];
  price?: Price | null;
  inventory?: Inventory | null;
  attributes?: ProductAttribute[];
  specifications?: ProductSpecification[];
  compatibility?: ProductCompatibility[];
}

