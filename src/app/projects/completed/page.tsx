'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { projects } from '@/data/projects';
import Navbar from '@/components/Navbar';
import MobileNavbar from '@/components/MobileNavbar';
import PortfolioGrid from '@/components/PortfolioGrid';

export default function CompletedPage() {
  const router = useRouter();

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
      <PortfolioGrid projects={projects} />
    </>
  );
}
