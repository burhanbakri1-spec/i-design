'use client';

import { useCallback, useRef, useEffect } from 'react';
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
  enableScrollScale?: boolean;
}

function ProjectCard({ project, onClick }: { project: Project; onClick: (rect: DOMRect) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const openProject = useCallback(() => {
    if (cardRef.current) onClick(cardRef.current.getBoundingClientRect());
  }, [onClick]);

  return (
    <motion.div
      ref={cardRef}
      data-card
      role="button"
      tabIndex={0}
      className="w-screen max-w-full cursor-pointer lg:w-full"
      style={{ transformOrigin: 'center center' }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openProject();
        }
      }}
      onTap={openProject}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex flex-col px-0 lg:px-0">
        <div
          className="grid grid-cols-1 gap-3 w-full sm:px-0 lg:grid-cols-[290px_336px] lg:gap-x-[1cm] text-left lg:ml-[5cm]"
          style={{ maxWidth: 'calc(290px + 1cm + 336px + 5cm)' }}
        >
          <div className="order-2 flex flex-row items-start gap-3 px-4 pt-0 lg:order-1 lg:flex-col lg:items-end lg:gap-0 lg:px-0 lg:pt-[22px] lg:-mt-[1.5cm]">
            <div className="flex items-center justify-center w-8 h-8 lg:w-[39px] lg:h-[39px] bg-black shrink-0 lg:mr-[3px]">
              <Image src="/screenshot.png" alt="" width={15} height={15} className="h-3 w-3 lg:h-[15px] lg:w-[15px] object-contain" />
            </div>
            <div className="min-w-0 flex flex-col items-start lg:w-full lg:items-end">
              <div className="w-full text-left lg:text-right lg:mt-4">
                <h3 className="text-sm lg:text-base font-normal leading-[1.1] text-black">{project.title}</h3>
              </div>
              <div className="w-full text-left mt-1 lg:text-right lg:mt-[6px]">
                <p className="text-[10px] lg:text-[11px] uppercase tracking-[0.25em] text-[#8E8E8E] leading-none">
                  {project.location}
                </p>
              </div>
            </div>
          </div>
          <div className="relative order-1 w-full overflow-hidden pt-5 lg:order-2 lg:pt-7 pb-2 lg:pb-[14px] lg:-mt-[1.7cm]">
            <div className="relative w-full aspect-[4/3] lg:h-[234px]">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 1023px) 100vw, 336px"
                  className="object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-black/[0.03] text-[10px] uppercase tracking-[0.18em] text-black/35">
                  No image
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PortfolioGrid({
  projects: projs,
  heading,
  noPadding = false,
  category,
  subCategory,
  enableScrollScale = true,
}: Props) {
  const router = useRouter();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enableScrollScale) return;

    const container = gridRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>('[data-card]');

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        (entry.target as HTMLElement).dataset.visible = entry.isIntersecting ? '1' : '0';
      }
    }, { threshold: 0 });

    for (const card of cards) observer.observe(card);

    let timer: ReturnType<typeof setTimeout> | null = null;
    let lastReachedCard: HTMLElement | null = null;
    const motion = 'transform 2s cubic-bezier(0.22, 0.61, 0.36, 1)';
    const returnMotion = 'transform 3s cubic-bezier(0.22, 0.61, 0.36, 1)';

    const updateVisibleCards = () => {
      const viewportCenter = window.innerHeight * 0.5;
      let shortestDistance = Number.POSITIVE_INFINITY;

      for (const card of cards) {
        if (card.dataset.visible !== '1') {
          card.style.transform = '';
          card.style.willChange = '';
          continue;
        }

        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenter - viewportCenter);

        if (distance < shortestDistance) {
          shortestDistance = distance;
          lastReachedCard = card;
        }

        card.style.transition = motion;
        card.style.transformOrigin = 'center center';
        card.style.willChange = 'transform';
        card.style.transform = 'scale(0.9)';
      }
    };

    const handleScroll = () => {
      if (timer) clearTimeout(timer);
      updateVisibleCards();

      timer = setTimeout(() => {
        for (const card of cards) {
          card.style.transition = returnMotion;
          card.style.transform = '';
          card.dataset.reached = card === lastReachedCard ? '1' : '0';
        }
        timer = setTimeout(() => {
          for (const card of cards) {
            card.style.willChange = '';
          }
        }, 3000);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (timer) clearTimeout(timer);
      for (const card of cards) {
        card.style.transform = '';
        card.style.willChange = '';
      }
    };
  }, [enableScrollScale]);

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
      className={`${noPadding ? '' : 'pt-[143px] pb-0'} px-0 md:px-6`}>
      <div data-projects-list className="flex flex-col gap-3 lg:gap-[1.3cm] items-center w-full max-w-[1600px] mx-auto">
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
