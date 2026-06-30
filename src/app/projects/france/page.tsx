'use client';

import { projects } from '@/data/projects';
import Navbar from '@/components/Navbar';
import ProjectsGrid from '@/components/ProjectsGrid';

export default function rancePage() {
  const term = 'france'.toUpperCase();
  const filtered = projects.filter((p) => {
    if (p.subCategory?.toUpperCase() === term) return true;
    if (p.category?.toUpperCase() === term) return true;
    if (p.location?.toUpperCase().includes(term)) return true;
    if (p.title?.toUpperCase().includes(term)) return true;
    if (p.description?.toUpperCase().includes(term)) return true;
    return false;
  });

  return (
    <>
      <Navbar
        selectedCategory={null}
        selectedSubCategory={null}
        expandedCategory={null}
        onCategoryClick={() => {}}
        onSubCategoryClick={() => {}}
      />
      <section className="pt-[86px] pb-12 px-4 md:px-6">
        <div className="max-w-[998px] mx-auto mb-4">
          <p className="text-xs tracking-[0.15em] uppercase text-black/40">
            {filtered.length} result{(filtered.length !== 1) ? 's' : ''} for &ldquo;france&rdquo;
          </p>
        </div>
        <ProjectsGrid projects={filtered} />
      </section>
    </>
  );
}

