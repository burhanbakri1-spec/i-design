import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { createBaseSlug } from '../../common/utils/slug.util';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { NewsQueryDto } from './dto/news-query.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

const newsListSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImage: true,
  published: true,
  featured: true,
  publishedAt: true,
  createdAt: true,
} satisfies Prisma.NewsSelect;

const newsDetailSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  coverImage: true,
  externalUrl: true,
  published: true,
  featured: true,
  publishedAt: true,
  seoTitle: true,
  seoDescription: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.NewsSelect;

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: NewsQueryDto) {
    const where = this.buildWhere(query);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.news.findMany({
        where,
        select: newsListSelect,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: [{ [query.sortBy ?? 'publishedAt']: query.sortOrder ?? 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.news.count({ where }),
    ]);

    return {
      data,
      pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit), hasNextPage: query.page * query.limit < total, hasPreviousPage: query.page > 1 },
    };
  }

  async findFeatured() {
    return this.prisma.news.findMany({
      where: { published: true, featured: true, publishedAt: { lte: new Date() } },
      select: newsListSelect,
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 12,
    });
  }

  async findBySlug(slug: string) {
    const news = await this.prisma.news.findFirst({
      where: { slug, published: true, publishedAt: { lte: new Date() } },
      select: newsDetailSelect,
    });
    if (!news) throw new NotFoundException('News not found');
    return news;
  }

  async findAdminById(id: string) {
    const news = await this.prisma.news.findUnique({ where: { id }, select: newsDetailSelect });
    if (!news) throw new NotFoundException('News not found');
    return news;
  }

  async findAllAdmin(query: NewsQueryDto) {
    const where = this.buildWhere(query, true);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.news.findMany({
        where,
        select: newsDetailSelect,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: [{ [query.sortBy ?? 'createdAt']: query.sortOrder ?? 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.news.count({ where }),
    ]);

    return {
      data,
      pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit), hasNextPage: query.page * query.limit < total, hasPreviousPage: query.page > 1 },
    };
  }

  async create(dto: CreateNewsDto) {
    const slug = await this.createUniqueSlug(dto.slug || dto.title);
    const publishedAt = dto.published && !dto.publishedAt ? new Date().toISOString() : dto.publishedAt;

    return this.prisma.news.create({
      data: {
        title: dto.title,
        slug,
        excerpt: dto.excerpt,
        content: dto.content,
        coverImage: dto.coverImage,
        externalUrl: dto.externalUrl,
        published: dto.published ?? false,
        featured: dto.featured ?? false,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
      },
      select: newsDetailSelect,
    });
  }

  async update(id: string, dto: UpdateNewsDto) {
    const existing = await this.prisma.news.findUnique({ where: { id }, select: { id: true, title: true } });
    if (!existing) throw new NotFoundException('News not found');

    const slug = dto.slug || dto.title ? await this.createUniqueSlug(dto.slug || dto.title || existing.title, id) : undefined;
    const publishedAt = dto.published && !dto.publishedAt ? new Date().toISOString() : dto.publishedAt;

    return this.prisma.news.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(slug !== undefined ? { slug } : {}),
        ...(dto.excerpt !== undefined ? { excerpt: dto.excerpt } : {}),
        ...(dto.content !== undefined ? { content: dto.content } : {}),
        ...(dto.coverImage !== undefined ? { coverImage: dto.coverImage } : {}),
        ...(dto.externalUrl !== undefined ? { externalUrl: dto.externalUrl } : {}),
        ...(dto.published !== undefined ? { published: dto.published } : {}),
        ...(dto.featured !== undefined ? { featured: dto.featured } : {}),
        ...(publishedAt !== undefined ? { publishedAt: publishedAt ? new Date(publishedAt) : null } : {}),
        ...(dto.seoTitle !== undefined ? { seoTitle: dto.seoTitle } : {}),
        ...(dto.seoDescription !== undefined ? { seoDescription: dto.seoDescription } : {}),
      },
      select: newsDetailSelect,
    });
  }

  async publish(id: string) {
    const news = await this.prisma.news.findUnique({ where: { id }, select: { id: true } });
    if (!news) throw new NotFoundException('News not found');
    return this.prisma.news.update({
      where: { id },
      data: { published: true, publishedAt: new Date() },
      select: newsDetailSelect,
    });
  }

  async unpublish(id: string) {
    return this.prisma.news.update({
      where: { id },
      data: { published: false },
      select: newsDetailSelect,
    });
  }

  async updateFeatured(id: string, featured: boolean) {
    return this.prisma.news.update({
      where: { id },
      data: { featured },
      select: newsDetailSelect,
    });
  }

  async remove(id: string) {
    const news = await this.prisma.news.findUnique({ where: { id }, select: { id: true } });
    if (!news) throw new NotFoundException('News not found');
    return this.prisma.news.delete({ where: { id }, select: { id: true, title: true } });
  }

  private buildWhere(query: NewsQueryDto, includeAll = false) {
    const where: Prisma.NewsWhereInput = {};

    if (!includeAll) {
      where.published = true;
      where.publishedAt = { lte: new Date() };
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { excerpt: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.year) {
      where.publishedAt = {
        ...(where.publishedAt as Prisma.DateTimeNullableFilter || {}),
        gte: new Date(query.year, 0, 1),
        lt: new Date(query.year + 1, 0, 1),
      };
    }

    if (query.featured !== undefined) {
      where.featured = query.featured;
    }

    return where;
  }

  private async createUniqueSlug(value: string, excludeId?: string) {
    const baseSlug = createBaseSlug(value, 'news');
    let slug = baseSlug;
    let suffix = 2;
    while (await this.prisma.news.findFirst({ where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) }, select: { id: true } })) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
    return slug;
  }
}
