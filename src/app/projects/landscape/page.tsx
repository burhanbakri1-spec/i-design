import CategoryPage from '@/components/CategoryPage';
import { projects as localProjects } from '@/data/projects';
import { getProjects } from '@/lib/api/projects';

export const dynamic = 'force-dynamic';

export default async function LandscapePage() {
  const fallback = localProjects.filter((project) => project.category === 'LANDSCAPE');
  const projects = await getProjects({ category: 'landscape', limit: 100 }, fallback);
  return <CategoryPage category="LANDSCAPE" projectsData={projects} />;
}
