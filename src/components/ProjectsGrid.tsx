'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
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
      <div className="flex w-full">
        <div className="w-[320px] shrink-0 bg-white p-6 flex flex-col">
          <div className="flex justify-end mb-3">
            <svg viewBox="0 0 12 12" className="w-6 h-6">
              <rect width="12" height="12" fill="black" />
              <rect x="5" y="2" width="2" height="8" fill="white" />
              <rect x="2" y="5" width="8" height="2" fill="white" />
            </svg>
          </div>
          <div className="text-right">
            <h3 className="text-[18px] uppercase text-black mb-1">{project.title}</h3>
            <p className="text-[10px] uppercase text-[#969696]">{project.location}</p>
            <p className="text-[10px] uppercase text-[#969696] mt-1">{project.year}</p>
          </div>
          <div className="text-right mt-auto">
            <div className="space-y-[18px]">
              <div><p className="text-[10px] uppercase text-[#969696]">Client</p><p className="text-[12px] text-black">{detail.client}</p></div>
              <div><p className="text-[10px] uppercase text-[#969696]">Typology</p><p className="text-[12px] text-black">{detail.typology}</p></div>
              <div><p className="text-[10px] uppercase text-[#969696]">Size m2/ft2</p><p className="text-[12px] text-black">{detail.size}</p></div>
              <div><p className="text-[10px] uppercase text-[#969696]">Status</p><p className="text-[12px] text-black">{detail.status}</p></div>
              <div className="pt-3 border-t border-black/10">
                <p className="text-[10px] uppercase text-[#969696] mb-3">Share</p>
                <div className="flex gap-1.5 justify-end mt-[3cm]">
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
              <img src={project.images[0] || project.image} alt={project.title} className="h-full w-auto object-contain" />
            </div>
            {detail.features.map((f, i) => (
              <div key={i} className="relative w-[80vw] h-full shrink-0 cursor-pointer" onClick={() => router.push(`/projects/${project.id}`)}>
                <img src={f.image} alt={f.title} className="w-full h-full object-cover" />
                <div className="absolute bottom-6 left-0 right-0 mx-auto text-center max-w-[400px] px-4">
                  <p className="text-[10px] leading-[10px] text-white"><strong className="font-normal uppercase">{f.title}</strong></p>
                  <p className="text-[10px] leading-[10px] text-white/70 mt-2">{f.text}</p>
                </div>
              </div>
            ))}
            {project.images.length > 1 && project.images.slice(1).map((img, i) => (
              <div key={i} className="relative w-[80vw] h-full shrink-0 cursor-pointer" onClick={() => router.push(`/projects/${project.id}`)}>
                <img src={img} alt="" className="w-full h-full object-contain" />
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
      <div className="w-full">
        <div className="relative w-full mb-[26px] md:mb-[38px] text-left px-2 sm:px-0">
          <div className="flex flex-wrap md:flex-nowrap items-start gap-[5vw] lg:gap-16">
            <div className="relative w-full md:w-auto">
              <div onClick={onToggle} className="cursor-pointer">
                <img src={project.image} alt={project.title} className="max-w-[90vw] min-w-[90vw] sm:max-w-[64vw] md:w-auto md:max-w-none w-full object-cover" style={{ maxHeight: '55vh' }} />
              </div>
              <div className="flex flex-nowrap md:absolute md:top-0 md:-left-[30px] mt-3 md:mt-0">
                <div className="flex items-center justify-center size-[30px] md:size-[38px] lg:size-[50px] bg-black shrink-0">
                  <img src="/screenshot.png" alt="project icon" className="h-[12px] w-[12px] md:h-[15px] md:w-[15px] lg:h-[20px] lg:w-[20px] object-contain" />
                </div>
                <div className="flex flex-col ml-[14px] md:ml-5 lg:ml-[26px]">
                  <h3 className="max-w-[74vw] text-[15px] leading-[15px] font-normal md:max-w-[67vw] md:text-[16px] md:leading-4 lg:max-w-none lg:text-[18px] lg:leading-5 text-black">{project.title}</h3>
                  <p className="text-[11px] text-[#797979] uppercase leading-none md:mt-[4px] md:text-[12px] lg:mt-[6px] lg:text-[15px]">{project.location}</p>
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
    <div className="w-full">
      <div className="grid grid-cols-1 gap-3 w-full px-2 sm:px-0 lg:grid-cols-[290px_336px] lg:gap-x-[37px] text-left ml-[7cm]"
        style={{ maxWidth: 'calc(290px + 37px + 336px + 7cm)' }}>
        <div className="flex flex-col items-end pt-[22px] -mt-[1.5cm]">
          <div className="flex items-center justify-center w-[39px] h-[39px] bg-black shrink-0 mr-[3px]">
            <img src="/screenshot.png" alt="project icon" className="h-[15px] w-[15px] object-contain" />
          </div>
          <div className="w-full text-right mt-[16px]">
            <h3 className="text-[16px] font-normal leading-[1.1] text-black">{project.title}</h3>
          </div>
          <div className="w-full text-right mt-[6px]">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#8E8E8E] leading-none">{project.location}</p>
          </div>
        </div>
        <div className="relative w-full overflow-hidden pt-[28px] pb-[14px] -mt-[1.7cm]">
          <div onClick={onToggle} className="cursor-pointer">
            <img src={project.image} alt={project.title} className="w-full aspect-[800/533] object-cover" />
          </div>
        </div>
      </div>
      {expanded && <ExpandedView project={project} />}
    </div>
  );
}

export default function ProjectsGrid({ projects: projs, hasSubNav = false, heading, bigStyle }: Props) {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

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
    <section id="projects-section" className="animate-slide-down pt-[129px] pb-[100px] px-4 md:px-6">
      <div className="flex flex-col gap-[1.3cm] items-center w-full max-w-[1600px] mx-auto">
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