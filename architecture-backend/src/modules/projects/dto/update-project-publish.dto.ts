import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProjectPublishDto {
  @ApiPropertyOptional({ description: 'Optional ISO date. Defaults to now when publishing.' })
  @IsOptional()
  @IsString()
  publishedAt?: string;
}
