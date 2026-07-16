import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthController } from '../src/modules/auth/auth.controller';
import { AuthService } from '../src/modules/auth/auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const authService = {
    login: jest.fn().mockResolvedValue({
      user: {
        id: 'cltestadmin0001',
        name: 'Admin',
        email: 'admin@example.com',
        role: 'ADMIN',
        isActive: true,
        tokenVersion: 0,
      },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login (POST)', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'StrongPassword123!' })
      .expect(201)
      .expect(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data.accessToken).toBe('access-token');
        expect(body.data.user).not.toHaveProperty('password');
      });
  });
});
