import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BrandsService } from './brands.service';

@ApiTags('brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  @ApiOperation({ summary: 'List all active brands' })
  @ApiResponse({ status: 200, description: 'List of brands returned successfully.' })
  findAll() {
    return this.brandsService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get brand details by slug' })
  @ApiResponse({ status: 200, description: 'Brand details returned successfully.' })
  @ApiResponse({ status: 404, description: 'Brand not found.' })
  findBySlug(@Param('slug') slug: string) {
    return this.brandsService.findBySlug(slug);
  }
}
