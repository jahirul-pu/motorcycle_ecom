import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'a1b2c3d4...', description: 'Unique password reset token' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'NewSecurePassword123', description: 'New password (min 6 characters)' })
  @IsString()
  @MinLength(6)
  password: string;
}
