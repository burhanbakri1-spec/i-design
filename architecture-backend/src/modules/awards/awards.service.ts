import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAwardDto } from './dto/create-award.dto';
import { UpdateAwardDto } from './dto/update-award.dto';

const awardSelect = {
  id: true,
  title: true,
  organization: true,
  year: true,
  description: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class AwardsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByProjectSlug(projectSlug: string) {
    const project = await this.prisma.project.findFirst({
      where: { slug: projectSlug, published: true, deletedAt: null },
      select: { id: true },
    });
    if (!project) throw new NotFoundException('Project not found');

    return this.prisma.award.findMany({
      where: { projectId: project.id },
      select: awardSelect,
      orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findAdminByProjectId(projectId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId }, select: { id: true } });
    if (!project) throw new NotFoundException('Project not found');

    return this.prisma.award.findMany({
      where: { projectId },
      select: { ...awardSelect, projectId: true },
      orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string) {
    const award = await this.prisma.award.findUnique({ where: { id }, select: { ...awardSelect, projectId: true } });
    if (!award) throw new NotFoundException('Award not found');
    return award;
  }

  async create(projectId: string, dto: CreateAwardDto) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId }, select: { id: true, deletedAt: true } });
    if (!project || project.deletedAt) throw new NotFoundException('Project not found');

    return this.prisma.award.create({
      data: {
        title: dto.title,
        organization: dto.organization,
        year: dto.year,
        description: dto.description,
        projectId,
      },
      select: { ...awardSelect, projectId: true },
    });
  }

  async update(id: string, dto: UpdateAwardDto) {
    const existing = await this.prisma.award.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new NotFoundException('Award not found');

    return this.prisma.award.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.organization !== undefined ? { organization: dto.organization } : {}),
        ...(dto.year !== undefined ? { year: dto.year } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
      },
      select: { ...awardSelect, projectId: true },
    });
  }

  async remove(id: string) {
    const award = await this.prisma.award.findUnique({ where: { id }, select: { id: true } });
    if (!award) throw new NotFoundException('Award not found');
    return this.prisma.award.delete({ where: { id }, select: { id: true, title: true } });
  }
}
