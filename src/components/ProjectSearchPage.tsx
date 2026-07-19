'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { projects as localProjects, type Project } from '@/data/projects';
import Navbar from '@/components/Navbar';
import MobileNavbar from '@/components/MobileNavbar';
import PortfolioGrid from '@/components/PortfolioGrid';
import { getProjects } from '@/lib/api/projects';

interface Props {
  term?: string;
}

const SEARCH_ALIASES: Record<string, string[]> = {
  SUSTAINABILITY: [
    'SUSTAIN',
    'GREEN',
    'ENERGY',
    'ECO',
    'SOLAR',
    'CLIMATE',
    'CARBON',
    'RECYCL',
    'TIMBER',
    'WASTE',
  ],
  MUSEUM: ['MUSEUM', 'GALLERY', 'MUSÉE', 'MUSEE', 'CONFLUENCES', 'KISTEFOS'],
};

function projectBlob(project: Project) {
  return [
    project.title,
    project.description,
    project.location,
    project.subCategory,
    project.category,
  ]
    .filter(Boolean)
    .join(' ')
    .toUpperCase();
}

function matchesTerm(project: Project, term: string) {
  const value = term.trim().toUpperCase();
  if (!value) return true;

  if (project.subCategory?.toUpperCase() === value) return true;
  if (project.category?.toUpperCase() === value) return true;
  if (project.location?.toUpperCase().includes(value)) return true;
  if (project.title?.toUpperCase().includes(value)) return true;
  if (project.description?.toUpperCase().includes(value)) return true;

  const aliases = SEARCH_ALIASES[value];
  if (!aliases) return false;

  const blob = projectBlob(project);
  return aliases.some((alias) => blob.includes(alias));
}

export default function ProjectSearchPage({ term }: Props) {
  const router = useRouter();
  const [displayProjects, setDisplayProjects] = useState<Project[]>(localProjects);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    setError('');
    getProjects({ search: term, limit: 100 }, localProjects)
      .then((items) => {
        if (mounted) setDisplayProjects(items.length > 0 ? items : localProjects);
      })
      .catch((error) => {
        if (mounted) {
          setDisplayProjects(localProjects);
          if (localProjects.length === 0) setError('Unable to load projects.');
        }
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[api error] project search page', error);
        }
      });

    return () => {
      mounted = false;
    };
  }, [term]);

  const filtered = useMemo(() => {
    if (!term) return displayProjects;
    return displayProjects.filter((project) => matchesTerm(project, term));
  }, [displayProjects, term]);

  const handleCategoryClick = useCallback((cat: string) => {
    router.push(`/projects/${cat.toLowerCase()}`);
  }, [router]);

  const handleSubCategoryClick = useCallback((cat: string, sub: string) => {
    if (!cat && !sub) {
      router.push('/');
      return;
    }
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
      {error ? (
        <section className="pt-[129px] px-4 md:px-6 max-w-[1600px] mx-auto">
          <p className="text-black/40 text-sm tracking-wider text-center">{error}</p>
        </section>
      ) : (
        <PortfolioGrid projects={filtered} />
      )}
    </>
  );
}
