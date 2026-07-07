import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateAddressDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the address recipient',
    required: false,
  })
  @IsString()
  @IsOptional()
  recipientName?: string;

  @ApiProperty({ example: '+8801700000000', description: 'Contact phone number', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: '123 Pilot Road',
    description: 'Address line 1 (street, building, holding)',
    required: false,
  })
  @IsString()
  @IsOptional()
  addressLine1?: string;

  @ApiProperty({
    example: 'Flat 4B',
    description: 'Address line 2 (apartment, suite, unit)',
    required: false,
  })
  @IsString()
  @IsOptional()
  addressLine2?: string;

  @ApiProperty({
    example: 'Mirpur-10',
    description: 'Thana or local neighborhood area name',
    required: false,
  })
  @IsString()
  @IsOptional()
  area?: string;

  @ApiProperty({ example: 'Dhaka', description: 'City name', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: '1216', description: 'Postal or zip code', required: false })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({
    example: false,
    description: 'Set as the default shipping address',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
