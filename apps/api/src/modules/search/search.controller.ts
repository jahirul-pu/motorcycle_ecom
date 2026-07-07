// apps/api/src/modules/search/search.controller.ts

import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Search active products with text matching, dynamic filters, sorting, and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Matched product results and metadata returned successfully.',
  })
  search(@Query() searchQueryDto: SearchQueryDto) {
    return this.searchService.search(searchQueryDto);
  }

  @Get('suggestions')
  @ApiOperation({
    summary:
      'Get quick suggestions match list (products, categories, brands) matching search prefix',
  })
  @ApiQuery({
    name: 'q',
    required: true,
    type: String,
    description: 'Search prefix keyword query',
  })
  @ApiResponse({ status: 200, description: 'Suggestions list payload.' })
  getSuggestions(@Query('q') q: string) {
    return this.searchService.getSuggestions(q);
  }
}
