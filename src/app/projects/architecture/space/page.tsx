'use client';

import { projects } from '@/data/projects';
import Navbar from '@/components/Navbar';
import ProjectsGrid from '@/components/ProjectsGrid';

export default function ArchitectureSpacePage() {
  const category = 'ARCHITECTURE';
  const subCategory = 'Space';

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
      <ProjectsGrid projects={filtered} hasSubNav={true} />
    </div>
  );
}
