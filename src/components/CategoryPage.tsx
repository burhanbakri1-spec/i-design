'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { categorySubItems } from '@/data/projects';
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

const emptyProjects: Project[] = [];

function CategoryPageContent({ category, subCategory, projectsData = emptyProjects }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [displayProjects, setDisplayProjects] = useState<Project[]>(projectsData);
  const [error, setError] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    subCategory || null
  );

  useEffect(() => {
    setDisplayProjects((currentProjects) => {
      if (
        currentProjects.length === projectsData.length &&
        currentProjects.every((project, index) => project.id === projectsData[index]?.id)
      ) {
        return currentProjects;
      }

      return projectsData;
    });
  }, [projectsData]);

  useEffect(() => {
    let mounted = true;
    const apiCategory = category === 'INTERIORS' ? 'interior' : category === 'PRODUCTS' ? 'product-design' : category.toLowerCase();

    setError('');
    getProjects({ category: apiCategory, limit: 100 }, projectsData)
      .then((items) => {
        if (mounted) setDisplayProjects(items.length > 0 ? items : projectsData);
      })
      .catch((error) => {
        if (mounted) {
          setDisplayProjects(projectsData);
          if (projectsData.length === 0) setError('Unable to load projects.');
        }
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[api error] category projects', error);
        }
      });

    return () => {
      mounted = false;
    };
  }, [category, projectsData]);

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
