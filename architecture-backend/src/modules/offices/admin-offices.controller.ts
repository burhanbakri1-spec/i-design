import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../generated/prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { CuidValidationPipe } from '../../common/pipes/cuid-validation.pipe';
import { CreateOfficeDto } from './dto/create-office.dto';
import { OfficesQueryDto } from './dto/offices-query.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { OfficesService } from './offices.service';

@ApiTags('Admin Offices')
@ApiBearerAuth('access-token')
@Roles(UserRole.ADMIN, UserRole.EDITOR)
@Controller('admin/offices')
export class AdminOfficesController {
  constructor(private readonly officesService: OfficesService) {}

  @Get()
  @ApiOperation({ summary: 'List all offices (admin).' })
  async findAll(@Query() query: OfficesQueryDto) {
    return { success: true, message: 'Offices retrieved successfully', data: await this.officesService.findAllAdmin(query) };
  }

  @Get(':id')
  async findOne(@Param('id', CuidValidationPipe) id: string) {
    return { success: true, message: 'Office retrieved successfully', data: await this.officesService.findAdminById(id) };
  }

  @Post()
  async create(@Body() dto: CreateOfficeDto) {
    return { success: true, message: 'Office created successfully', data: await this.officesService.create(dto) };
  }

  @Patch(':id')
  async update(@Param('id', CuidValidationPipe) id: string, @Body() dto: UpdateOfficeDto) {
    return { success: true, message: 'Office updated successfully', data: await this.officesService.update(id, dto) };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', CuidValidationPipe) id: string) {
    return { success: true, message: 'Office deleted successfully', data: await this.officesService.remove(id) };
  }
}
