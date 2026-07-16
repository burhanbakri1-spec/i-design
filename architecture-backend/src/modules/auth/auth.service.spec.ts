import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../../generated/prisma/client';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const usersService = {
    findByEmailForAuthentication: jest.fn(),
    updateLoginMetadata: jest.fn(),
    setRefreshTokenHash: jest.fn(),
  };
  const jwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };
  const configService = {
    get: jest.fn((key: string) => {
      const values: Record<string, string | number> = {
        BCRYPT_SALT_ROUNDS: 10,
        JWT_ACCESS_SECRET: 'access-secret-for-tests-very-long',
        JWT_REFRESH_SECRET: 'refresh-secret-for-tests-very-long',
        JWT_ACCESS_EXPIRES_IN: '15m',
        JWT_REFRESH_EXPIRES_IN: '7d',
        JWT_ISSUER: 'architecture-backend',
        JWT_AUDIENCE: 'architecture-admin',
      };
      return values[key];
    }),
  };

  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    })
      .compile();

    service = moduleRef.get(AuthService);
  });

  it('rejects an unknown email with a generic message', async () => {
    usersService.findByEmailForAuthentication.mockResolvedValue(null);

    await expect(service.login({ email: 'missing@example.com', password: 'Password123!' })).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('returns tokens and no password on valid login', async () => {
    const password = await bcrypt.hash('Password123!', 10);
    usersService.findByEmailForAuthentication.mockResolvedValue({
      id: 'cltestuser0001',
      name: 'Admin',
      email: 'admin@example.com',
      password,
      role: UserRole.ADMIN,
      isActive: true,
      refreshTokenHash: null,
      tokenVersion: 0,
    });
    jwtService.signAsync.mockResolvedValueOnce('access-token').mockResolvedValueOnce('refresh-token');

    const result = await service.login({ email: 'admin@example.com', password: 'Password123!' });

    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
    expect(result.user).not.toHaveProperty('password');
  });
});
