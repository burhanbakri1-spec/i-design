import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectDetailClient from './ProjectDetailClient';
import { getProjectBySlug } from '@/lib/api/projects';

export const dynamic = 'force-dynamic';

const projectSlugAliases: Record<string, string> = {
  'the-plus-3837': 'the-plus',
};

function resolveProjectSlug(slug: string) {
  return projectSlugAliases[slug] ?? slug;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = resolveProjectSlug(slug);
  const project = await getProjectBySlug(normalizedSlug);

  if (!project) {
    return {
      title: 'Project not found | i DESIGN',
    };
  }

  return {
    title: `${project.title} | i DESIGN`,
    description: project.description || `${project.title} project by i DESIGN`,
    openGraph: {
      title: project.title,
      description: project.description || undefined,
      images: project.image ? [{ url: project.image }] : undefined,
    },
  };
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
  const project = await getProjectBySlug(normalizedSlug);
  if (!project) notFound();

  return <ProjectDetailClient project={project} slug={normalizedSlug} urlCat={cat} urlSub={sub} />;
}
