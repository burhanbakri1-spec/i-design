import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { NewsQueryDto } from './dto/news-query.dto';
import { NewsService } from './news.service';

@ApiTags('News')
@Public()
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'List published news.' })
  async findAll(@Query() query: NewsQueryDto) {
    return { success: true, message: 'News retrieved successfully', data: await this.newsService.findAll(query) };
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured news.' })
  async featured() {
    return { success: true, message: 'Featured news retrieved successfully', data: await this.newsService.findFeatured() };
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return { success: true, message: 'News retrieved successfully', data: await this.newsService.findBySlug(slug) };
  }
}
