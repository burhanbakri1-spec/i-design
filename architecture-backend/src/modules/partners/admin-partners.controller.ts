import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../generated/prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { CuidValidationPipe } from '../../common/pipes/cuid-validation.pipe';
import { AssignPartnerToProjectDto } from './dto/assign-partner-to-project.dto';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { PartnersQueryDto } from './dto/partners-query.dto';
import { ReorderProjectPartnersDto } from './dto/reorder-project-partners.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PartnersService } from './partners.service';

@ApiTags('Admin Partners')
@ApiBearerAuth('access-token')
@Roles(UserRole.ADMIN, UserRole.EDITOR)
@Controller('admin/partners')
export class AdminPartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get()
  @ApiOperation({ summary: 'List partners (admin).' })
  async findAll(@Query() query: PartnersQueryDto) {
    return { success: true, message: 'Partners retrieved successfully', data: await this.partnersService.findAll(query) };
  }

  @Get(':id')
  async findOne(@Param('id', CuidValidationPipe) id: string) {
    return { success: true, message: 'Partner retrieved successfully', data: await this.partnersService.findAdminById(id) };
  }

  @Post()
  async create(@Body() dto: CreatePartnerDto) {
    return { success: true, message: 'Partner created successfully', data: await this.partnersService.create(dto) };
  }

  @Patch(':id')
  async update(@Param('id', CuidValidationPipe) id: string, @Body() dto: UpdatePartnerDto) {
    return { success: true, message: 'Partner updated successfully', data: await this.partnersService.update(id, dto) };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', CuidValidationPipe) id: string) {
    return { success: true, message: 'Partner deleted successfully', data: await this.partnersService.remove(id) };
  }
}

@ApiTags('Admin Project Partners')
@ApiBearerAuth('access-token')
@Roles(UserRole.ADMIN, UserRole.EDITOR)
@Controller('admin/projects/:projectId/partners')
export class AdminProjectPartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post()
  @ApiOperation({ summary: 'Assign a partner to a project.' })
  async assign(@Param('projectId', CuidValidationPipe) projectId: string, @Body() dto: AssignPartnerToProjectDto) {
    return { success: true, message: 'Partner assigned to project successfully', data: await this.partnersService.assignToProject(projectId, dto) };
  }

  @Patch('reorder')
  async reorder(@Param('projectId', CuidValidationPipe) projectId: string, @Body() dto: ReorderProjectPartnersDto) {
    return { success: true, message: 'Partners reordered successfully', data: await this.partnersService.reorderProjectPartners(projectId, dto) };
  }

  @Delete(':partnerId')
  async remove(@Param('projectId', CuidValidationPipe) projectId: string, @Param('partnerId', CuidValidationPipe) partnerId: string) {
    return { success: true, message: 'Partner removed from project successfully', data: await this.partnersService.removeFromProject(projectId, partnerId) };
  }
}
