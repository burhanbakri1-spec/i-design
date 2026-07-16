import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { CategoriesService } from './categories.service';
import { CategoriesQueryDto } from './dto/categories-query.dto';

@ApiTags('Categories')
@Public()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List categories.' })
  async findAll(@Query() query: CategoriesQueryDto) {
    return { success: true, message: 'Categories retrieved successfully', data: await this.categoriesService.findAll(query) };
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get category tree.' })
  async tree() {
    return { success: true, message: 'Category tree retrieved successfully', data: await this.categoriesService.findTree() };
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return { success: true, message: 'Category retrieved successfully', data: await this.categoriesService.findBySlug(slug) };
  }
}
