import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { PeopleQueryDto } from './dto/people-query.dto';
import { PeopleService } from './people.service';

@ApiTags('People')
@Public()
@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get()
  @ApiOperation({ summary: 'List published people.' })
  async findAll(@Query() query: PeopleQueryDto) {
    return { success: true, message: 'People retrieved successfully', data: await this.peopleService.findAll(query) };
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return { success: true, message: 'Person retrieved successfully', data: await this.peopleService.findBySlug(slug) };
  }
}
