'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
      data-card
      className="w-full cursor-pointer"
      style={{ transformOrigin: 'top left' }}
      onTap={() => {
        if (cardRef.current) onClick(cardRef.current.getBoundingClientRect());
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex flex-col px-4 lg:px-0">
        <div
          className="grid grid-cols-1 gap-3 w-full sm:px-0 lg:grid-cols-[290px_336px] lg:gap-x-[37px] text-left lg:ml-[7cm]"
          style={{ maxWidth: 'calc(290px + 37px + 336px + 7cm)' }}
        >
          <div className="flex flex-col items-end pt-[18px] lg:pt-[22px] lg:-mt-[1.5cm]">
            <div className="flex items-center justify-center w-8 h-8 lg:w-[39px] lg:h-[39px] bg-black shrink-0 mr-[3px]">
              <Image src="/screenshot.png" alt="" width={15} height={15} className="h-3 w-3 lg:h-[15px] lg:w-[15px] object-contain" />
            </div>
            <div className="w-full text-right mt-3 lg:mt-4">
              <h3 className="text-sm lg:text-base font-normal leading-[1.1] text-black">{project.title}</h3>
            </div>
            <div className="w-full text-right mt-1 lg:mt-[6px]">
              <p className="text-[10px] lg:text-[11px] uppercase tracking-[0.25em] text-[#8E8E8E] leading-none">
                {project.location}
              </p>
            </div>
          </div>
          <div className="relative w-full overflow-hidden pt-5 lg:pt-7 pb-2 lg:pb-[14px] lg:-mt-[1.7cm]">
            <div className="relative w-full aspect-[4/3] lg:h-[234px]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 1023px) 100vw, 336px"
                className="object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PortfolioGrid({ projects: projs, heading, noPadding = false, category, subCategory }: Props) {
  const router = useRouter();
  const gridRef = useRef<HTMLDivElement>(null);
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const container = gridRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>('[data-card]');

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        (entry.target as HTMLElement).dataset.visible = entry.isIntersecting ? '1' : '0';
        if (!entry.isIntersecting) {
          (entry.target as HTMLElement).style.transform = '';
        }
      }
    }, { threshold: 0 });

    for (const card of cards) observer.observe(card);

    let timer: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      if (timer) clearTimeout(timer);
      setScrolling(true);
      for (const card of cards) {
        if (card.dataset.visible === '1') {
          card.style.transition = 'transform 1s cubic-bezier(0.25, 0.1, 0.25, 1)';
          void card.offsetHeight;
          card.style.transform = 'scale(0.9)';
        }
      }
      timer = setTimeout(() => {
        setScrolling(false);
        for (const card of cards) {
          card.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)';
          void card.offsetHeight;
          card.style.transform = '';
        }
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (timer) clearTimeout(timer);
    };
  }, []);

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
      ref={gridRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={`${noPadding ? '' : 'pt-[143px] pb-24'} px-4 md:px-6`}>
      <div className="flex flex-col gap-12 lg:gap-[1.3cm] items-center w-full max-w-[1600px] mx-auto">
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