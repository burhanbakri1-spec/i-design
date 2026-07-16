import CategoryPage from '@/components/CategoryPage';
import { getProjects } from '@/lib/api/projects';

export const dynamic = 'force-dynamic';

export default async function ArchitecturePage() {
  const projects = await getProjects({ category: 'architecture', limit: 100 });
  return <CategoryPage category="ARCHITECTURE" projectsData={projects} />;
}
