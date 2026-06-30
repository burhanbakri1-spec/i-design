import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { notFound } from 'next/navigation';

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

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const normalizedSlug = resolveProjectSlug(params.slug);
  const project = projects.find((p) => p.id === normalizedSlug);
  if (!project) notFound();

  const galleryImages = project.images?.slice(0) || [];

  return (
    <main className="min-h-screen bg-white">
      <div className="px-4 md:px-6 pt-[86px] pb-16">
        <div className="max-w-[1200px] mx-auto">
          <Link
            href="/"
            className="inline-block text-[11px] uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors mb-8"
          >
            ← Back
          </Link>

          <div className="relative w-full aspect-[16/9] max-w-[50%] mx-auto overflow-hidden bg-gray-100 mb-10">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="max-w-[800px]">
            <div className="flex items-start gap-4 mb-4">
              <img src="/screenshot.png" alt="" className="w-[44px] h-[44px] object-contain shrink-0" />
              <div>
                <h1 className="text-[28px] md:text-[36px] font-semibold tracking-tight text-black leading-tight">
                  {project.title}
                </h1>
                <p className="text-[13px] tracking-[0.2em] uppercase text-black/50 mt-1">
                  {project.location}
                </p>
                <p className="text-[11px] tracking-[0.2em] uppercase text-black/30 mt-0.5">
                  {project.year}
                </p>
              </div>
            </div>

            <p className="text-[15px] leading-relaxed text-black/70 mt-6 max-w-[650px]">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-6 mt-6 text-[11px] tracking-[0.15em] uppercase text-black/40">
              <span>{project.category}</span>
              {project.subCategory && <span>{project.subCategory}</span>}
            </div>
          </div>

          {galleryImages.length > 0 && (
            <div className="mt-12 space-y-[0.9cm] max-w-[50%] mx-auto">
              {galleryImages.map((img, i) => (
                <div key={i} className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
                  <Image
                    src={img}
                    alt={`${project.title} ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
