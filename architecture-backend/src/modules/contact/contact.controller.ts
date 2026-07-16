import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import { ContactService } from './contact.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

@ApiTags('Contact')
@Public()
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @Throttle({ default: { limit: 5, ttl: 600000 } })
  @ApiOperation({ summary: 'Submit a contact message.' })
  async create(@Body() dto: CreateContactMessageDto, @Req() request: Request) {
    return {
      success: true,
      message: 'Contact message submitted successfully',
      data: await this.contactService.create(dto, {
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
      }),
    };
  }
}
