import CategoryPage from '@/components/CategoryPage';
import { getProjects } from '@/lib/api/projects';

export const dynamic = 'force-dynamic';

export default async function LandscapePage() {
  const projects = await getProjects({ category: 'landscape', limit: 100 });
  return <CategoryPage category="LANDSCAPE" projectsData={projects} />;
}
