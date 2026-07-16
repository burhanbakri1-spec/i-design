import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';

function extractRefreshToken(request: Request) {
  const body = request.body as { refreshToken?: string } | undefined;
  return body?.refreshToken || ExtractJwt.fromAuthHeaderAsBearerToken()(request);
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: extractRefreshToken,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET')!,
      issuer: configService.get<string>('JWT_ISSUER'),
      audience: configService.get<string>('JWT_AUDIENCE'),
      passReqToCallback: false,
    });
  }

  validate(payload: JwtPayload) {
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    return payload;
  }
}
