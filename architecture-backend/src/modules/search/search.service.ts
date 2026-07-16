import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { SearchQueryDto, SearchType } from './dto/search-query.dto';

const allTypes: SearchType[] = ['projects', 'news', 'people', 'offices', 'partners'];

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: SearchQueryDto) {
    const types = query.types?.length ? query.types : allTypes;
    const q = query.q.trim();
    const limit = query.limit;
    const contains = { contains: q, mode: 'insensitive' as const };

    const empty = Promise.resolve([]);
    const projectsPromise = types.includes('projects') ? this.searchProjects(contains, limit) : empty;
    const newsPromise = types.includes('news') ? this.searchNews(contains, limit) : empty;
    const peoplePromise = types.includes('people') ? this.searchPeople(contains, limit) : empty;
    const officesPromise = types.includes('offices') ? this.searchOffices(contains, limit) : empty;
    const partnersPromise = types.includes('partners') ? this.searchPartners(contains, limit) : empty;

    const [projects, news, people, offices, partners] = await Promise.all([
      projectsPromise,
      newsPromise,
      peoplePromise,
      officesPromise,
      partnersPromise,
    ]);

    return {
      query: q,
      projects,
      news,
      people,
      offices,
      partners,
      totals: {
        projects: projects.length,
        news: news.length,
        people: people.length,
        offices: offices.length,
        partners: partners.length,
      },
    };
  }

  private searchProjects(contains: Prisma.StringFilter<'Project'>, take: number) {
    return this.prisma.project.findMany({
      where: {
        published: true,
        deletedAt: null,
        OR: [{ title: contains }, { shortDescription: contains }, { description: contains }, { city: contains }, { country: contains }, { client: contains }],
      },
      select: { id: true, title: true, slug: true, shortDescription: true, city: true, country: true, coverImage: true, publishedAt: true },
      take,
      orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
    });
  }

  private searchNews(contains: Prisma.StringFilter<'News'>, take: number) {
    return this.prisma.news.findMany({
      where: { published: true, OR: [{ title: contains }, { excerpt: contains }, { content: contains }] },
      select: { id: true, title: true, slug: true, excerpt: true, coverImage: true, externalUrl: true, publishedAt: true },
      take,
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    });
  }

  private searchPeople(contains: Prisma.StringFilter<'Person'>, take: number) {
    return this.prisma.person.findMany({
      where: { published: true, OR: [{ name: contains }, { jobTitle: contains }, { biography: contains }] },
      select: { id: true, name: true, slug: true, jobTitle: true, image: true },
      take,
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  private searchOffices(contains: Prisma.StringFilter<'Office'>, take: number) {
    return this.prisma.office.findMany({
      where: { published: true, OR: [{ name: contains }, { city: contains }, { country: contains }, { description: contains }] },
      select: { id: true, name: true, slug: true, city: true, country: true, image: true },
      take,
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  private searchPartners(contains: Prisma.StringFilter<'Partner'>, take: number) {
    return this.prisma.partner.findMany({
      where: { OR: [{ name: contains }, { description: contains }] },
      select: { id: true, name: true, slug: true, website: true, logo: true },
      take,
      orderBy: [{ name: 'asc' }],
    });
  }
}
