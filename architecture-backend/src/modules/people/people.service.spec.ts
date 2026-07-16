import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PeopleService } from './people.service';

const mockPersonOp = {
  findMany: jest.fn(),
  findFirst: jest.fn(),
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
};

const mockProjectPerson = {
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
};

const mockOffice = { findUnique: jest.fn() };
const mockProject = { findUnique: jest.fn() };

const mockPrisma = {
  person: mockPersonOp,
  projectPerson: mockProjectPerson,
  office: mockOffice,
  project: mockProject,
  $transaction: jest.fn(),
};

describe('PeopleService', () => {
  let service: PeopleService;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockPrisma.$transaction.mockImplementation(async (arg: unknown) => {
      if (typeof arg === 'function') return arg(mockPrisma);
      const items = arg as [unknown, unknown];
      return Promise.all(items);
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [PeopleService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get<PeopleService>(PeopleService);
  });

  describe('findAll', () => {
    it('should return published people only', async () => {
      mockPersonOp.findMany.mockResolvedValue([{ id: '1', name: 'Person 1' }]);
      mockPersonOp.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 50 });
      expect(result.data).toHaveLength(1);
      expect(mockPersonOp.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { published: true } }),
      );
    });
  });

  describe('findBySlug', () => {
    it('should return person with projects', async () => {
      mockPersonOp.findFirst.mockResolvedValue({
        id: '1', name: 'Person 1',
        projects: [{ role: 'Architect', project: { title: 'Project 1' } }],
      });

      const result = await service.findBySlug('person-1');
      expect(result.name).toBe('Person 1');
      expect(result.projects).toHaveLength(1);
    });
  });

  describe('create', () => {
    it('should validate officeId if provided', async () => {
      mockOffice.findUnique.mockResolvedValue(null);
      mockPersonOp.findFirst.mockResolvedValue(null);

      await expect(service.create({ name: 'Person', officeId: 'invalid' }))
        .rejects.toThrow(BadRequestException);
    });

    it('should create person with valid officeId', async () => {
      mockOffice.findUnique.mockResolvedValue({ id: 'valid-office' });
      mockPersonOp.findFirst.mockResolvedValue(null);
      mockPersonOp.create.mockResolvedValue({ id: '1', name: 'Person', officeId: 'valid-office' });

      const result = await service.create({ name: 'Person', officeId: 'valid-office' });
      expect(result.officeId).toBe('valid-office');
    });
  });

  describe('assignToProject', () => {
    it('should assign person to project', async () => {
      mockProject.findUnique.mockResolvedValue({ id: 'project-1', deletedAt: null });
      mockPersonOp.findUnique.mockResolvedValue({ id: 'person-1' });
      mockProjectPerson.findUnique.mockResolvedValue(null);
      mockProjectPerson.create.mockResolvedValue({ personId: 'person-1', role: 'Architect', person: { name: 'Person 1' } });

      const result = await service.assignToProject('project-1', { personId: 'person-1', role: 'Architect' });
      expect(result.role).toBe('Architect');
    });

    it('should reject duplicate assignment', async () => {
      mockProject.findUnique.mockResolvedValue({ id: 'project-1', deletedAt: null });
      mockPersonOp.findUnique.mockResolvedValue({ id: 'person-1' });
      mockProjectPerson.findUnique.mockResolvedValue({ personId: 'person-1' });

      await expect(service.assignToProject('project-1', { personId: 'person-1' }))
        .rejects.toThrow(ConflictException);
    });
  });

  describe('removeFromProject', () => {
    it('should remove person from project', async () => {
      mockProjectPerson.findUnique.mockResolvedValue({ projectId: 'p1', personId: 'p1' });
      mockProjectPerson.delete.mockResolvedValue({});

      const result = await service.removeFromProject('p1', 'p1');
      expect(result.success).toBe(true);
    });

    it('should throw if not assigned', async () => {
      mockProjectPerson.findUnique.mockResolvedValue(null);
      await expect(service.removeFromProject('p1', 'nonexistent'))
        .rejects.toThrow(NotFoundException);
    });
  });
});
