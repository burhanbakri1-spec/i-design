import { Module } from '@nestjs/common';
import { AdminAwardsController } from './admin-awards.controller';
import { AwardsController } from './awards.controller';
import { AwardsService } from './awards.service';

@Module({
  controllers: [AwardsController, AdminAwardsController],
  providers: [AwardsService],
  exports: [AwardsService],
})
export class AwardsModule {}
