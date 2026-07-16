import { Module } from '@nestjs/common';
import { AdminOfficesController } from './admin-offices.controller';
import { OfficesController } from './offices.controller';
import { OfficesService } from './offices.service';

@Module({
  controllers: [OfficesController, AdminOfficesController],
  providers: [OfficesService],
  exports: [OfficesService],
})
export class OfficesModule {}
