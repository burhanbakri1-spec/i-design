'use client';

import { useState, useCallback } from 'react';
import { projects, categorySubItems } from '@/data/projects';
import Navbar from '@/components/Navbar';
import ProjectsGrid from '@/components/ProjectsGrid';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleCategoryClick = useCallback((cat: string) => {
    setExpandedCategory((prev) => (prev === cat ? null : cat));
    setSelectedCategory(cat);
    setSelectedSubCategory(null);
  }, []);

  const handleSubCategoryClick = useCallback((cat: string, sub: string) => {
    setSelectedCategory(cat);
    setSelectedSubCategory(sub || null);
  }, []);

  const filtered = projects.filter((p) => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (
      selectedSubCategory &&
      p.subCategory.toLowerCase() !== selectedSubCategory.toLowerCase() &&
      selectedSubCategory.toLowerCase() !== selectedCategory?.toLowerCase()
    )
      return false;
    return true;
  });

  const hasSubNav =
    expandedCategory !== null &&
    (categorySubItems[expandedCategory]?.length ?? 0) > 0;

  return (
    <>
      <Navbar
        selectedCategory={selectedCategory}
        selectedSubCategory={selectedSubCategory}
        expandedCategory={expandedCategory}
        onCategoryClick={handleCategoryClick}
        onSubCategoryClick={handleSubCategoryClick}
      />
      <ProjectsGrid projects={filtered} hasSubNav={hasSubNav} />
    </>
  );
}
