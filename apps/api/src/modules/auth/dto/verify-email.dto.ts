import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ example: 'a1b2c3d4...', description: 'Unique email verification token' })
  @IsString()
  @IsNotEmpty()
  token: string;
}
