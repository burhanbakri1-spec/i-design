import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MediaOrderItemDto {
  @ApiProperty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  sortOrder!: number;
}

export class ReorderProjectMediaDto {
  @ApiProperty({ type: [MediaOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaOrderItemDto)
  items!: MediaOrderItemDto[];
}
