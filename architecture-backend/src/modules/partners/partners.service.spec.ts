import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PartnersService } from './partners.service';

const mockPartner = {
  findMany: jest.fn(),
  findFirst: jest.fn(),
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
};

const mockProjectPartner = {
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
  count: jest.fn(),
};

const mockProject = { findUnique: jest.fn() };

const mockPrisma = {
  partner: mockPartner,
  projectPartner: mockProjectPartner,
  project: mockProject,
  $transaction: jest.fn(),
};

describe('PartnersService', () => {
  let service: PartnersService;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockPrisma.$transaction.mockImplementation(async (arg: unknown) => {
      if (typeof arg === 'function') return arg(mockPrisma);
      const items = arg as [unknown, unknown];
      return Promise.all(items);
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnersService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get<PartnersService>(PartnersService);
  });

  describe('findAll', () => {
    it('should return partners', async () => {
      mockPartner.findMany.mockResolvedValue([{ id: '1', name: 'Partner 1' }]);
      mockPartner.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 50 });
      expect(result.data).toHaveLength(1);
    });
  });

  describe('create', () => {
    it('should create partner with auto-slug', async () => {
      mockPartner.findFirst.mockResolvedValue(null);
      mockPartner.create.mockImplementation(async (args: Record<string, unknown>) => ({ id: '1', ...args.data as Record<string, unknown> }));

      const result = await service.create({ name: 'Test Partner' });
      expect(result.slug).toBe('test-partner');
    });
  });

  describe('assignToProject', () => {
    it('should assign partner to project', async () => {
      mockProject.findUnique.mockResolvedValue({ id: 'project-1', deletedAt: null });
      mockPartner.findUnique.mockResolvedValue({ id: 'partner-1' });
      mockProjectPartner.findUnique.mockResolvedValue(null);
      mockProjectPartner.create.mockResolvedValue({ partnerId: 'partner-1', role: 'Engineer', partner: { name: 'Partner' } });

      const result = await service.assignToProject('project-1', { partnerId: 'partner-1', role: 'Engineer' });
      expect(result.role).toBe('Engineer');
    });

    it('should reject duplicate assignment', async () => {
      mockProject.findUnique.mockResolvedValue({ id: 'project-1', deletedAt: null });
      mockPartner.findUnique.mockResolvedValue({ id: 'partner-1' });
      mockProjectPartner.findUnique.mockResolvedValue({ partnerId: 'partner-1' });

      await expect(service.assignToProject('project-1', { partnerId: 'partner-1' }))
        .rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should delete relations then partner in transaction', async () => {
      mockPartner.findUnique.mockResolvedValue({ id: 'partner-1' });
      mockPrisma.$transaction.mockImplementation(async (cb: unknown) => {
        if (typeof cb === 'function') return cb(mockPrisma);
        return cb;
      });
      mockProjectPartner.deleteMany.mockResolvedValue({ count: 0 });
      mockPartner.delete.mockResolvedValue({ id: 'partner-1', name: 'Deleted' });

      const result = await service.remove('partner-1');
      expect(mockProjectPartner.deleteMany).toHaveBeenCalledWith({ where: { partnerId: 'partner-1' } });
      expect(mockPartner.delete).toHaveBeenCalledWith({ where: { id: 'partner-1' }, select: { id: true, name: true } });
    });
  });

  describe('removeFromProject', () => {
    it('should remove partner from project', async () => {
      mockProjectPartner.findUnique.mockResolvedValue({ projectId: 'p1', partnerId: 'p1' });
      mockProjectPartner.delete.mockResolvedValue({});

      const result = await service.removeFromProject('p1', 'p1');
      expect(result.success).toBe(true);
    });
  });
});
