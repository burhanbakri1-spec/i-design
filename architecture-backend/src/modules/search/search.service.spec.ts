import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { SearchService } from './search.service';

describe('SearchService', () => {
  it('searches selected public types only', async () => {
    const prisma = {
      project: { findMany: jest.fn().mockResolvedValue([{ id: 'project-1' }]) },
      news: { findMany: jest.fn() },
      person: { findMany: jest.fn() },
      office: { findMany: jest.fn() },
      partner: { findMany: jest.fn() },
    };
    const moduleRef = await Test.createTestingModule({
      providers: [SearchService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    const service = moduleRef.get(SearchService);
    const result = await service.search({ q: 'design', limit: 5, types: ['projects'] });

    expect(result.projects).toHaveLength(1);
    expect(prisma.project.findMany).toHaveBeenCalled();
    expect(prisma.news.findMany).not.toHaveBeenCalled();
  });
});
