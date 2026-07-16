import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OfficesService } from './offices.service';

const mockOffice = {
  findMany: jest.fn(),
  findFirst: jest.fn(),
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
};

const mockPerson = { findMany: jest.fn(), updateMany: jest.fn() };

const mockPrisma = {
  office: mockOffice,
  person: mockPerson,
  $transaction: jest.fn(),
};

describe('OfficesService', () => {
  let service: OfficesService;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockPrisma.$transaction.mockImplementation(async (arg: unknown) => {
      if (typeof arg === 'function') return arg(mockPrisma);
      const items = arg as [unknown, unknown];
      return Promise.all(items);
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfficesService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get<OfficesService>(OfficesService);
  });

  describe('findAll', () => {
    it('should return published offices only', async () => {
      mockOffice.findMany.mockResolvedValue([{ id: '1', name: 'Office 1' }]);
      mockOffice.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 50 });
      expect(result.data).toHaveLength(1);
      expect(mockOffice.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { published: true } }),
      );
    });
  });

  describe('findBySlug', () => {
    it('should return office with people', async () => {
      mockOffice.findFirst.mockResolvedValue({
        id: '1', name: 'Copenhagen', published: true,
        _count: { people: 2 },
      });
      mockPerson.findMany.mockResolvedValue([
        { id: 'p1', name: 'Person 1', sortOrder: 1 },
        { id: 'p2', name: 'Person 2', sortOrder: 2 },
      ]);

      const result = await service.findBySlug('copenhagen');
      expect(result.name).toBe('Copenhagen');
      expect(result.people).toHaveLength(2);
      expect(result.peopleCount).toBe(2);
    });

    it('should throw if not found', async () => {
      mockOffice.findFirst.mockResolvedValue(null);
      await expect(service.findBySlug('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create an office', async () => {
      mockOffice.findFirst.mockResolvedValue(null);
      mockOffice.create.mockResolvedValue({ id: '1', name: 'New Office' });

      const result = await service.create({ name: 'New Office', city: 'City', country: 'Country' });
      expect(result.name).toBe('New Office');
    });

    it('should handle duplicate slug', async () => {
      mockOffice.findFirst
        .mockResolvedValueOnce({ id: 'exists' })
        .mockResolvedValueOnce(null);
      mockOffice.create.mockImplementation(async (args: Record<string, unknown>) => ({ id: '1', ...args.data as Record<string, unknown> }));

      const result = await service.create({ name: 'New Office', city: 'City', country: 'Country' });
      expect(result.slug).toContain('-2');
    });
  });

  describe('remove', () => {
    it('should set officeId to null on people before deleting', async () => {
      mockOffice.findUnique.mockResolvedValue({ id: '1', _count: { people: 2 } });
      mockPrisma.$transaction.mockImplementation(async (cb: unknown) => {
        if (typeof cb === 'function') return cb(mockPrisma);
        return cb;
      });

      await service.remove('1');
      expect(mockPerson.updateMany).toHaveBeenCalledWith(
        { where: { officeId: '1' }, data: { officeId: null } },
      );
    });
  });
});
