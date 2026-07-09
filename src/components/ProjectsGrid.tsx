'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getProjectDetail } from '@/data/projectDetails';
import type { Project } from '@/data/projects';

interface Props {
  projects: Project[];
  hasSubNav?: boolean;
  heading?: string;
  bigStyle?: boolean;
}

function ExpandedView({ project }: { project: Project }) {
  const detail = getProjectDetail(project.id, project);
  const router = useRouter();

  if (!detail) return null;

  return (
    <div className="mt-4 border-t border-black/5 pt-4">
      <div className="flex flex-col lg:flex-row w-full">
        <div className="w-full lg:w-[320px] shrink-0 bg-white p-6 flex flex-col">
          <div className="flex justify-end mb-3">
            <svg viewBox="0 0 12 12" className="w-6 h-6">
              <rect width="12" height="12" fill="black" />
              <rect x="5" y="2" width="2" height="8" fill="white" />
              <rect x="2" y="5" width="8" height="2" fill="white" />
            </svg>
          </div>
          <div className="text-right">
            <h3 className="text-lg uppercase text-black mb-1">{project.title}</h3>
            <p className="text-[10px] uppercase text-[#969696]">{project.location}</p>
            <p className="text-[10px] uppercase text-[#969696] mt-1">{project.year}</p>
          </div>
          <div className="text-right mt-auto">
            <div className="space-y-[18px]">
              <div><p className="text-[10px] uppercase text-[#969696]">Client</p><p className="text-xs text-black">{detail.client}</p></div>
              <div><p className="text-[10px] uppercase text-[#969696]">Typology</p><p className="text-xs text-black">{detail.typology}</p></div>
              <div><p className="text-[10px] uppercase text-[#969696]">Size m2/ft2</p><p className="text-xs text-black">{detail.size}</p></div>
              <div><p className="text-[10px] uppercase text-[#969696]">Status</p><p className="text-xs text-black">{detail.status}</p></div>
              <div className="pt-3 border-t border-black/10">
                <p className="text-[10px] uppercase text-[#969696] mb-3">Share</p>
                <div className="flex gap-1.5 justify-end lg:mt-[3cm] mt-8">
                <span className="flex items-center justify-center w-5 h-5 bg-black text-white cursor-pointer hover:opacity-70 transition-opacity" onClick={(e) => e.stopPropagation()}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5"><path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM20 7.23792L12.0718 14.338L4 7.21594V19H20V7.23792ZM4.51146 5L12.0619 11.662L19.501 5H4.51146Z"/></svg>
                </span>
                <span className="flex items-center justify-center w-5 h-5 bg-black text-white cursor-pointer hover:opacity-70 transition-opacity" onClick={(e) => e.stopPropagation()}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5"><path d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47062 14 5.5 16 5.5H17.5V2.1401C17.1743 2.09685 15.943 2 14.6429 2C11.9284 2 10 3.65686 10 6.69971V9.5H7V13.5H10V22H14V13.5Z"/></svg>
                </span>
                <span className="flex items-center justify-center w-5 h-5 bg-black text-white cursor-pointer hover:opacity-70 transition-opacity" onClick={(e) => e.stopPropagation()}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </span>
                <span className="flex items-center justify-center w-5 h-5 bg-black text-white cursor-pointer hover:opacity-70 transition-opacity" onClick={(e) => e.stopPropagation()}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5"><path d="M6.94048 4.99993C6.94011 5.81424 6.44608 6.54702 5.69134 6.85273C4.9366 7.15845 4.07187 6.97605 3.5049 6.39155C2.93793 5.80704 2.78195 4.93715 3.1105 4.19207C3.43906 3.44699 4.18654 2.9755 5.00048 2.99993C6.08155 3.03238 6.94097 3.91837 6.94048 4.99993ZM7.00048 8.47993H3.00048V20.9999H7.00048V8.47993ZM13.3205 8.47993H9.34048V20.9999H13.2805V14.4299C13.2805 10.7699 18.0505 10.4299 18.0505 14.4299V20.9999H22.0005V13.0699C22.0005 6.89993 14.9405 7.12993 13.2805 10.1599L13.3205 8.47993Z"/></svg>
                </span>
              </div>
            </div>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); router.push(`/projects/${project.id}`); }} className="mt-4 text-[10px] uppercase text-[#969696] hover:text-black transition-colors text-right">
            View full project →
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <div className="h-[50vh] overflow-x-auto overflow-y-hidden no-scrollbar flex">
            <div className="relative h-full shrink-0 cursor-pointer" onClick={() => router.push(`/projects/${project.id}`)}>
                <Image src={project.images[0] || project.image} alt={project.title} fill className="object-contain" sizes="50vh" />
            </div>
            {detail.features.map((f, i) => (
              <div key={i} className="relative w-[80vw] h-full shrink-0 cursor-pointer" onClick={() => router.push(`/projects/${project.id}`)}>
                  <Image src={f.image} alt={f.title} fill className="object-cover" sizes="80vw" />
                <div className="absolute bottom-6 left-0 right-0 mx-auto text-center max-w-[400px] px-4">
                  <p className="text-[10px] leading-[10px] text-white"><strong className="font-normal uppercase">{f.title}</strong></p>
                  <p className="text-[10px] leading-[10px] text-white/70 mt-2">{f.text}</p>
                </div>
              </div>
            ))}
            {project.images.length > 1 && project.images.slice(1).map((img, i) => (
              <div key={i} className="relative w-[80vw] h-full shrink-0 cursor-pointer" onClick={() => router.push(`/projects/${project.id}`)}>
                  <Image src={img} alt="" fill className="object-contain" sizes="80vw" />
                <span className="absolute bottom-4 right-6 text-[10px] leading-[10px] uppercase">
                  <span className="text-[#969696]">{String(i + 2).padStart(2, '0')}</span>/{String(project.images.length).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, bigStyle, expanded, onToggle }: { project: Project; bigStyle?: boolean; expanded: boolean; onToggle: () => void }) {
  if (bigStyle) {
    return (
      <div data-card className="w-full px-4 lg:px-0">
        <div className="relative w-full mb-6 lg:mb-[38px] text-left">
          <div className="flex flex-col lg:flex-row items-start gap-[5vw] lg:gap-16">
            <div className="relative w-full lg:w-auto">
              <div onClick={onToggle} className="cursor-pointer">
                <div className="relative w-full lg:max-w-none" style={{ maxHeight: '40vh' }}>
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1023px) 100vw, 64vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="flex flex-nowrap lg:absolute lg:top-0 lg:-left-[30px] mt-3 lg:mt-0">
                <div className="flex items-center justify-center size-[30px] lg:size-[38px] xl:size-[50px] bg-black shrink-0">
                  <Image src="/screenshot.png" alt="" width={20} height={20} className="h-3 w-3 lg:h-[15px] lg:w-[15px] xl:h-5 xl:w-5 object-contain" />
                </div>
                <div className="flex flex-col ml-[14px] lg:ml-5 xl:ml-[26px]">
                  <h3 className="text-sm lg:text-base xl:text-lg font-normal text-black max-w-[90vw] lg:max-w-none">{project.title}</h3>
                  <p className="text-[11px] text-[#797979] uppercase lg:text-xs xl:text-[15px]">{project.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {expanded && <ExpandedView project={project} />}
      </div>
    );
  }

  return (
    <div data-card className="w-full">
      <div className="grid grid-cols-1 gap-3 w-full px-2 sm:px-0 lg:grid-cols-[290px_336px] lg:gap-x-[37px] text-left lg:ml-[7cm]"
        style={{ maxWidth: 'calc(290px + 37px + 336px + 7cm)' }}>
        <div className="flex flex-col items-end pt-[18px] lg:pt-[22px] lg:-mt-[1.5cm]">
          <div className="flex items-center justify-center w-8 h-8 lg:w-[39px] lg:h-[39px] bg-black shrink-0 mr-[3px]">
            <Image src="/screenshot.png" alt="" width={15} height={15} className="h-3 w-3 lg:h-[15px] lg:w-[15px] object-contain" />
          </div>
          <div className="w-full text-right mt-3 lg:mt-4">
            <h3 className="text-sm lg:text-base font-normal leading-[1.1] text-black">{project.title}</h3>
          </div>
          <div className="w-full text-right mt-1 lg:mt-[6px]">
            <p className="text-[10px] lg:text-[11px] uppercase tracking-[0.25em] text-[#8E8E8E] leading-none">{project.location}</p>
          </div>
        </div>
        <div className="relative w-full overflow-hidden pt-5 lg:pt-7 pb-2 lg:pb-[14px] lg:-mt-[1.7cm]">
          <div onClick={onToggle} className="cursor-pointer">
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
      {expanded && <ExpandedView project={project} />}
    </div>
  );
}

export default function ProjectsGrid({ projects: projs, hasSubNav = false, heading, bigStyle }: Props) {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);

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
      for (const card of cards) {
        if (card.dataset.visible === '1') {
          card.style.transition = 'transform 1s cubic-bezier(0.25, 0.1, 0.25, 1)';
          void card.offsetHeight;
          card.style.transform = 'scale(0.9)';
        }
      }
      timer = setTimeout(() => {
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

  const toggleProject = useCallback((id: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  if (projs.length === 0) {
    return (
      <section className="pt-[129px] px-4 md:px-6 max-w-[1600px] mx-auto">
        <p className="text-black/40 text-sm tracking-wider text-center">No projects found.</p>
      </section>
    );
  }

  return (
    <section id="projects-section" ref={gridRef} className="animate-slide-down pt-[129px] pb-24 px-4 md:px-6">
      <div className="flex flex-col gap-12 lg:gap-[1.3cm] items-center w-full max-w-[1600px] mx-auto">
        {heading && (
          <div className="w-full lg:ml-[calc(360px+1cm)]">
            <h2 className="text-[13px] sm:text-[15px] font-normal tracking-[0.15em] uppercase text-black/80">{heading}</h2>
          </div>
        )}
        {projs.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            bigStyle={bigStyle}
            expanded={expandedProjects.has(project.id)}
            onToggle={() => toggleProject(project.id)}
          />
        ))}
      </div>
    </section>
  );
}