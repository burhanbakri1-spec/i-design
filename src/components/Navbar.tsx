'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { categories, categorySubItems } from '@/data/projects';

const words = [
  { name: 'COMPLETED', link: '/projects/completed' },
  { name: 'FRANCE', link: '/projects/france' },
  { name: 'EDUCATION', link: '/projects/education' },
  { name: 'MUSEUM', link: '/projects/museum' },
  { name: 'SUSTAINABILITY', link: '/projects/sustainability' },
];

const Square = () => (
  <span className="inline-block w-1.5 h-1.5 bg-black shrink-0" aria-hidden />
);

interface Props {
  selectedCategory: string | null;
  selectedSubCategory: string | null;
  expandedCategory: string | null;
  onCategoryClick: (cat: string) => void;
  onSubCategoryClick: (cat: string, sub: string) => void;
}

export default function Navbar({
  selectedCategory,
  selectedSubCategory,
  expandedCategory,
}: Props) {
  const router = useRouter();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [tempWord, setTempWord] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tempWordTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (tempWord) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [tempWord]);

  useEffect(() => {
    const handleClick = () => setShowDropdown(false);
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    return () => {
      if (tempWordTimer.current) clearTimeout(tempWordTimer.current);
    };
  }, []);

  const handleWordSelect = (w: string) => {
    setTempWord(w);
    setShowDropdown(false);
    if (tempWordTimer.current) clearTimeout(tempWordTimer.current);
    tempWordTimer.current = setTimeout(() => setTempWord(null), 2500);
  };

  const navigateWithTransition = useCallback((href: string) => {
    router.push(href);
  }, [router]);

  const hasSubNav =
    expandedCategory && (categorySubItems[expandedCategory]?.length ?? 0) > 0;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white">
      <div className="pb-1">
        <div className="relative flex items-center min-h-[56px] sm:min-h-[72px] lg:min-h-[80px] pt-1 lg:pt-2 pb-1 px-0 lg:px-[3cm]">
          {/* التصنيفات */}
          <nav className="flex-1 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-1/2 lg:-translate-y-1/2 flex items-center gap-3 sm:gap-4 md:gap-6 lg:gap-[2cm] text-[9px] sm:text-[10px] md:text-xs tracking-[0.15em] uppercase overflow-x-auto scrollbar-hide pr-2 lg:pr-0">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat && !selectedSubCategory;
              return (
                <button
                  key={cat}
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); navigateWithTransition(`/projects/${cat.toLowerCase()}`); }}
                  className={`flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive ? 'text-black' : 'text-[#949494] hover:text-black'
                  }`}
                >
                  {isActive && <Square />}
                  {cat}
                </button>
              );
            })}
          </nav>

          {hasSubNav && (
            <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:justify-center flex gap-2 sm:gap-3 lg:gap-[0.7cm] text-[9px] sm:text-[10px] lg:text-[11px] tracking-[0.15em] capitalize overflow-x-auto scrollbar-hide" style={{ top: 'calc(50% + 12px)' }}>
              {categorySubItems[expandedCategory!]
                .filter((sub) => sub)
                .map((sub) => {
                  const isActive =
                    selectedSubCategory?.toLowerCase() === sub.toLowerCase();
                  return (
                    <button
                      key={sub}
                      onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); navigateWithTransition(`/projects/${expandedCategory!.toLowerCase()}/${sub.toLowerCase()}`); }}
                      className="flex items-center gap-1 whitespace-nowrap shrink-0 text-black transition-colors cursor-pointer"
                    >
                      {isActive && <Square />}
                      {sub}
                    </button>
                  );
                })}
            </div>
          )}

          {/* زر البحث */}
          <div className="relative shrink-0 lg:absolute lg:right-[3cm] lg:top-1/2 lg:-translate-y-1/2 ml-2 lg:ml-0">
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setShowDropdown((prev) => !prev)}
              className="relative text-[9px] sm:text-[10px] lg:text-xs tracking-[0.15em] uppercase text-[#A7A7A7] w-[120px] sm:w-[150px] lg:w-[180px] text-left"
            >
              <svg
                className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 lg:w-3 lg:h-3 pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              {!showDropdown && (
                <span className="block pl-[14px] lg:pl-[18px] leading-4 whitespace-nowrap">
                  {tempWord ?? words[placeholderIndex].name}
                </span>
              )}
            </button>

            {/* القائمة المنسدلة */}
            <div
              ref={dropdownRef}
              onMouseDown={(e) => e.stopPropagation()}
              className={`absolute left-0 top-full mt-1 bg-white border border-black/10 shadow-md z-[9999] ${
                showDropdown
                  ? 'opacity-100 visible'
                  : 'opacity-0 invisible pointer-events-none'
              }`}
            >
              {words.map((w) => (
                <button
                  key={w.name}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    router.push(w.link);
                  }}
                  className="flex items-center gap-1.5 w-full text-left px-3 py-1 sm:py-0.5 text-[10px] sm:text-xs tracking-[0.15em] uppercase text-[#949494] hover:text-black whitespace-nowrap transition-colors cursor-pointer"
                >
                  {w.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
