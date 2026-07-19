import CategoryPage from '@/components/CategoryPage';
import { projects as localProjects } from '@/data/projects';
import { getProjects } from '@/lib/api/projects';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const fallback = localProjects.filter((project) => project.category === 'PRODUCTS');
  const projects = await getProjects({ category: 'product-design', limit: 100 }, fallback);
  return <CategoryPage category="PRODUCTS" projectsData={projects} />;
}
