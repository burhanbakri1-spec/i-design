import HomeClient from './HomeClient';
import { projects } from '@/data/projects';
import { getFeaturedProjects } from '@/lib/api/projects';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fall back to local portfolio data when the API is unreachable (e.g. Vercel without a hosted backend).
  const initialProjects = await getFeaturedProjects(projects);
  return <HomeClient initialProjects={initialProjects} />;
}
