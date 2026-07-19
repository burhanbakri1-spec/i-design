import CategoryPage from '@/components/CategoryPage';
import { projects as localProjects } from '@/data/projects';
import { getProjects } from '@/lib/api/projects';

export const dynamic = 'force-dynamic';

export default async function InteriorsPage() {
  const fallback = localProjects.filter((project) => project.category === 'INTERIORS');
  const projects = await getProjects({ category: 'interior', limit: 100 }, fallback);
  return <CategoryPage category="INTERIORS" projectsData={projects} />;
}
