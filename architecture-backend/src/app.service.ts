import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealth() {
    try {
      await this.prisma.checkConnection();
    } catch {
      throw new ServiceUnavailableException({
        success: false,
        message: 'Database is unavailable',
        data: {
          application: 'up',
          database: 'down',
          timestamp: new Date().toISOString(),
        },
      });
    }

    return {
      success: true,
      message: 'Architecture backend is running',
      data: {
        application: 'up',
        database: 'up',
        timestamp: new Date().toISOString(),
      },
    };
  }
}
