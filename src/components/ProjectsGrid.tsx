'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Project } from '@/data/projects';

interface Props {
  projects: Project[];
  hasSubNav?: boolean;
  heading?: string;
  bigStyle?: boolean;
}

function ProjectCard({ project, bigStyle }: { project: Project; bigStyle?: boolean }) {
  const router = useRouter();

  const handleClick = useCallback(() => {
    const section = document.getElementById('projects-section');
    if (section) {
      section.classList.remove('animate-slide-down');
      section.classList.add('animate-slide-up');
    }
    setTimeout(() => {
      router.push(`/projects/${project.id}`);
    }, 2350);
  }, [router, project.id]);

  if (bigStyle) {
    return (
      <div className="relative w-full mb-[26px] md:mb-[38px] text-left px-2 sm:px-0">
        <div className="flex flex-wrap md:flex-nowrap items-start gap-[5vw] lg:gap-16">
          <div className="relative w-full md:w-auto">
            <div onClick={handleClick} className="cursor-pointer">
              <img
                src={project.image}
                alt={project.title}
                className="max-w-[90vw] min-w-[90vw] sm:max-w-[64vw] md:w-auto md:max-w-none w-full object-cover"
                style={{ maxHeight: '55vh' }}
              />
            </div>
            <div className="flex flex-nowrap md:absolute md:top-0 md:-left-[30px] mt-3 md:mt-0">
              <div className="flex items-center justify-center size-[30px] md:size-[38px] lg:size-[50px] bg-black shrink-0">
                <img
                  src="/screenshot.png"
                  alt="project icon"
                  className="h-[12px] w-[12px] md:h-[15px] md:w-[15px] lg:h-[20px] lg:w-[20px] object-contain"
                />
              </div>
              <div className="flex flex-col ml-[14px] md:ml-5 lg:ml-[26px]">
                <h3 className="max-w-[74vw] text-[15px] leading-[15px] font-normal md:max-w-[67vw] md:text-[16px] md:leading-4 lg:max-w-none lg:text-[18px] lg:leading-5 text-black">
                  {project.title}
                </h3>
                <p className="text-[11px] text-[#797979] uppercase leading-none md:mt-[4px] md:text-[12px] lg:mt-[6px] lg:text-[15px]">
                  {project.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 w-full px-2 sm:px-0 lg:grid-cols-[290px_336px] lg:gap-x-[37px] lg:ml-[calc(360px+1cm)] text-left">
      <div className="flex flex-col items-end pt-[22px] -mt-[1.5cm]">
        <div className="flex items-center justify-center w-[39px] h-[39px] bg-black shrink-0 mr-[3px]">
          <img
            src="/screenshot.png"
            alt="project icon"
            className="h-[15px] w-[15px] object-contain"
          />
        </div>
        <div className="w-full text-right mt-[16px]">
          <h3 className="text-[16px] font-normal leading-[1.1] text-black">
            {project.title}
          </h3>
        </div>
        <div className="w-full text-right mt-[6px]">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#8E8E8E] leading-none">
            {project.location}
          </p>
        </div>
      </div>

      <div className="relative w-full overflow-hidden pt-[28px] pb-[14px] -mt-[1.7cm]">
        <div onClick={handleClick} className="cursor-pointer">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-[234px] object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default function ProjectsGrid({ projects, hasSubNav = false, heading, bigStyle }: Props) {
  if (projects.length === 0) {
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
            <h2 className="text-[13px] sm:text-[15px] font-normal tracking-[0.15em] uppercase text-black/80">
              {heading}
            </h2>
          </div>
        )}
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} bigStyle={bigStyle} />
        ))}
      </div>
    </section>
  );
}
