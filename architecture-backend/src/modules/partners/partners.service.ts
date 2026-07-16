import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { createBaseSlug } from '../../common/utils/slug.util';
import { PrismaService } from '../../prisma/prisma.service';
import { AssignPartnerToProjectDto } from './dto/assign-partner-to-project.dto';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { PartnersQueryDto } from './dto/partners-query.dto';
import { ReorderProjectPartnersDto } from './dto/reorder-project-partners.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

const partnerSelect = {
  id: true,
  name: true,
  slug: true,
  website: true,
  logo: true,
  description: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PartnerSelect;

@Injectable()
export class PartnersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PartnersQueryDto) {
    const where = this.buildWhere(query);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.partner.findMany({
        where,
        select: partnerSelect,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: [{ [query.sortBy ?? 'name']: query.sortOrder ?? 'asc' }],
      }),
      this.prisma.partner.count({ where }),
    ]);

    return {
      data,
      pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit), hasNextPage: query.page * query.limit < total, hasPreviousPage: query.page > 1 },
    };
  }

  async findBySlug(slug: string) {
    const partner = await this.prisma.partner.findFirst({
      where: { slug },
      select: partnerSelect,
    });
    if (!partner) throw new NotFoundException('Partner not found');
    return partner;
  }

  async findAdminById(id: string) {
    const partner = await this.prisma.partner.findUnique({ where: { id }, select: partnerSelect });
    if (!partner) throw new NotFoundException('Partner not found');
    return partner;
  }

  async create(dto: CreatePartnerDto) {
    const slug = await this.createUniqueSlug(dto.slug || dto.name);

    return this.prisma.partner.create({
      data: { name: dto.name, slug, website: dto.website, logo: dto.logo, description: dto.description },
      select: partnerSelect,
    });
  }

  async update(id: string, dto: UpdatePartnerDto) {
    const existing = await this.prisma.partner.findUnique({ where: { id }, select: { id: true, name: true } });
    if (!existing) throw new NotFoundException('Partner not found');

    const slug = dto.slug || dto.name ? await this.createUniqueSlug(dto.slug || dto.name || existing.name, id) : undefined;

    return this.prisma.partner.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(slug !== undefined ? { slug } : {}),
        ...(dto.website !== undefined ? { website: dto.website } : {}),
        ...(dto.logo !== undefined ? { logo: dto.logo } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
      },
      select: partnerSelect,
    });
  }

  async remove(id: string) {
    const partner = await this.prisma.partner.findUnique({ where: { id }, select: { id: true } });
    if (!partner) throw new NotFoundException('Partner not found');

    return this.prisma.$transaction(async (tx) => {
      await tx.projectPartner.deleteMany({ where: { partnerId: id } });
      return tx.partner.delete({ where: { id }, select: { id: true, name: true } });
    });
  }

  async assignToProject(projectId: string, dto: AssignPartnerToProjectDto) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId }, select: { id: true, deletedAt: true } });
    if (!project || project.deletedAt) throw new NotFoundException('Project not found');

    const partner = await this.prisma.partner.findUnique({ where: { id: dto.partnerId }, select: { id: true } });
    if (!partner) throw new NotFoundException('Partner not found');

    const existing = await this.prisma.projectPartner.findUnique({
      where: { projectId_partnerId: { projectId, partnerId: dto.partnerId } },
    });
    if (existing) throw new ConflictException('Partner is already assigned to this project');

    return this.prisma.projectPartner.create({
      data: { projectId, partnerId: dto.partnerId, role: dto.role, sortOrder: dto.sortOrder ?? 0 },
      select: {
        partnerId: true,
        role: true,
        sortOrder: true,
        partner: { select: { id: true, name: true, slug: true, logo: true, website: true } },
      },
    });
  }

  async reorderProjectPartners(projectId: string, dto: ReorderProjectPartnersDto) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId }, select: { id: true } });
    if (!project) throw new NotFoundException('Project not found');

    const partnerIds = dto.items.map((item) => item.partnerId);
    const existingCount = await this.prisma.projectPartner.count({
      where: { projectId, partnerId: { in: partnerIds } },
    });
    if (existingCount !== new Set(partnerIds).size) {
      throw new BadRequestException('One or more partners are not assigned to this project');
    }

    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.projectPartner.update({
          where: { projectId_partnerId: { projectId, partnerId: item.partnerId } },
          data: { sortOrder: item.sortOrder },
        }),
      ),
    );

    return { success: true, message: 'Reordered successfully' };
  }

  async removeFromProject(projectId: string, partnerId: string) {
    const relation = await this.prisma.projectPartner.findUnique({
      where: { projectId_partnerId: { projectId, partnerId } },
    });
    if (!relation) throw new NotFoundException('Partner is not assigned to this project');

    await this.prisma.projectPartner.delete({
      where: { projectId_partnerId: { projectId, partnerId } },
    });

    return { success: true, message: 'Partner removed from project' };
  }

  private buildWhere(query: PartnersQueryDto) {
    const where: Prisma.PartnerWhereInput = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private async createUniqueSlug(value: string, excludeId?: string) {
    const baseSlug = createBaseSlug(value, 'partner');
    let slug = baseSlug;
    let suffix = 2;
    while (await this.prisma.partner.findFirst({ where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) }, select: { id: true } })) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
    return slug;
  }
}
