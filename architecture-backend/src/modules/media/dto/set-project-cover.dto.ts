import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SetProjectCoverDto {
  @ApiProperty()
  @IsString()
  mediaId!: string;
}
