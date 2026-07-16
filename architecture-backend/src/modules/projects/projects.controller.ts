import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { ProjectsQueryDto } from './dto/projects-query.dto';
import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@Public()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List published projects.' })
  async findAll(@Query() query: ProjectsQueryDto) {
    return { success: true, message: 'Projects retrieved successfully', data: await this.projectsService.findAll(query) };
  }

  @Get('featured')
  async featured() {
    return { success: true, message: 'Featured projects retrieved successfully', data: await this.projectsService.featured() };
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return { success: true, message: 'Project retrieved successfully', data: await this.projectsService.findBySlug(slug) };
  }
}
