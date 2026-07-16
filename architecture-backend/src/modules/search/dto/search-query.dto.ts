import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

const allowedTypes = ['projects', 'news', 'people', 'offices', 'partners'] as const;
export type SearchType = (typeof allowedTypes)[number];

export class SearchQueryDto {
  @ApiPropertyOptional({ example: 'architecture' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(2)
  q!: string;

  @ApiPropertyOptional({ default: 5, maximum: 20 })
  @Transform(({ value }) => Number(value ?? 5))
  @IsInt()
  @Min(1)
  @Max(20)
  limit = 5;

  @ApiPropertyOptional({ example: 'projects,news' })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      : value,
  )
  @IsOptional()
  @IsIn(allowedTypes, { each: true })
  types?: SearchType[];
}
