import CategoryPage from '@/components/CategoryPage';
import { getProjects } from '@/lib/api/projects';

export const dynamic = 'force-dynamic';

export default async function PlanningPage() {
  const projects = await getProjects({ category: 'planning', limit: 100 });
  return <CategoryPage category="PLANNING" projectsData={projects} />;
}
