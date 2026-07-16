import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../generated/prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { CuidValidationPipe } from '../../common/pipes/cuid-validation.pipe';
import { CategoriesService } from './categories.service';
import { CategoriesQueryDto } from './dto/categories-query.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Admin Categories')
@ApiBearerAuth('access-token')
@Roles(UserRole.ADMIN, UserRole.EDITOR)
@Controller('admin/categories')
export class AdminCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List categories (admin).' })
  async findAll(@Query() query: CategoriesQueryDto) {
    return { success: true, message: 'Categories retrieved successfully', data: await this.categoriesService.findAll(query) };
  }

  @Get(':id')
  async findOne(@Param('id', CuidValidationPipe) id: string) {
    return { success: true, message: 'Category retrieved successfully', data: await this.categoriesService.findOne(id) };
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Create category.' })
  async create(@Body() dto: CreateCategoryDto) {
    return { success: true, message: 'Category created successfully', data: await this.categoriesService.create(dto) };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  async update(@Param('id', CuidValidationPipe) id: string, @Body() dto: UpdateCategoryDto) {
    return { success: true, message: 'Category updated successfully', data: await this.categoriesService.update(id, dto) };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', CuidValidationPipe) id: string) {
    return { success: true, message: 'Category deleted successfully', data: await this.categoriesService.remove(id) };
  }
}
