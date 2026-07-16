import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { createBaseSlug } from '../../common/utils/slug.util';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOfficeDto } from './dto/create-office.dto';
import { OfficesQueryDto } from './dto/offices-query.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';

const officeDetailSelect = {
  id: true,
  name: true,
  slug: true,
  city: true,
  country: true,
  address: true,
  phone: true,
  email: true,
  latitude: true,
  longitude: true,
  description: true,
  image: true,
  published: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.OfficeSelect;

const officePublicSelect = {
  id: true,
  name: true,
  slug: true,
  city: true,
  country: true,
  address: true,
  latitude: true,
  longitude: true,
  description: true,
  image: true,
  published: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.OfficeSelect;

@Injectable()
export class OfficesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: OfficesQueryDto) {
    const where = this.buildWhere(query);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.office.findMany({
        where,
        select: officePublicSelect,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: [{ [query.sortBy ?? 'sortOrder']: query.sortOrder ?? 'asc' }, { name: 'asc' }],
      }),
      this.prisma.office.count({ where }),
    ]);

    return {
      data,
      pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit), hasNextPage: query.page * query.limit < total, hasPreviousPage: query.page > 1 },
    };
  }

  async findBySlug(slug: string) {
    const office = await this.prisma.office.findFirst({
      where: { slug, published: true },
      select: {
        ...officePublicSelect,
        _count: { select: { people: { where: { published: true } } } },
      },
    });
    if (!office) throw new NotFoundException('Office not found');

    const people = await this.prisma.person.findMany({
      where: { officeId: office.id, published: true },
      select: {
        id: true,
        name: true,
        slug: true,
        jobTitle: true,
        image: true,
        sortOrder: true,
      },
      orderBy: { sortOrder: 'asc' },
    });

    return { ...office, people, peopleCount: office._count.people, _count: undefined };
  }

  async findAdminById(id: string) {
    const office = await this.prisma.office.findUnique({
      where: { id },
      select: {
        ...officeDetailSelect,
        _count: { select: { people: true } },
      },
    });
    if (!office) throw new NotFoundException('Office not found');

    const people = await this.prisma.person.findMany({
      where: { officeId: id },
      select: { id: true, name: true, slug: true, jobTitle: true, image: true, sortOrder: true, published: true },
      orderBy: { sortOrder: 'asc' },
    });

    return { ...office, people, peopleCount: office._count.people, _count: undefined };
  }

  async findAllAdmin(query: OfficesQueryDto) {
    const where = this.buildWhere(query, true);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.office.findMany({
        where,
        select: officeDetailSelect,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: [{ [query.sortBy ?? 'sortOrder']: query.sortOrder ?? 'asc' }, { name: 'asc' }],
      }),
      this.prisma.office.count({ where }),
    ]);

    return {
      data,
      pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit), hasNextPage: query.page * query.limit < total, hasPreviousPage: query.page > 1 },
    };
  }

  async create(dto: CreateOfficeDto) {
    const slug = await this.createUniqueSlug(dto.slug || dto.name);

    return this.prisma.office.create({
      data: {
        name: dto.name,
        slug,
        city: dto.city,
        country: dto.country,
        address: dto.address,
        phone: dto.phone,
        email: dto.email,
        latitude: dto.latitude,
        longitude: dto.longitude,
        description: dto.description,
        image: dto.image,
        published: dto.published ?? true,
        sortOrder: dto.sortOrder ?? 0,
      },
      select: officeDetailSelect,
    });
  }

  async update(id: string, dto: UpdateOfficeDto) {
    const existing = await this.prisma.office.findUnique({ where: { id }, select: { id: true, name: true } });
    if (!existing) throw new NotFoundException('Office not found');

    const slug = dto.slug || dto.name ? await this.createUniqueSlug(dto.slug || dto.name || existing.name, id) : undefined;

    return this.prisma.office.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(slug !== undefined ? { slug } : {}),
        ...(dto.city !== undefined ? { city: dto.city } : {}),
        ...(dto.country !== undefined ? { country: dto.country } : {}),
        ...(dto.address !== undefined ? { address: dto.address } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
        ...(dto.email !== undefined ? { email: dto.email } : {}),
        ...(dto.latitude !== undefined ? { latitude: dto.latitude } : {}),
        ...(dto.longitude !== undefined ? { longitude: dto.longitude } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.image !== undefined ? { image: dto.image } : {}),
        ...(dto.published !== undefined ? { published: dto.published } : {}),
        ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
      },
      select: officeDetailSelect,
    });
  }

  async remove(id: string) {
    const office = await this.prisma.office.findUnique({ where: { id }, select: { id: true, _count: { select: { people: true } } } });
    if (!office) throw new NotFoundException('Office not found');

    return this.prisma.$transaction(async (tx) => {
      await tx.person.updateMany({ where: { officeId: id }, data: { officeId: null } });
      return tx.office.delete({ where: { id }, select: { id: true, name: true } });
    });
  }

  private buildWhere(query: OfficesQueryDto, includeAll = false) {
    const where: Prisma.OfficeWhereInput = {};

    if (!includeAll) {
      where.published = true;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { city: { contains: query.search, mode: 'insensitive' } },
        { country: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private async createUniqueSlug(value: string, excludeId?: string) {
    const baseSlug = createBaseSlug(value, 'office');
    let slug = baseSlug;
    let suffix = 2;
    while (await this.prisma.office.findFirst({ where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) }, select: { id: true } })) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
    return slug;
  }
}
