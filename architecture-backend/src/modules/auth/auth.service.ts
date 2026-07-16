import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomUUID } from 'crypto';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailForAuthentication(dto.email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await this.comparePassword(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.usersService.updateLoginMetadata(user.id);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      tokenVersion: user.tokenVersion,
    };

    const tokens = await this.generateTokens(safeUser);
    await this.usersService.setRefreshTokenHash(user.id, await this.hashRefreshToken(tokens.refreshToken));

    return {
      user: safeUser,
      ...tokens,
    };
  }

  async refresh(dto: RefreshTokenDto) {
    const payload = await this.verifyRefreshToken(dto.refreshToken);
    const user = await this.usersService.findByEmailForAuthentication(payload.email);

    if (!user || !user.isActive || user.id !== payload.sub || user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!user.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const refreshTokenMatches = await this.compareRefreshToken(dto.refreshToken, user.refreshTokenHash);
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      tokenVersion: user.tokenVersion,
    };
    const tokens = await this.generateTokens(safeUser);
    await this.usersService.setRefreshTokenHash(user.id, await this.hashRefreshToken(tokens.refreshToken));

    return {
      user: safeUser,
      ...tokens,
    };
  }

  async logout(user: AuthenticatedUser) {
    await this.usersService.setRefreshTokenHash(user.id, null);
    return { loggedOut: true };
  }

  async getProfile(user: AuthenticatedUser) {
    return this.usersService.findSafeById(user.id);
  }

  async changePassword(user: AuthenticatedUser, dto: ChangePasswordDto) {
    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new BadRequestException('New password confirmation does not match');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    const authUser = await this.usersService.findByEmailForAuthentication(user.email);
    if (!authUser || !authUser.isActive) {
      throw new UnauthorizedException('Invalid session');
    }

    const currentPasswordMatches = await this.comparePassword(dto.currentPassword, authUser.password);
    if (!currentPasswordMatches) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    return this.usersService.invalidateSessionsAfterPasswordChange(user.id, dto.newPassword);
  }

  async hashPassword(password: string) {
    const saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS') || 12;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  async hashRefreshToken(refreshToken: string) {
    const saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS') || 12;
    return bcrypt.hash(this.digestRefreshToken(refreshToken), saltRounds);
  }

  async compareRefreshToken(refreshToken: string, hash: string) {
    return bcrypt.compare(this.digestRefreshToken(refreshToken), hash);
  }

  private digestRefreshToken(refreshToken: string) {
    return createHash('sha256').update(refreshToken).digest('hex');
  }

  private async generateTokens(user: AuthenticatedUser) {
    const basePayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    const issuer = this.configService.get<string>('JWT_ISSUER');
    const audience = this.configService.get<string>('JWT_AUDIENCE');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...basePayload, type: 'access' satisfies JwtPayload['type'], jti: randomUUID() },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<JwtSignOptions['expiresIn']>('JWT_ACCESS_EXPIRES_IN') ?? '15m',
          issuer,
          audience,
        } as JwtSignOptions,
      ),
      this.jwtService.signAsync(
        { ...basePayload, type: 'refresh' satisfies JwtPayload['type'], jti: randomUUID() },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<JwtSignOptions['expiresIn']>('JWT_REFRESH_EXPIRES_IN') ?? '7d',
          issuer,
          audience,
        } as JwtSignOptions,
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async verifyRefreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        issuer: this.configService.get<string>('JWT_ISSUER'),
        audience: this.configService.get<string>('JWT_AUDIENCE'),
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
