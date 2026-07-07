import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'Active refresh token hash' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
