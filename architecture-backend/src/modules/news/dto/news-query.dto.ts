import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class NewsQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @Transform(({ value }) => Number(value ?? 1))
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ default: 12, maximum: 100 })
  @Transform(({ value }) => Number(value ?? 12))
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 12;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  @IsOptional()
  @IsInt()
  year?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value === undefined ? undefined : value === true || value === 'true'))
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ enum: ['createdAt', 'publishedAt', 'title'] })
  @IsOptional()
  @IsIn(['createdAt', 'publishedAt', 'title'])
  sortBy?: 'createdAt' | 'publishedAt' | 'title';

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
