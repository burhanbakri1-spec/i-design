'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { Project } from '@/data/projects';

interface Props {
  projects: Project[];
  heading?: string;
  noPadding?: boolean;
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <motion.div
      className="w-full cursor-pointer"
      onTap={onClick}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div
        className="grid grid-cols-1 gap-3 w-full px-2 sm:px-0 lg:grid-cols-[290px_336px] lg:gap-x-[37px] text-left ml-[4cm]"
        style={{ maxWidth: 'calc(290px + 37px + 336px + 4cm)' }}
      >
        <div className="flex flex-col items-end pt-[22px] -mt-[1.5cm]">
          <div className="flex items-center justify-center w-[39px] h-[39px] bg-black shrink-0 mr-[3px]">
            <img src="/screenshot.png" alt="" className="h-[15px] w-[15px] object-contain" />
          </div>
          <div className="w-full text-right mt-[16px]">
            <h3 className="text-[16px] font-normal leading-[1.1] text-black">{project.title}</h3>
          </div>
          <div className="w-full text-right mt-[6px]">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#8E8E8E] leading-none">
              {project.location}
            </p>
          </div>
        </div>
        <div className="relative w-full overflow-hidden pt-[28px] pb-[14px] -mt-[1.7cm]">
          <img src={project.image} alt={project.title} className="w-full h-[234px] object-cover" />
        </div>
      </div>
    </motion.div>
  );
}

export default function PortfolioGrid({ projects: projs, heading, noPadding = false }: Props) {
  const router = useRouter();

  const handleClick = useCallback((id: string) => {
    router.push(`/projects/${id}`);
  }, [router]);

  if (projs.length === 0) {
    return (
      <section className="pt-[129px] px-4 md:px-6 max-w-[1600px] mx-auto">
        <p className="text-black/40 text-sm tracking-wider text-center">No projects found.</p>
      </section>
    );
  }

  return (
    <section className={`animate-slide-down ${noPadding ? '' : 'pt-[129px] pb-[100px]'} px-4 md:px-6`}>
      <div className="flex flex-col gap-[1.3cm] items-center w-full max-w-[1600px] mx-auto">
        {heading && (
          <div className="w-full lg:ml-[calc(360px+1cm)]">
            <h2 className="text-[13px] sm:text-[15px] font-normal tracking-[0.15em] uppercase text-black/80">
              {heading}
            </h2>
          </div>
        )}
        {projs.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => handleClick(project.id)}
          />
        ))}
      </div>
    </section>
  );
}