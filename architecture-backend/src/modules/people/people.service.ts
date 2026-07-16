import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { createBaseSlug } from '../../common/utils/slug.util';
import { PrismaService } from '../../prisma/prisma.service';
import { AssignPersonToProjectDto } from './dto/assign-person-to-project.dto';
import { CreatePersonDto } from './dto/create-person.dto';
import { PeopleQueryDto } from './dto/people-query.dto';
import { ReorderProjectPeopleDto } from './dto/reorder-project-people.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

const personPublicSelect = {
  id: true,
  name: true,
  slug: true,
  jobTitle: true,
  biography: true,
  image: true,
  sortOrder: true,
  office: { select: { id: true, name: true, slug: true, city: true } },
} satisfies Prisma.PersonSelect;

const personDetailSelect = {
  id: true,
  name: true,
  slug: true,
  jobTitle: true,
  biography: true,
  email: true,
  phone: true,
  image: true,
  officeId: true,
  published: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PersonSelect;

@Injectable()
export class PeopleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PeopleQueryDto) {
    const where = this.buildWhere(query);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.person.findMany({
        where,
        select: personPublicSelect,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: [{ [query.sortBy ?? 'sortOrder']: query.sortOrder ?? 'asc' }, { name: 'asc' }],
      }),
      this.prisma.person.count({ where }),
    ]);

    return {
      data,
      pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit), hasNextPage: query.page * query.limit < total, hasPreviousPage: query.page > 1 },
    };
  }

  async findBySlug(slug: string) {
    const person = await this.prisma.person.findFirst({
      where: { slug, published: true },
      select: {
        ...personPublicSelect,
        projects: {
          where: { project: { published: true, deletedAt: null } },
          select: {
            role: true,
            sortOrder: true,
            project: { select: { id: true, title: true, slug: true, coverImage: true, year: true, city: true } },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
    if (!person) throw new NotFoundException('Person not found');
    return person;
  }

  async findAdminById(id: string) {
    const person = await this.prisma.person.findUnique({
      where: { id },
      select: {
        ...personDetailSelect,
        office: { select: { id: true, name: true, slug: true } },
        projects: {
          select: {
            role: true,
            sortOrder: true,
            project: { select: { id: true, title: true, slug: true } },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
    if (!person) throw new NotFoundException('Person not found');
    return person;
  }

  async findAllAdmin(query: PeopleQueryDto) {
    const where = this.buildWhere(query, true);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.person.findMany({
        where,
        select: personDetailSelect,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: [{ [query.sortBy ?? 'sortOrder']: query.sortOrder ?? 'asc' }, { name: 'asc' }],
      }),
      this.prisma.person.count({ where }),
    ]);

    return {
      data,
      pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit), hasNextPage: query.page * query.limit < total, hasPreviousPage: query.page > 1 },
    };
  }

  async create(dto: CreatePersonDto) {
    if (dto.officeId) {
      const office = await this.prisma.office.findUnique({ where: { id: dto.officeId }, select: { id: true } });
      if (!office) throw new BadRequestException('Office not found');
    }

    const slug = await this.createUniqueSlug(dto.slug || dto.name);

    return this.prisma.person.create({
      data: {
        name: dto.name,
        slug,
        jobTitle: dto.jobTitle,
        biography: dto.biography,
        email: dto.email,
        phone: dto.phone,
        image: dto.image,
        officeId: dto.officeId,
        published: dto.published ?? false,
        sortOrder: dto.sortOrder ?? 0,
      },
      select: personDetailSelect,
    });
  }

  async update(id: string, dto: UpdatePersonDto) {
    const existing = await this.prisma.person.findUnique({ where: { id }, select: { id: true, name: true } });
    if (!existing) throw new NotFoundException('Person not found');

    if (dto.officeId) {
      const office = await this.prisma.office.findUnique({ where: { id: dto.officeId }, select: { id: true } });
      if (!office) throw new BadRequestException('Office not found');
    }

    const slug = dto.slug || dto.name ? await this.createUniqueSlug(dto.slug || dto.name || existing.name, id) : undefined;

    return this.prisma.person.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(slug !== undefined ? { slug } : {}),
        ...(dto.jobTitle !== undefined ? { jobTitle: dto.jobTitle } : {}),
        ...(dto.biography !== undefined ? { biography: dto.biography } : {}),
        ...(dto.email !== undefined ? { email: dto.email } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
        ...(dto.image !== undefined ? { image: dto.image } : {}),
        ...(dto.officeId !== undefined ? { officeId: dto.officeId } : {}),
        ...(dto.published !== undefined ? { published: dto.published } : {}),
        ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
      },
      select: personDetailSelect,
    });
  }

  async remove(id: string) {
    const person = await this.prisma.person.findUnique({ where: { id }, select: { id: true } });
    if (!person) throw new NotFoundException('Person not found');
    return this.prisma.person.delete({ where: { id }, select: { id: true, name: true } });
  }

  async assignToProject(projectId: string, dto: AssignPersonToProjectDto) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId }, select: { id: true, deletedAt: true } });
    if (!project || project.deletedAt) throw new NotFoundException('Project not found');

    const person = await this.prisma.person.findUnique({ where: { id: dto.personId }, select: { id: true } });
    if (!person) throw new NotFoundException('Person not found');

    const existing = await this.prisma.projectPerson.findUnique({
      where: { projectId_personId: { projectId, personId: dto.personId } },
    });
    if (existing) throw new ConflictException('Person is already assigned to this project');

    return this.prisma.projectPerson.create({
      data: {
        projectId,
        personId: dto.personId,
        role: dto.role,
        sortOrder: dto.sortOrder ?? 0,
      },
      select: {
        personId: true,
        role: true,
        sortOrder: true,
        person: { select: { id: true, name: true, slug: true, jobTitle: true, image: true } },
      },
    });
  }

  async reorderProjectPeople(projectId: string, dto: ReorderProjectPeopleDto) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId }, select: { id: true } });
    if (!project) throw new NotFoundException('Project not found');

    const personIds = dto.items.map((item) => item.personId);
    const existingCount = await this.prisma.projectPerson.count({
      where: { projectId, personId: { in: personIds } },
    });
    if (existingCount !== new Set(personIds).size) {
      throw new BadRequestException('One or more persons are not assigned to this project');
    }

    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.projectPerson.update({
          where: { projectId_personId: { projectId, personId: item.personId } },
          data: { sortOrder: item.sortOrder },
        }),
      ),
    );

    return { success: true, message: 'Reordered successfully' };
  }

  async removeFromProject(projectId: string, personId: string) {
    const relation = await this.prisma.projectPerson.findUnique({
      where: { projectId_personId: { projectId, personId } },
    });
    if (!relation) throw new NotFoundException('Person is not assigned to this project');

    await this.prisma.projectPerson.delete({
      where: { projectId_personId: { projectId, personId } },
    });

    return { success: true, message: 'Person removed from project' };
  }

  private buildWhere(query: PeopleQueryDto, includeAll = false) {
    const where: Prisma.PersonWhereInput = {};

    if (!includeAll) {
      where.published = true;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { jobTitle: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.office) {
      where.office = { slug: query.office };
    }

    if (query.jobTitle) {
      where.jobTitle = { contains: query.jobTitle, mode: 'insensitive' };
    }

    return where;
  }

  private async createUniqueSlug(value: string, excludeId?: string) {
    const baseSlug = createBaseSlug(value, 'person');
    let slug = baseSlug;
    let suffix = 2;
    while (await this.prisma.person.findFirst({ where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) }, select: { id: true } })) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
    return slug;
  }
}
