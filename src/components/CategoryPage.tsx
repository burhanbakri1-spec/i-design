'use client';

import { useState, useCallback, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { categorySubItems, projects as localProjects } from '@/data/projects';
import type { Project } from '@/data/projects';
import Navbar from '@/components/Navbar';
import MobileNavbar from '@/components/MobileNavbar';
import PortfolioGrid from '@/components/PortfolioGrid';
import { getProjects } from '@/lib/api/projects';

interface Props {
  category: string;
  subCategory?: string;
  projectsData?: Project[];
}

function CategoryPageContent({ category, subCategory, projectsData }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const localFallback = useMemo(
    () => localProjects.filter((project) => project.category === category),
    [category],
  );
  const seedProjects = projectsData && projectsData.length > 0 ? projectsData : localFallback;
  const [displayProjects, setDisplayProjects] = useState<Project[]>(seedProjects);
  const [error, setError] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    subCategory || null
  );

  useEffect(() => {
    setDisplayProjects((currentProjects) => {
      if (
        currentProjects.length === seedProjects.length &&
        currentProjects.every((project, index) => project.id === seedProjects[index]?.id)
      ) {
        return currentProjects;
      }

      return seedProjects;
    });
  }, [seedProjects]);

  useEffect(() => {
    let mounted = true;
    const apiCategory = category === 'INTERIORS' ? 'interior' : category === 'PRODUCTS' ? 'product-design' : category.toLowerCase();

    setError('');
    getProjects({ category: apiCategory, limit: 100 }, seedProjects)
      .then((items) => {
        if (mounted) setDisplayProjects(items.length > 0 ? items : seedProjects);
      })
      .catch((error) => {
        if (mounted) {
          setDisplayProjects(seedProjects);
          if (seedProjects.length === 0) setError('Unable to load projects.');
        }
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[api error] category projects', error);
        }
      });

    return () => {
      mounted = false;
    };
  }, [category, seedProjects]);

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

  const filtered = displayProjects.filter((p) => {
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
      <MobileNavbar
        selectedCategory={category}
        selectedSubCategory={selectedSubCategory}
        expandedCategory={category}
        onCategoryClick={handleCategoryClick}
        onSubCategoryClick={handleSubCategoryClick}
      />
      {error ? (
        <section className="pt-[129px] px-4 md:px-6 max-w-[1600px] mx-auto">
          <p className="text-black/40 text-sm tracking-wider text-center">{error}</p>
        </section>
      ) : (
        <PortfolioGrid
          projects={filtered}
          heading={undefined}
          category={category}
          subCategory={selectedSubCategory || undefined}
        />
      )}
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
