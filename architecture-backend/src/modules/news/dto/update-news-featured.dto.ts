import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateNewsFeaturedDto {
  @ApiProperty()
  @IsBoolean()
  featured!: boolean;
}
