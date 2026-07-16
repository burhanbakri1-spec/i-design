import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { validateEnvironment } from './config/env.validation';
import { AuthModule } from './modules/auth/auth.module';
import { AwardsModule } from './modules/awards/awards.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ContactModule } from './modules/contact/contact.module';
import { MediaModule } from './modules/media/media.module';
import { NewsModule } from './modules/news/news.module';
import { OfficesModule } from './modules/offices/offices.module';
import { PartnersModule } from './modules/partners/partners.module';
import { PeopleModule } from './modules/people/people.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { SearchModule } from './modules/search/search.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate: validateEnvironment,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    CategoriesModule,
    ProjectsModule,
    MediaModule,
    NewsModule,
    OfficesModule,
    PeopleModule,
    AwardsModule,
    PartnersModule,
    SearchModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
