import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

class ReorderItem {
  @ApiProperty()
  @IsCuid()
  partnerId!: string;

  @ApiProperty()
  @IsInt()
  sortOrder!: number;
}

export class ReorderProjectPartnersDto {
  @ApiProperty({ type: [ReorderItem] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReorderItem)
  items!: ReorderItem[];
}
