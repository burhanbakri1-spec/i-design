import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../generated/prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { CuidValidationPipe } from '../../common/pipes/cuid-validation.pipe';
import { AssignPersonToProjectDto } from './dto/assign-person-to-project.dto';
import { CreatePersonDto } from './dto/create-person.dto';
import { PeopleQueryDto } from './dto/people-query.dto';
import { ReorderProjectPeopleDto } from './dto/reorder-project-people.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PeopleService } from './people.service';

@ApiTags('Admin People')
@ApiBearerAuth('access-token')
@Roles(UserRole.ADMIN, UserRole.EDITOR)
@Controller('admin/people')
export class AdminPeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get()
  @ApiOperation({ summary: 'List all people (admin).' })
  async findAll(@Query() query: PeopleQueryDto) {
    return { success: true, message: 'People retrieved successfully', data: await this.peopleService.findAllAdmin(query) };
  }

  @Get(':id')
  async findOne(@Param('id', CuidValidationPipe) id: string) {
    return { success: true, message: 'Person retrieved successfully', data: await this.peopleService.findAdminById(id) };
  }

  @Post()
  async create(@Body() dto: CreatePersonDto) {
    return { success: true, message: 'Person created successfully', data: await this.peopleService.create(dto) };
  }

  @Patch(':id')
  async update(@Param('id', CuidValidationPipe) id: string, @Body() dto: UpdatePersonDto) {
    return { success: true, message: 'Person updated successfully', data: await this.peopleService.update(id, dto) };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', CuidValidationPipe) id: string) {
    return { success: true, message: 'Person deleted successfully', data: await this.peopleService.remove(id) };
  }
}

@ApiTags('Admin Project People')
@ApiBearerAuth('access-token')
@Roles(UserRole.ADMIN, UserRole.EDITOR)
@Controller('admin/projects/:projectId/people')
export class AdminProjectPeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  @ApiOperation({ summary: 'Assign a person to a project.' })
  async assign(@Param('projectId', CuidValidationPipe) projectId: string, @Body() dto: AssignPersonToProjectDto) {
    return { success: true, message: 'Person assigned to project successfully', data: await this.peopleService.assignToProject(projectId, dto) };
  }

  @Patch('reorder')
  async reorder(@Param('projectId', CuidValidationPipe) projectId: string, @Body() dto: ReorderProjectPeopleDto) {
    return { success: true, message: 'People reordered successfully', data: await this.peopleService.reorderProjectPeople(projectId, dto) };
  }

  @Delete(':personId')
  async remove(@Param('projectId', CuidValidationPipe) projectId: string, @Param('personId', CuidValidationPipe) personId: string) {
    return { success: true, message: 'Person removed from project successfully', data: await this.peopleService.removeFromProject(projectId, personId) };
  }
}
