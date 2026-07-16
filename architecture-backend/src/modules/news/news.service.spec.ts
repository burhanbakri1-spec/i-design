import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { createBaseSlug } from '../../common/utils/slug.util';
import { PrismaService } from '../../prisma/prisma.service';
import { NewsService } from './news.service';

const mockNews = {
  findMany: jest.fn(),
  findFirst: jest.fn(),
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
};

const mockPrisma = {
  news: mockNews,
  $transaction: jest.fn(),
};

describe('NewsService', () => {
  let service: NewsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockPrisma.$transaction.mockImplementation(async (arg: unknown) => {
      if (typeof arg === 'function') return arg(mockPrisma);
      const items = arg as [unknown, unknown];
      return Promise.all(items);
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewsService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get<NewsService>(NewsService);
  });

  describe('findAll', () => {
    it('should return paginated news', async () => {
      mockNews.findMany.mockResolvedValue([{ id: '1', title: 'News 1' }]);
      mockNews.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 12 });

      expect(result.data).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
      expect(mockNews.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { published: true, publishedAt: { lte: expect.any(Date) } } }),
      );
    });
  });

  describe('findBySlug', () => {
    it('should return published news by slug', async () => {
      mockNews.findFirst.mockResolvedValue({ id: '1', title: 'News 1', slug: 'news-1' });

      const result = await service.findBySlug('news-1');
      expect(result.title).toBe('News 1');
    });

    it('should throw if not found', async () => {
      mockNews.findFirst.mockResolvedValue(null);
      await expect(service.findBySlug('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a news item', async () => {
      mockNews.findFirst.mockResolvedValue(null);
      mockNews.create.mockResolvedValue({ id: '1', title: 'Test News' });

      const result = await service.create({ title: 'Test News' });
      expect(result.title).toBe('Test News');
    });

    it('should auto-generate slug', async () => {
      mockNews.findFirst.mockResolvedValue(null);
      mockNews.create.mockImplementation(async (args: Record<string, unknown>) => ({ id: '1', ...args.data as Record<string, unknown> }));

      const result = await service.create({ title: 'Test News!' });
      expect(result.slug).toBe(createBaseSlug('Test News!', 'news'));
    });

    it('should handle duplicate slugs by appending suffix', async () => {
      mockNews.findFirst
        .mockResolvedValueOnce({ id: 'exists' })
        .mockResolvedValueOnce(null);
      mockNews.create.mockImplementation(async (args: Record<string, unknown>) => ({ id: '1', ...args.data as Record<string, unknown> }));

      const baseSlug = createBaseSlug('Test News', 'news');
      const result = await service.create({ title: 'Test News' });
      expect(result.slug).toBe(`${baseSlug}-2`);
    });
  });

  describe('publish / unpublish', () => {
    it('should publish news and set publishedAt', async () => {
      mockNews.findUnique.mockResolvedValue({ id: '1' });
      mockNews.update.mockResolvedValue({ id: '1', published: true, publishedAt: new Date() });

      await service.publish('1');
      expect(mockNews.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { published: true, publishedAt: expect.any(Date) } }),
      );
    });

    it('should unpublish news', async () => {
      mockNews.update.mockResolvedValue({ id: '1', published: false });

      await service.unpublish('1');
      expect(mockNews.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { published: false } }),
      );
    });
  });

  describe('findFeatured', () => {
    it('should return featured published news', async () => {
      mockNews.findMany.mockResolvedValue([{ id: '1', title: 'Featured', featured: true }]);

      await service.findFeatured();
      expect(mockNews.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { published: true, featured: true, publishedAt: { lte: expect.any(Date) } } }),
      );
    });
  });

  describe('updateFeatured', () => {
    it('should update featured status', async () => {
      mockNews.update.mockResolvedValue({ id: '1', featured: true });

      await service.updateFeatured('1', true);
      expect(mockNews.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { featured: true } }),
      );
    });
  });

  describe('remove', () => {
    it('should delete news', async () => {
      mockNews.findUnique.mockResolvedValue({ id: '1' });
      mockNews.delete.mockResolvedValue({ id: '1', title: 'Deleted' });

      await service.remove('1');
      expect(mockNews.delete).toHaveBeenCalledWith({ where: { id: '1' }, select: { id: true, title: true } });
    });

    it('should throw if not found', async () => {
      mockNews.findUnique.mockResolvedValue(null);
      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
