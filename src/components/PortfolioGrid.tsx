'use client';

import { useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { Project } from '@/data/projects';

interface Props {
  projects: Project[];
  heading?: string;
  noPadding?: boolean;
  category?: string;
  subCategory?: string;
}

function ProjectCard({ project, onClick }: { project: Project; onClick: (rect: DOMRect) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  return (
    <motion.div
      ref={cardRef}
      className="w-full cursor-pointer"
      onTap={() => {
        if (cardRef.current) onClick(cardRef.current.getBoundingClientRect());
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div
        className="grid grid-cols-1 gap-3 w-full px-2 sm:px-0 lg:grid-cols-[290px_336px] lg:gap-x-[37px] text-left ml-[7cm]"
        style={{ maxWidth: 'calc(290px + 37px + 336px + 7cm)' }}
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

export default function PortfolioGrid({ projects: projs, heading, noPadding = false, category, subCategory }: Props) {
  const router = useRouter();

  const handleClick = useCallback((id: string, rect: DOMRect) => {
    sessionStorage.setItem('zoomData', JSON.stringify({
      rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      image: projs.find(p => p.id === id)?.image || '',
    }));
    const params = new URLSearchParams();
    if (category) params.set('cat', category);
    if (subCategory) params.set('sub', subCategory);
    const qs = params.toString();
    router.push(`/projects/${id}${qs ? `?${qs}` : ''}`);
  }, [router, category, subCategory, projs]);

  if (projs.length === 0) {
    return (
      <section className="pt-[129px] px-4 md:px-6 max-w-[1600px] mx-auto">
        <p className="text-black/40 text-sm tracking-wider text-center">No projects found.</p>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={`${noPadding ? '' : 'pt-[129px] pb-[100px]'} px-4 md:px-6`}>
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
            onClick={(rect) => handleClick(project.id, rect)}
          />
        ))}
      </div>
    </motion.section>
  );
}