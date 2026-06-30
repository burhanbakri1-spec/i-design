'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { projects, type Project } from '@/data/projects';
import Navbar from '@/components/Navbar';

function ProjectCard({ project }: { project: Project }) {
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

export default function ProductsMobilityPage() {
  const category = 'PRODUCTS';
  const subCategory = 'Mobility';
  const filtered = projects.filter((p) => {
    if (p.category !== category) return false;
    if (p.subCategory.toLowerCase() !== subCategory.toLowerCase()) return false;
    return true;
  });

  return (
    <div>
      <Navbar
        selectedCategory={category}
        selectedSubCategory={subCategory}
        expandedCategory={category}
        onCategoryClick={() => {}}
        onSubCategoryClick={() => {}}
      />

      <section id="projects-section" className="animate-slide-down pt-[129px] pb-[100px] px-4 md:px-6">
        <div className="flex flex-col gap-[1.3cm] items-center w-full max-w-[1600px] mx-auto">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
