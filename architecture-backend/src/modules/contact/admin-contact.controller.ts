import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../generated/prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { CuidValidationPipe } from '../../common/pipes/cuid-validation.pipe';
import { ContactService } from './contact.service';
import { ContactQueryDto } from './dto/contact-query.dto';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';

@ApiTags('Admin Contact')
@ApiBearerAuth('access-token')
@Controller('admin/contact')
export class AdminContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'List contact messages.' })
  async findAll(@Query() query: ContactQueryDto) {
    return { success: true, message: 'Contact messages retrieved successfully', data: await this.contactService.findAll(query) };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  async findOne(@Param('id', CuidValidationPipe) id: string) {
    return { success: true, message: 'Contact message retrieved successfully', data: await this.contactService.findOne(id) };
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  async updateStatus(@Param('id', CuidValidationPipe) id: string, @Body() dto: UpdateContactStatusDto) {
    return { success: true, message: 'Contact message status updated successfully', data: await this.contactService.updateStatus(id, dto) };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', CuidValidationPipe) id: string) {
    return { success: true, message: 'Contact message deleted successfully', data: await this.contactService.remove(id) };
  }
}
