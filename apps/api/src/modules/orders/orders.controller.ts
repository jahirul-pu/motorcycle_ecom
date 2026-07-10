import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsString, IsOptional, IsUUID } from 'class-validator';

class CheckoutDto {
  @IsUUID()
  addressId: string;

  @IsString()
  paymentMethod: string;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsString()
  deliveryNote?: string;
}

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post('checkout')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Place a new order (checkout)' })
  @ApiResponse({ status: 201, description: 'Order placed successfully.' })
  @ApiResponse({ status: 400, description: 'Cart empty or insufficient stock.' })
  checkout(@Request() req, @Body() dto: CheckoutDto) {
    return this.ordersService.checkout(
      req.user.userId,
      dto.addressId,
      dto.paymentMethod,
      dto.couponCode,
      dto.deliveryNote,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get customer order history' })
  @ApiResponse({ status: 200, description: 'Orders returned.' })
  getOrders(@Request() req) {
    return this.ordersService.getOrders(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details' })
  @ApiResponse({ status: 200, description: 'Order returned.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  getOrder(@Request() req, @Param('id') id: string) {
    return this.ordersService.getOrder(req.user.userId, id);
  }
}
