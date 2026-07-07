import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'User unique email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+8801700000000', description: 'User mobile number', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'SecurePassword123', description: 'User password (min 6 characters)' })
  @IsString()
  @MinLength(6)
  password: string;
}
