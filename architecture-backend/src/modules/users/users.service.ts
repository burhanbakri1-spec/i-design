import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Prisma, UserRole } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UsersQueryDto } from './dto/users-query.dto';

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  tokenVersion: true,
  lastLoginAt: true,
  passwordChangedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async findByEmailForAuthentication(email: string) {
    return this.prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        isActive: true,
        refreshTokenHash: true,
        tokenVersion: true,
      },
    });
  }

  async findSafeById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: safeUserSelect,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(dto: CreateUserDto) {
    const email = dto.email.trim().toLowerCase();
    const existingUser = await this.prisma.user.findUnique({ where: { email }, select: { id: true } });

    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const password = await this.hashPassword(dto.password);

    return this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        email,
        password,
        role: dto.role,
        isActive: dto.isActive ?? true,
      },
      select: safeUserSelect,
    });
  }

  async findAll(query: UsersQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const where: Prisma.UserWhereInput = {};

    if (query.role) {
      where.role = query.role;
    }
    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder ?? 'desc';
    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        select: safeUserSelect,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, dto: UpdateUserDto, currentUserId: string) {
    const existingUser = await this.getExistingUser(id);

    if (dto.email) {
      const email = dto.email.trim().toLowerCase();
      const userWithEmail = await this.prisma.user.findUnique({ where: { email }, select: { id: true } });
      if (userWithEmail && userWithEmail.id !== id) {
        throw new ConflictException('Email is already in use');
      }
    }

    if (existingUser.id === currentUserId && existingUser.role === UserRole.ADMIN && dto.role === UserRole.EDITOR) {
      await this.ensureAnotherActiveAdmin(existingUser.id);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.email !== undefined ? { email: dto.email.trim().toLowerCase() } : {}),
        ...(dto.role !== undefined ? { role: dto.role } : {}),
      },
      select: safeUserSelect,
    });
  }

  async updateStatus(id: string, dto: UpdateUserStatusDto, currentUserId: string) {
    const existingUser = await this.getExistingUser(id);

    if (!dto.isActive) {
      if (id === currentUserId) {
        throw new ForbiddenException('You cannot disable your own account');
      }
      if (existingUser.role === UserRole.ADMIN) {
        await this.ensureAnotherActiveAdmin(id);
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        isActive: dto.isActive,
        ...(!dto.isActive ? { refreshTokenHash: null, tokenVersion: { increment: 1 } } : {}),
      },
      select: safeUserSelect,
    });
  }

  async softDelete(id: string, currentUserId: string) {
    return this.updateStatus(id, { isActive: false }, currentUserId);
  }

  async setRefreshTokenHash(userId: string, refreshTokenHash: string | null) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
      select: { id: true },
    });
  }

  async updateLoginMetadata(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
      select: { id: true },
    });
  }

  async invalidateSessionsAfterPasswordChange(userId: string, password: string) {
    const hashedPassword = await this.hashPassword(password);
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        refreshTokenHash: null,
        passwordChangedAt: new Date(),
        tokenVersion: { increment: 1 },
      },
      select: safeUserSelect,
    });
  }

  private async getExistingUser(id: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true, isActive: true },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    return existingUser;
  }

  private async ensureAnotherActiveAdmin(excludedUserId: string) {
    const activeAdmins = await this.prisma.user.count({
      where: {
        role: UserRole.ADMIN,
        isActive: true,
        NOT: { id: excludedUserId },
      },
    });

    if (activeAdmins < 1) {
      throw new BadRequestException('At least one active admin must remain');
    }
  }

  private async hashPassword(password: string) {
    const saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS') || 12;
    return bcrypt.hash(password, saltRounds);
  }
}
