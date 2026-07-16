import { Injectable, NotFoundException } from '@nestjs/common';
import { ContactStatus, Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ContactQueryDto } from './dto/contact-query.dto';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';

const publicContactSelect = {
  id: true,
  name: true,
  email: true,
  subject: true,
  status: true,
  createdAt: true,
} satisfies Prisma.ContactMessageSelect;

const adminContactSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  subject: true,
  message: true,
  status: true,
  ipAddress: true,
  userAgent: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ContactMessageSelect;

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContactMessageDto, meta: { ipAddress?: string; userAgent?: string }) {
    return this.prisma.contactMessage.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        subject: dto.subject,
        message: dto.message,
        status: ContactStatus.NEW,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      },
      select: publicContactSelect,
    });
  }

  async findAll(query: ContactQueryDto) {
    const where = this.buildWhere(query);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.contactMessage.findMany({
        where,
        select: adminContactSelect,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { createdAt: query.sortOrder ?? 'desc' },
      }),
      this.prisma.contactMessage.count({ where }),
    ]);

    return {
      data,
      pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
    };
  }

  async findOne(id: string) {
    const message = await this.prisma.contactMessage.findUnique({ where: { id }, select: adminContactSelect });
    if (!message) throw new NotFoundException('Contact message not found');
    return message;
  }

  async updateStatus(id: string, dto: UpdateContactStatusDto) {
    await this.findOne(id);
    return this.prisma.contactMessage.update({ where: { id }, data: { status: dto.status }, select: adminContactSelect });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.contactMessage.delete({ where: { id }, select: adminContactSelect });
  }

  private buildWhere(query: ContactQueryDto): Prisma.ContactMessageWhereInput {
    return {
      ...(query.status ? { status: query.status } : {}),
      ...(query.email ? { email: { equals: query.email, mode: 'insensitive' } } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { email: { contains: query.search, mode: 'insensitive' } },
              { subject: { contains: query.search, mode: 'insensitive' } },
              { message: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(query.dateFrom || query.dateTo
        ? {
            createdAt: {
              ...(query.dateFrom ? { gte: new Date(query.dateFrom) } : {}),
              ...(query.dateTo ? { lte: new Date(query.dateTo) } : {}),
            },
          }
        : {}),
    };
  }
}
