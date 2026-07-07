import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john@example.com', description: 'User account email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePassword123', description: 'User account password' })
  @IsString()
  @MinLength(6)
  password: string;
}
