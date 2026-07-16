import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../generated/prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { CuidValidationPipe } from '../../common/pipes/cuid-validation.pipe';
import { AwardsService } from './awards.service';
import { CreateAwardDto } from './dto/create-award.dto';
import { UpdateAwardDto } from './dto/update-award.dto';

@ApiTags('Admin Awards')
@ApiBearerAuth('access-token')
@Roles(UserRole.ADMIN, UserRole.EDITOR)
@Controller('admin')
export class AdminAwardsController {
  constructor(private readonly awardsService: AwardsService) {}

  @Get('projects/:projectId/awards')
  @ApiOperation({ summary: 'List awards for a project (admin).' })
  async findByProject(@Param('projectId', CuidValidationPipe) projectId: string) {
    return { success: true, message: 'Awards retrieved successfully', data: await this.awardsService.findAdminByProjectId(projectId) };
  }

  @Post('projects/:projectId/awards')
  async create(@Param('projectId', CuidValidationPipe) projectId: string, @Body() dto: CreateAwardDto) {
    return { success: true, message: 'Award created successfully', data: await this.awardsService.create(projectId, dto) };
  }

  @Patch('awards/:id')
  async update(@Param('id', CuidValidationPipe) id: string, @Body() dto: UpdateAwardDto) {
    return { success: true, message: 'Award updated successfully', data: await this.awardsService.update(id, dto) };
  }

  @Delete('awards/:id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', CuidValidationPipe) id: string) {
    return { success: true, message: 'Award deleted successfully', data: await this.awardsService.remove(id) };
  }
}
