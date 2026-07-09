'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { projects } from '@/data/projects';
import Navbar from '@/components/Navbar';
import MobileNavbar from '@/components/MobileNavbar';
import PortfolioGrid from '@/components/PortfolioGrid';

export default function MuseumPage() {
  const router = useRouter();
  const term = 'museum'.toUpperCase();
  const filtered = projects.filter((p) => {
    if (p.subCategory?.toUpperCase() === term) return true;
    if (p.category?.toUpperCase() === term) return true;
    if (p.location?.toUpperCase().includes(term)) return true;
    if (p.title?.toUpperCase().includes(term)) return true;
    if (p.description?.toUpperCase().includes(term)) return true;
    return false;
  });

  const handleCategoryClick = useCallback((cat: string) => {
    router.push(`/projects/${cat.toLowerCase()}`);
  }, [router]);

  const handleSubCategoryClick = useCallback((cat: string, sub: string) => {
    if (!cat && !sub) { router.push('/'); return; }
    router.push(`/projects/${cat.toLowerCase()}/${sub.toLowerCase()}`);
  }, [router]);

  return (
    <>
      <Navbar
        selectedCategory={null}
        selectedSubCategory={null}
        expandedCategory={null}
        onCategoryClick={handleCategoryClick}
        onSubCategoryClick={handleSubCategoryClick}
      />
      <MobileNavbar
        selectedCategory={null}
        selectedSubCategory={null}
        expandedCategory={null}
        onCategoryClick={handleCategoryClick}
        onSubCategoryClick={handleSubCategoryClick}
      />
      <PortfolioGrid projects={filtered} />
    </>
  );
}
