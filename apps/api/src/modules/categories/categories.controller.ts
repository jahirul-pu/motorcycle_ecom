import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get active categories tree hierarchy' })
  @ApiResponse({ status: 200, description: 'Categories hierarchy returned successfully.' })
  findTree() {
    return this.categoriesService.findTree();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get category details by slug' })
  @ApiResponse({ status: 200, description: 'Category details returned successfully.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }
}
