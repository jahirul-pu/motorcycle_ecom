// apps/api/src/modules/products/products.controller.ts

import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get active products list with pagination, filters, and sorting' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'categorySlug', required: false, type: String, description: 'Filter by category slug' })
  @ApiQuery({ name: 'brandSlug', required: false, type: String, description: 'Filter by brand slug' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Sort criteria (newest, price_asc, price_desc)' })
  @ApiResponse({ status: 200, description: 'Products list and meta metadata.' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('categorySlug') categorySlug?: string,
    @Query('brandSlug') brandSlug?: string,
    @Query('sort') sort?: string,
  ) {
    return this.productsService.findAll({
      page,
      limit,
      categorySlug,
      brandSlug,
      sort,
    });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get product details by slug' })
  @ApiResponse({ status: 200, description: 'Product details returned successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Get(':id/images')
  @ApiOperation({ summary: 'Get product images' })
  @ApiResponse({ status: 200, description: 'Product images list.' })
  findImages(@Param('id') id: string) {
    return this.productsService.findImages(id);
  }

  @Get(':id/specifications')
  @ApiOperation({ summary: 'Get product specifications' })
  @ApiResponse({ status: 200, description: 'Product specifications list.' })
  findSpecifications(@Param('id') id: string) {
    return this.productsService.findSpecifications(id);
  }

  @Get(':id/compatibility')
  @ApiOperation({ summary: 'Get product compatibility fitments' })
  @ApiResponse({ status: 200, description: 'Product motorcycle compatibility fitments list.' })
  findCompatibility(@Param('id') id: string) {
    return this.productsService.findCompatibility(id);
  }
}
