'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { projects, categorySubItems } from '@/data/projects';
import Navbar from '@/components/Navbar';
import PortfolioGrid from '@/components/PortfolioGrid';

interface Props {
  category: string;
  subCategory?: string;
}

function CategoryPageContent({ category, subCategory }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    subCategory || null
  );

  useEffect(() => {
    if (subCategory) {
      setSelectedSubCategory(subCategory);
    }
  }, [subCategory]);

  if (!subCategory && searchParams.get('sub')) return null;

  const handleCategoryClick = useCallback((cat: string) => {
    if (cat === category) return;
    router.push(`/projects/${cat.toLowerCase()}`);
  }, [category, router]);

  const handleSubCategoryClick = useCallback((cat: string, sub: string) => {
    if (!cat && !sub) {
      router.push('/');
      return;
    }
    router.push(`/projects/${cat.toLowerCase()}/${sub.toLowerCase()}`);
  }, [router]);

  const hasSubNav = (categorySubItems[category]?.length ?? 0) > 0;

  const filtered = projects.filter((p) => {
    if (p.category !== category) return false;
    if (
      selectedSubCategory &&
      p.subCategory.toLowerCase() !== selectedSubCategory.toLowerCase() &&
      selectedSubCategory.toLowerCase() !== category.toLowerCase()
    )
      return false;
    return true;
  });

  return (
    <>
      <Navbar
        selectedCategory={category}
        selectedSubCategory={selectedSubCategory}
        expandedCategory={category}
        onCategoryClick={handleCategoryClick}
        onSubCategoryClick={handleSubCategoryClick}
      />
      <PortfolioGrid
        projects={filtered}
        heading={undefined}
        category={category}
        subCategory={selectedSubCategory || undefined}
      />
    </>
  );
}

export default function CategoryPage(props: Props) {
  return (
    <Suspense>
      <CategoryPageContent {...props} />
    </Suspense>
  );
}
