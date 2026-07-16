import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { createBaseSlug } from '../../common/utils/slug.util';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoriesQueryDto } from './dto/categories-query.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

const categorySelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  parentId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CategorySelect;

type CategoryNode = Prisma.CategoryGetPayload<{ select: typeof categorySelect }> & { children: CategoryNode[] };

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: CategoriesQueryDto) {
    const where: Prisma.CategoryWhereInput = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { slug: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        where,
        select: categorySelect,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: [{ name: 'asc' }],
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async findTree() {
    const categories = await this.prisma.category.findMany({
      select: categorySelect,
      orderBy: [{ name: 'asc' }],
    });

    const byId = new Map<string, CategoryNode>();
    const roots: CategoryNode[] = [];

    categories.forEach((category) => byId.set(category.id, { ...category, children: [] }));
    byId.forEach((category) => {
      if (category.parentId && byId.has(category.parentId)) {
        byId.get(category.parentId)?.children.push(category);
      } else {
        roots.push(category);
      }
    });

    return roots;
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id }, select: categorySelect });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({ where: { slug }, select: categorySelect });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(dto: CreateCategoryDto) {
    await this.validateParent(dto.parentId);
    const slug = await this.createUniqueSlug(dto.slug || dto.name);

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        parentId: dto.parentId,
      },
      select: categorySelect,
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const existing = await this.findOne(id);
    await this.validateParent(dto.parentId, id);

    const slug = dto.slug || dto.name ? await this.createUniqueSlug(dto.slug || dto.name || existing.name, id) : undefined;

    return this.prisma.category.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(slug !== undefined ? { slug } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.parentId !== undefined ? { parentId: dto.parentId } : {}),
      },
      select: categorySelect,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    const projectsCount = await this.prisma.projectCategory.count({ where: { categoryId: id } });
    if (projectsCount > 0) {
      throw new BadRequestException('Cannot delete a category linked to projects');
    }

    return this.prisma.category.delete({ where: { id }, select: categorySelect });
  }

  private async validateParent(parentId?: string, currentId?: string) {
    if (!parentId) return;
    if (parentId === currentId) throw new BadRequestException('Category cannot be its own parent');

    let parent = await this.prisma.category.findUnique({ where: { id: parentId }, select: { id: true, parentId: true } });
    if (!parent) throw new BadRequestException('Parent category does not exist');

    while (parent?.parentId) {
      if (parent.parentId === currentId) throw new BadRequestException('Circular category relationship is not allowed');
      parent = await this.prisma.category.findUnique({ where: { id: parent.parentId }, select: { id: true, parentId: true } });
    }
  }

  private async createUniqueSlug(value: string, excludeId?: string) {
    const baseSlug = createBaseSlug(value, 'category');
    let slug = baseSlug;
    let suffix = 2;

    while (
      await this.prisma.category.findFirst({
        where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
        select: { id: true },
      })
    ) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    return slug;
  }
}
