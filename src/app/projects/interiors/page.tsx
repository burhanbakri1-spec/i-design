import CategoryPage from '@/components/CategoryPage';
import { getProjects } from '@/lib/api/projects';

export const dynamic = 'force-dynamic';

export default async function InteriorsPage() {
  const projects = await getProjects({ category: 'interior', limit: 100 });
  return <CategoryPage category="INTERIORS" projectsData={projects} />;
}
