import CategoryPage from '@/components/CategoryPage';
import { getProjects } from '@/lib/api/projects';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const projects = await getProjects({ category: 'product-design', limit: 100 });
  return <CategoryPage category="PRODUCTS" projectsData={projects} />;
}
