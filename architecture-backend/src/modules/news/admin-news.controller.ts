import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../generated/prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { CuidValidationPipe } from '../../common/pipes/cuid-validation.pipe';
import { CreateNewsDto } from './dto/create-news.dto';
import { NewsQueryDto } from './dto/news-query.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { UpdateNewsFeaturedDto } from './dto/update-news-featured.dto';
import { NewsService } from './news.service';

@ApiTags('Admin News')
@ApiBearerAuth('access-token')
@Roles(UserRole.ADMIN, UserRole.EDITOR)
@Controller('admin/news')
export class AdminNewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'List all news (including unpublished).' })
  async findAll(@Query() query: NewsQueryDto) {
    return { success: true, message: 'News retrieved successfully', data: await this.newsService.findAllAdmin(query) };
  }

  @Get(':id')
  async findOne(@Param('id', CuidValidationPipe) id: string) {
    return { success: true, message: 'News retrieved successfully', data: await this.newsService.findAdminById(id) };
  }

  @Post()
  async create(@Body() dto: CreateNewsDto) {
    return { success: true, message: 'News created successfully', data: await this.newsService.create(dto) };
  }

  @Patch(':id')
  async update(@Param('id', CuidValidationPipe) id: string, @Body() dto: UpdateNewsDto) {
    return { success: true, message: 'News updated successfully', data: await this.newsService.update(id, dto) };
  }

  @Patch(':id/publish')
  async publish(@Param('id', CuidValidationPipe) id: string) {
    return { success: true, message: 'News published successfully', data: await this.newsService.publish(id) };
  }

  @Patch(':id/unpublish')
  async unpublish(@Param('id', CuidValidationPipe) id: string) {
    return { success: true, message: 'News unpublished successfully', data: await this.newsService.unpublish(id) };
  }

  @Patch(':id/featured')
  async featured(@Param('id', CuidValidationPipe) id: string, @Body() dto: UpdateNewsFeaturedDto) {
    return { success: true, message: 'News featured status updated successfully', data: await this.newsService.updateFeatured(id, dto.featured) };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', CuidValidationPipe) id: string) {
    return { success: true, message: 'News deleted successfully', data: await this.newsService.remove(id) };
  }
}
