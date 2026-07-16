import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class AssignPartnerToProjectDto {
  @ApiProperty()
  @IsCuid()
  partnerId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
