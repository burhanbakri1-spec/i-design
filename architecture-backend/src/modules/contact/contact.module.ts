import { Module } from '@nestjs/common';
import { AdminContactController } from './admin-contact.controller';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
  controllers: [ContactController, AdminContactController],
  providers: [ContactService],
})
export class ContactModule {}
