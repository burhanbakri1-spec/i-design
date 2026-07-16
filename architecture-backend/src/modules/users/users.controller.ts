import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../generated/prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UsersQueryDto } from './dto/users-query.dto';
import { UsersService } from './users.service';

@ApiTags('Admin Users')
@ApiBearerAuth('access-token')
@Roles(UserRole.ADMIN)
@Controller('admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List users. Admin only.' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully.' })
  async findAll(@Query() query: UsersQueryDto) {
    return {
      success: true,
      message: 'Users retrieved successfully',
      data: await this.usersService.findAll(query),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one user by id. Admin only.' })
  async findOne(@Param('id') id: string) {
    return {
      success: true,
      message: 'User retrieved successfully',
      data: await this.usersService.findSafeById(id),
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create an admin or editor user. Admin only.' })
  async create(@Body() dto: CreateUserDto) {
    return {
      success: true,
      message: 'User created successfully',
      data: await this.usersService.create(dto),
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update safe user fields. Admin only.' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto, @CurrentUser() user: AuthenticatedUser) {
    return {
      success: true,
      message: 'User updated successfully',
      data: await this.usersService.update(id, dto, user.id),
    };
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Activate or deactivate a user. Admin only.' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return {
      success: true,
      message: 'User status updated successfully',
      data: await this.usersService.updateStatus(id, dto, user.id),
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a user by deactivating the account. Admin only.' })
  async remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return {
      success: true,
      message: 'User deactivated successfully',
      data: await this.usersService.softDelete(id, user.id),
    };
  }
}
