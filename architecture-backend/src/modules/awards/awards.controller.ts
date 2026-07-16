import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { AwardsService } from './awards.service';

@ApiTags('Awards')
@Public()
@Controller('projects/:projectSlug/awards')
export class AwardsController {
  constructor(private readonly awardsService: AwardsService) {}

  @Get()
  @ApiOperation({ summary: 'List awards for a published project.' })
  async findByProject(@Param('projectSlug') projectSlug: string) {
    return { success: true, message: 'Awards retrieved successfully', data: await this.awardsService.findByProjectSlug(projectSlug) };
  }
}
