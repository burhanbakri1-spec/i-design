import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateProjectFeaturedDto {
  @ApiProperty()
  @IsBoolean()
  featured!: boolean;
}
