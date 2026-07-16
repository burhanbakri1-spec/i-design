import { Module } from '@nestjs/common';
import { AdminPartnersController, AdminProjectPartnersController } from './admin-partners.controller';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';

@Module({
  controllers: [PartnersController, AdminPartnersController, AdminProjectPartnersController],
  providers: [PartnersService],
  exports: [PartnersService],
})
export class PartnersModule {}
