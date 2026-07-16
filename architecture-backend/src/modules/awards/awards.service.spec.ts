import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AwardsService } from './awards.service';

const mockAward = {
  findMany: jest.fn(),
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockProject = {
  findFirst: jest.fn(),
  findUnique: jest.fn(),
};

const mockPrisma = {
  award: mockAward,
  project: mockProject,
  $transaction: jest.fn(),
};

describe('AwardsService', () => {
  let service: AwardsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockPrisma.$transaction.mockImplementation(async (arg: unknown) => {
      if (typeof arg === 'function') return arg(mockPrisma);
      const items = arg as [unknown, unknown];
      return Promise.all(items);
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwardsService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get<AwardsService>(AwardsService);
  });

  describe('findByProjectSlug', () => {
    it('should return awards for published project', async () => {
      mockProject.findFirst.mockResolvedValue({ id: 'project-1' });
      mockAward.findMany.mockResolvedValue([{ id: 'a1', title: 'Award 1', year: 2024 }]);

      const result = await service.findByProjectSlug('project-slug');
      expect(result).toHaveLength(1);
      expect(mockAward.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: [{ year: 'desc' }, { createdAt: 'desc' }] }),
      );
    });

    it('should throw for unpublished project', async () => {
      mockProject.findFirst.mockResolvedValue(null);
      await expect(service.findByProjectSlug('hidden-project')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create award for existing project', async () => {
      mockProject.findUnique.mockResolvedValue({ id: 'project-1', deletedAt: null });
      mockAward.create.mockResolvedValue({ id: 'a1', title: 'Award' });

      const result = await service.create('project-1', { title: 'Award', year: 2024 });
      expect(result.title).toBe('Award');
    });

    it('should reject for deleted project', async () => {
      mockProject.findUnique.mockResolvedValue({ id: 'project-1', deletedAt: new Date() });
      await expect(service.create('project-1', { title: 'Award' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update award', async () => {
      mockAward.findUnique.mockResolvedValue({ id: 'a1' });
      mockAward.update.mockResolvedValue({ id: 'a1', title: 'Updated' });

      const result = await service.update('a1', { title: 'Updated' });
      expect(result.title).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should delete award', async () => {
      mockAward.findUnique.mockResolvedValue({ id: 'a1' });
      mockAward.delete.mockResolvedValue({ id: 'a1', title: 'Deleted' });

      const result = await service.remove('a1');
      expect(result.title).toBe('Deleted');
    });
  });
});
