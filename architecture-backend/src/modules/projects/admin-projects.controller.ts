import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../generated/prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { CuidValidationPipe } from '../../common/pipes/cuid-validation.pipe';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsQueryDto } from './dto/projects-query.dto';
import { UpdateProjectFeaturedDto } from './dto/update-project-featured.dto';
import { UpdateProjectPublishDto } from './dto/update-project-publish.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('Admin Projects')
@ApiBearerAuth('access-token')
@Roles(UserRole.ADMIN, UserRole.EDITOR)
@Controller('admin/projects')
export class AdminProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List projects for admins and editors.' })
  async findAll(@Query() query: ProjectsQueryDto) {
    return { success: true, message: 'Projects retrieved successfully', data: await this.projectsService.findAll(query, true) };
  }

  @Get(':id')
  async findOne(@Param('id', CuidValidationPipe) id: string) {
    return { success: true, message: 'Project retrieved successfully', data: await this.projectsService.findAdminById(id) };
  }

  @Post()
  async create(@Body() dto: CreateProjectDto) {
    return { success: true, message: 'Project created successfully', data: await this.projectsService.create(dto) };
  }

  @Patch(':id')
  async update(@Param('id', CuidValidationPipe) id: string, @Body() dto: UpdateProjectDto) {
    return { success: true, message: 'Project updated successfully', data: await this.projectsService.update(id, dto) };
  }

  @Patch(':id/publish')
  async publish(@Param('id', CuidValidationPipe) id: string, @Body() dto: UpdateProjectPublishDto) {
    return { success: true, message: 'Project published successfully', data: await this.projectsService.publish(id, dto.publishedAt) };
  }

  @Patch(':id/unpublish')
  async unpublish(@Param('id', CuidValidationPipe) id: string) {
    return { success: true, message: 'Project unpublished successfully', data: await this.projectsService.unpublish(id) };
  }

  @Patch(':id/featured')
  async featured(@Param('id', CuidValidationPipe) id: string, @Body() dto: UpdateProjectFeaturedDto) {
    return { success: true, message: 'Project featured status updated successfully', data: await this.projectsService.updateFeatured(id, dto.featured) };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', CuidValidationPipe) id: string) {
    return { success: true, message: 'Project deleted successfully', data: await this.projectsService.softDelete(id) };
  }

  @Patch(':id/restore')
  @Roles(UserRole.ADMIN)
  async restore(@Param('id', CuidValidationPipe) id: string) {
    return { success: true, message: 'Project restored successfully', data: await this.projectsService.restore(id) };
  }
}
