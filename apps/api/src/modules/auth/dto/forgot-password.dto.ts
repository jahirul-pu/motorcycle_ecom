import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'john@example.com', description: 'User account email' })
  @IsEmail()
  email: string;
}
