import { Module } from '@nestjs/common';
import { AdminPeopleController, AdminProjectPeopleController } from './admin-people.controller';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';

@Module({
  controllers: [PeopleController, AdminPeopleController, AdminProjectPeopleController],
  providers: [PeopleService],
  exports: [PeopleService],
})
export class PeopleModule {}
