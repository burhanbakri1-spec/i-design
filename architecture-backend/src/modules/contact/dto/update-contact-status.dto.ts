import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ContactStatus } from '../../../generated/prisma/client';

export class UpdateContactStatusDto {
  @ApiProperty({ enum: ContactStatus })
  @IsEnum(ContactStatus)
  status!: ContactStatus;
}
