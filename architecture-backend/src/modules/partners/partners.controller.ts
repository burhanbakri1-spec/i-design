import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { PartnersQueryDto } from './dto/partners-query.dto';
import { PartnersService } from './partners.service';

@ApiTags('Partners')
@Public()
@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get()
  @ApiOperation({ summary: 'List partners.' })
  async findAll(@Query() query: PartnersQueryDto) {
    return { success: true, message: 'Partners retrieved successfully', data: await this.partnersService.findAll(query) };
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return { success: true, message: 'Partner retrieved successfully', data: await this.partnersService.findBySlug(slug) };
  }
}
