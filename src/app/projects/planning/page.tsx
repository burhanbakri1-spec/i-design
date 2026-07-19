import CategoryPage from '@/components/CategoryPage';
import { projects as localProjects } from '@/data/projects';
import { getProjects } from '@/lib/api/projects';

export const dynamic = 'force-dynamic';

export default async function PlanningPage() {
  const fallback = localProjects.filter((project) => project.category === 'PLANNING');
  const projects = await getProjects({ category: 'planning', limit: 100 }, fallback);
  return <CategoryPage category="PLANNING" projectsData={projects} />;
}
