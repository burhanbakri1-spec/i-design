import { Test } from '@nestjs/testing';
import { ContactStatus } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ContactService } from './contact.service';

describe('ContactService', () => {
  it('creates a contact message with NEW status', async () => {
    const prisma = {
      contactMessage: {
        create: jest.fn().mockResolvedValue({ id: 'clcontact0001', status: ContactStatus.NEW }),
      },
    };
    const moduleRef = await Test.createTestingModule({
      providers: [ContactService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    const service = moduleRef.get(ContactService);
    const result = await service.create(
      { name: 'John Doe', email: 'john@example.com', message: 'I would like to discuss a project.' },
      { ipAddress: '127.0.0.1', userAgent: 'test' },
    );

    expect(result.status).toBe(ContactStatus.NEW);
    expect(prisma.contactMessage.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: ContactStatus.NEW }),
      }),
    );
  });
});
