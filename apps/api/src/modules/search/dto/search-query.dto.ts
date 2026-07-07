// apps/api/src/modules/search/dto/search-query.dto.ts

import { IsOptional, IsString, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class SearchQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  categories?: string; // Comma-separated category slugs

  @IsOptional()
  @IsString()
  brands?: string; // Comma-separated brand slugs

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceMax?: number;

  @IsOptional()
  @IsString()
  attributes?: string; // Format: "Color:Red,Size:XL"

  @IsOptional()
  @IsString()
  sort?: string = 'relevance';

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  inStock?: boolean;
}
