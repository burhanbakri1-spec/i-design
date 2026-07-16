import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { OfficesQueryDto } from './dto/offices-query.dto';
import { OfficesService } from './offices.service';

@ApiTags('Offices')
@Public()
@Controller('offices')
export class OfficesController {
  constructor(private readonly officesService: OfficesService) {}

  @Get()
  @ApiOperation({ summary: 'List published offices.' })
  async findAll(@Query() query: OfficesQueryDto) {
    return { success: true, message: 'Offices retrieved successfully', data: await this.officesService.findAll(query) };
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return { success: true, message: 'Office retrieved successfully', data: await this.officesService.findBySlug(slug) };
  }
}
