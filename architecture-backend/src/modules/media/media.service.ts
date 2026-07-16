import { BadRequestException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { MediaType, Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreateProjectMediaDto } from './dto/create-project-media.dto';
import { ReorderProjectMediaDto } from './dto/reorder-project-media.dto';
import { UpdateProjectMediaDto } from './dto/update-project-media.dto';

const mediaSelect = {
  id: true,
  projectId: true,
  url: true,
  publicId: true,
  mediaType: true,
  caption: true,
  altText: true,
  width: true,
  height: true,
  sortOrder: true,
  isCover: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProjectMediaSelect;

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async uploadOne(projectId: string, file: Express.Multer.File, dto: CreateProjectMediaDto) {
    const project = await this.getActiveProject(projectId);
    const uploaded = await this.uploadService.uploadProjectImage(file, project.slug);
    try {
      return await this.createMediaRecord(projectId, uploaded.secure_url, uploaded.public_id, dto, uploaded.width, uploaded.height);
    } catch (error) {
      await this.uploadService.deleteImage(uploaded.public_id);
      throw error;
    }
  }

  async uploadBulk(projectId: string, files: Express.Multer.File[], dto: CreateProjectMediaDto) {
    if (!files.length) throw new BadRequestException('At least one image is required');
    const created = [];
    for (const [index, file] of files.entries()) {
      created.push(await this.uploadOne(projectId, file, { ...dto, isCover: index === 0 ? dto.isCover : false }));
    }
    return created;
  }

  async update(id: string, dto: UpdateProjectMediaDto) {
    await this.getMedia(id);
    return this.prisma.projectMedia.update({ where: { id }, data: dto, select: mediaSelect });
  }

  async reorder(projectId: string, dto: ReorderProjectMediaDto) {
    const mediaIds = dto.items.map((item) => item.id);
    const total = await this.prisma.projectMedia.count({ where: { projectId, id: { in: mediaIds } } });
    if (total !== new Set(mediaIds).size) throw new BadRequestException('One or more media items do not belong to this project');

    await this.prisma.$transaction(
      dto.items.map((item) => this.prisma.projectMedia.update({ where: { id: item.id }, data: { sortOrder: item.sortOrder } })),
    );

    return this.prisma.projectMedia.findMany({ where: { projectId }, select: mediaSelect, orderBy: { sortOrder: 'asc' } });
  }

  async setCover(projectId: string, mediaId: string) {
    const media = await this.prisma.projectMedia.findFirst({ where: { id: mediaId, projectId }, select: mediaSelect });
    if (!media) throw new NotFoundException('Media not found for this project');

    return this.prisma.$transaction(async (tx) => {
      await tx.projectMedia.updateMany({ where: { projectId }, data: { isCover: false } });
      const cover = await tx.projectMedia.update({ where: { id: mediaId }, data: { isCover: true }, select: mediaSelect });
      await tx.project.update({ where: { id: projectId }, data: { coverImage: cover.url } });
      return cover;
    });
  }

  async remove(id: string) {
    const media = await this.getMedia(id);
    if (media.publicId) {
      try {
        await this.uploadService.deleteImage(media.publicId);
      } catch {
        throw new ServiceUnavailableException('Could not delete image from storage');
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const deleted = await tx.projectMedia.delete({ where: { id }, select: mediaSelect });
      if (deleted.isCover) {
        const nextCover = await tx.projectMedia.findFirst({
          where: { projectId: deleted.projectId },
          orderBy: { sortOrder: 'asc' },
          select: mediaSelect,
        });
        if (nextCover) {
          await tx.projectMedia.update({ where: { id: nextCover.id }, data: { isCover: true } });
          await tx.project.update({ where: { id: deleted.projectId }, data: { coverImage: nextCover.url } });
        } else {
          await tx.project.update({ where: { id: deleted.projectId }, data: { coverImage: null } });
        }
      }
      return deleted;
    });
  }

  private async createMediaRecord(
    projectId: string,
    url: string,
    publicId: string,
    dto: CreateProjectMediaDto,
    width?: number,
    height?: number,
  ) {
    const count = await this.prisma.projectMedia.count({ where: { projectId } });
    const shouldBeCover = dto.isCover || count === 0;

    return this.prisma.$transaction(async (tx) => {
      if (shouldBeCover) await tx.projectMedia.updateMany({ where: { projectId }, data: { isCover: false } });
      const media = await tx.projectMedia.create({
        data: {
          projectId,
          url,
          publicId,
          mediaType: MediaType.IMAGE,
          caption: dto.caption,
          altText: dto.altText,
          width,
          height,
          sortOrder: count,
          isCover: shouldBeCover,
        },
        select: mediaSelect,
      });
      if (shouldBeCover) await tx.project.update({ where: { id: projectId }, data: { coverImage: url } });
      return media;
    });
  }

  private async getActiveProject(projectId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId }, select: { id: true, slug: true, deletedAt: true } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.deletedAt) throw new BadRequestException('Cannot add media to a deleted project');
    return project;
  }

  private async getMedia(id: string) {
    const media = await this.prisma.projectMedia.findUnique({ where: { id }, select: mediaSelect });
    if (!media) throw new NotFoundException('Media not found');
    return media;
  }
}
