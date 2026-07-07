import { projects } from '@/data/projects';
import { notFound } from 'next/navigation';
import ProjectDetailClient from './ProjectDetailClient';

const projectSlugAliases: Record<string, string> = {
  'the-plus-3837': 'the-plus',
};

function resolveProjectSlug(slug: string) {
  if (projects.some((project) => project.id === slug)) {
    return slug;
  }
  return projectSlugAliases[slug] ?? slug;
}

export function generateStaticParams() {
  return projects.flatMap((project) => {
    const extraSlugs = Object.entries(projectSlugAliases)
      .filter(([, targetId]) => targetId === project.id)
      .map(([aliasSlug]) => ({ slug: aliasSlug }));
    return [{ slug: project.id }, ...extraSlugs];
  });
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ cat?: string; sub?: string }>;
}) {
  const { slug } = await params;
  const { cat, sub } = await searchParams;
  const normalizedSlug = resolveProjectSlug(slug);
  const project = projects.find((p) => p.id === normalizedSlug);
  if (!project) notFound();

  return <ProjectDetailClient project={project} slug={normalizedSlug} urlCat={cat} urlSub={sub} />;
}
