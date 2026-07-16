import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { createBaseSlug } from '../../common/utils/slug.util';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsQueryDto } from './dto/projects-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

const projectListSelect = {
  id: true,
  title: true,
  slug: true,
  shortDescription: true,
  city: true,
  country: true,
  year: true,
  status: true,
  coverImage: true,
  featured: true,
  publishedAt: true,
  categories: {
    select: { category: { select: { id: true, name: true, slug: true } } },
    orderBy: { sortOrder: 'asc' },
  },
} satisfies Prisma.ProjectSelect;

const projectDetailSelect = {
  id: true,
  title: true,
  slug: true,
  shortDescription: true,
  description: true,
  city: true,
  country: true,
  year: true,
  client: true,
  status: true,
  sizeM2: true,
  sizeFt2: true,
  latitude: true,
  longitude: true,
  coverImage: true,
  featured: true,
  published: true,
  publishedAt: true,
  seoTitle: true,
  seoDescription: true,
  createdAt: true,
  updatedAt: true,
  categories: { select: { category: { select: { id: true, name: true, slug: true } } }, orderBy: { sortOrder: 'asc' } },
  media: {
    select: { id: true, url: true, mediaType: true, caption: true, altText: true, width: true, height: true, sortOrder: true, isCover: true },
    orderBy: { sortOrder: 'asc' },
  },
  people: {
    select: { personId: true, role: true, sortOrder: true, person: { select: { id: true, name: true, slug: true, jobTitle: true, image: true } } },
    orderBy: { sortOrder: 'asc' },
  },
  awards: {
    select: { id: true, title: true, organization: true, year: true, description: true },
    orderBy: { year: 'desc' },
  },
  partners: {
    select: { partnerId: true, role: true, sortOrder: true, partner: { select: { id: true, name: true, slug: true, logo: true, website: true } } },
    orderBy: { sortOrder: 'asc' },
  },
} satisfies Prisma.ProjectSelect;

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ProjectsQueryDto, includeUnpublished = false) {
    const where = this.buildWhere(query, includeUnpublished);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        select: projectListSelect,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.sortBy ?? 'createdAt']: query.sortOrder ?? 'desc' },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data: data.map(this.flattenProjectCategories),
      pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
    };
  }

  async featured() {
    const projects = await this.prisma.project.findMany({
      where: { featured: true, published: true, deletedAt: null },
      select: projectListSelect,
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 12,
    });
    return projects.map(this.flattenProjectCategories);
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findFirst({
      where: { slug, published: true, deletedAt: null },
      select: projectDetailSelect,
    });
    if (!project) throw new NotFoundException('Project not found');

    const categoryIds = project.categories.map((item) => item.category.id);
    const relatedProjects = await this.prisma.project.findMany({
      where: {
        id: { not: project.id },
        published: true,
        deletedAt: null,
        categories: { some: { categoryId: { in: categoryIds } } },
      },
      select: projectListSelect,
      take: 4,
      orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
    });

    return {
      ...this.flattenProjectCategories(project),
      gallery: project.media,
      media: undefined,
      people: project.people.map((p) => ({ ...p.person, role: p.role, sortOrder: p.sortOrder })),
      awards: project.awards,
      partners: project.partners.map((p) => ({ ...p.partner, role: p.role, sortOrder: p.sortOrder })),
      relatedProjects: relatedProjects.map(this.flattenProjectCategories),
    };
  }

  async findAdminById(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id }, select: projectDetailSelect });
    if (!project) throw new NotFoundException('Project not found');
    return {
      ...this.flattenProjectCategories(project),
      gallery: project.media,
      media: undefined,
      people: project.people.map((p) => ({ ...p.person, role: p.role, sortOrder: p.sortOrder })),
      awards: project.awards,
      partners: project.partners.map((p) => ({ ...p.partner, role: p.role, sortOrder: p.sortOrder })),
    };
  }

  async create(dto: CreateProjectDto) {
    await this.ensureCategoriesExist(dto.categoryIds);
    const slug = await this.createUniqueSlug(dto.slug || dto.title);

    return this.prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          title: dto.title,
          slug,
          shortDescription: dto.shortDescription,
          description: dto.description,
          city: dto.city,
          country: dto.country,
          year: dto.year,
          client: dto.client,
          status: dto.status,
          sizeM2: dto.sizeM2,
          sizeFt2: dto.sizeFt2,
          latitude: dto.latitude,
          longitude: dto.longitude,
          seoTitle: dto.seoTitle,
          seoDescription: dto.seoDescription,
          featured: dto.featured ?? false,
          categories: dto.categoryIds
            ? { create: dto.categoryIds.map((categoryId, index) => ({ categoryId, sortOrder: index })) }
            : undefined,
        },
        select: projectDetailSelect,
      });
      return { ...this.flattenProjectCategories(project), gallery: project.media, media: undefined, people: project.people?.map((p) => ({ ...p.person, role: p.role, sortOrder: p.sortOrder })), awards: project.awards, partners: project.partners?.map((p) => ({ ...p.partner, role: p.role, sortOrder: p.sortOrder })) };
    });
  }

  async update(id: string, dto: UpdateProjectDto) {
    const existing = await this.prisma.project.findUnique({ where: { id }, select: { id: true, title: true, deletedAt: true } });
    if (!existing) throw new NotFoundException('Project not found');
    if (existing.deletedAt) throw new BadRequestException('Restore the project before updating it');
    await this.ensureCategoriesExist(dto.categoryIds);
    const slug = dto.slug || dto.title ? await this.createUniqueSlug(dto.slug || dto.title || existing.title, id) : undefined;

    return this.prisma.$transaction(async (tx) => {
      if (dto.categoryIds) {
        await tx.projectCategory.deleteMany({ where: { projectId: id } });
        await tx.projectCategory.createMany({
          data: dto.categoryIds.map((categoryId, index) => ({ projectId: id, categoryId, sortOrder: index })),
        });
      }

      const project = await tx.project.update({
        where: { id },
        data: {
          ...this.toProjectData(dto),
          ...(slug ? { slug } : {}),
        },
        select: projectDetailSelect,
      });
      return { ...this.flattenProjectCategories(project), gallery: project.media, media: undefined, people: project.people?.map((p) => ({ ...p.person, role: p.role, sortOrder: p.sortOrder })), awards: project.awards, partners: project.partners?.map((p) => ({ ...p.partner, role: p.role, sortOrder: p.sortOrder })) };
    });
  }

  async publish(id: string, publishedAt?: string) {
    const project = await this.prisma.project.findUnique({ where: { id }, select: { deletedAt: true } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.deletedAt) throw new BadRequestException('Cannot publish a deleted project');
    return this.prisma.project.update({
      where: { id },
      data: { published: true, publishedAt: publishedAt ? new Date(publishedAt) : new Date() },
      select: projectDetailSelect,
    });
  }

  async unpublish(id: string) {
    return this.prisma.project.update({ where: { id }, data: { published: false, publishedAt: null }, select: projectDetailSelect });
  }

  async updateFeatured(id: string, featured: boolean) {
    return this.prisma.project.update({ where: { id }, data: { featured }, select: projectDetailSelect });
  }

  async softDelete(id: string) {
    return this.prisma.project.update({
      where: { id },
      data: { deletedAt: new Date(), published: false, publishedAt: null },
      select: projectDetailSelect,
    });
  }

  async restore(id: string) {
    return this.prisma.project.update({ where: { id }, data: { deletedAt: null }, select: projectDetailSelect });
  }

  private buildWhere(query: ProjectsQueryDto, includeUnpublished: boolean): Prisma.ProjectWhereInput {
    return {
      deletedAt: null,
      ...(includeUnpublished ? {} : { published: true }),
      ...(query.search
        ? {
            OR: [
              { title: { contains: query.search, mode: 'insensitive' } },
              { shortDescription: { contains: query.search, mode: 'insensitive' } },
              { city: { contains: query.search, mode: 'insensitive' } },
              { country: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(query.category ? { categories: { some: { category: { slug: query.category } } } } : {}),
      ...(query.country ? { country: { equals: query.country, mode: 'insensitive' } } : {}),
      ...(query.city ? { city: { equals: query.city, mode: 'insensitive' } } : {}),
      ...(query.year ? { year: query.year } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.featured !== undefined ? { featured: query.featured } : {}),
    };
  }

  private async ensureCategoriesExist(categoryIds?: string[]) {
    if (!categoryIds?.length) return;
    const total = await this.prisma.category.count({ where: { id: { in: categoryIds } } });
    if (total !== new Set(categoryIds).size) throw new BadRequestException('One or more categories do not exist');
  }

  private async createUniqueSlug(value: string, excludeId?: string) {
    const baseSlug = createBaseSlug(value, 'project');
    let slug = baseSlug;
    let suffix = 2;
    while (await this.prisma.project.findFirst({ where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) }, select: { id: true } })) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
    return slug;
  }

  private toProjectData(dto: UpdateProjectDto): Prisma.ProjectUpdateInput {
    return {
      ...(dto.title !== undefined ? { title: dto.title } : {}),
      ...(dto.shortDescription !== undefined ? { shortDescription: dto.shortDescription } : {}),
      ...(dto.description !== undefined ? { description: dto.description } : {}),
      ...(dto.city !== undefined ? { city: dto.city } : {}),
      ...(dto.country !== undefined ? { country: dto.country } : {}),
      ...(dto.year !== undefined ? { year: dto.year } : {}),
      ...(dto.client !== undefined ? { client: dto.client } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.sizeM2 !== undefined ? { sizeM2: dto.sizeM2 } : {}),
      ...(dto.sizeFt2 !== undefined ? { sizeFt2: dto.sizeFt2 } : {}),
      ...(dto.latitude !== undefined ? { latitude: dto.latitude } : {}),
      ...(dto.longitude !== undefined ? { longitude: dto.longitude } : {}),
      ...(dto.seoTitle !== undefined ? { seoTitle: dto.seoTitle } : {}),
      ...(dto.seoDescription !== undefined ? { seoDescription: dto.seoDescription } : {}),
      ...(dto.featured !== undefined ? { featured: dto.featured } : {}),
    };
  }

  private flattenProjectCategories<T extends { categories: { category: unknown }[] }>(project: T) {
    return { ...project, categories: project.categories.map((item) => item.category) };
  }
}
