import HomeClient from './HomeClient';
import { getFeaturedProjects } from '@/lib/api/projects';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const initialProjects = await getFeaturedProjects();
  return <HomeClient initialProjects={initialProjects} />;
}
