import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsString, IsNumber, IsPositive } from 'class-validator';

class ApplyCouponDto {
  @IsString()
  code: string;

  @IsNumber()
  @IsPositive()
  subtotal: number;
}

@ApiTags('coupons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('coupons')
export class CouponsController {
  constructor(private couponsService: CouponsService) {}

  @Post('apply')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate and apply coupon code' })
  @ApiResponse({ status: 200, description: 'Coupon valid. Discount returned.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired coupon.' })
  applyCoupon(@Request() req, @Body() dto: ApplyCouponDto) {
    return this.couponsService.applyCoupon(req.user.userId, dto.code, dto.subtotal);
  }
}
