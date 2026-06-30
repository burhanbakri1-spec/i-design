'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { categories, categorySubItems } from '@/data/projects';

const words = ['COMPLETED', 'FRANCE', 'EDUCATION', 'MUSEUM', 'SUSTAINABILITY'];

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
    const section = document.getElementById('projects-section');
    if (section) {
      section.classList.remove('animate-slide-down');
      section.classList.add('animate-slide-up');
    }
    setTimeout(() => {
      router.push(href);
    }, 2350);
  }, [router]);

  const hasSubNav =
    expandedCategory && (categorySubItems[expandedCategory]?.length ?? 0) > 0;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white">
      <div className="pb-1">
        <div className="relative flex items-center min-h-[72px] sm:min-h-[80px] pt-2 pb-1">
          {/* التصنيفات */}
          <nav className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 mt-[-0.3cm] flex items-center justify-center gap-[2cm] text-xs tracking-[0.15em] uppercase overflow-x-auto">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat && !selectedSubCategory;
              return (
                <button
                  key={cat}
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); navigateWithTransition(`/projects/${cat.toLowerCase()}`); }}
                  className={`flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
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
            <div className="absolute left-1/2 -translate-x-1/2 flex gap-[0.7cm] justify-center text-[10px] sm:text-[11px] tracking-[0.15em] capitalize overflow-x-auto" style={{ top: 'calc(50% + 12px)' }}>
              {categorySubItems[expandedCategory!]
                .filter((sub) => sub)
                .map((sub) => {
                  const isActive =
                    selectedSubCategory?.toLowerCase() === sub.toLowerCase();
                  return (
                    <button
                      key={sub}
                      onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); navigateWithTransition(`/projects/${expandedCategory!.toLowerCase()}/${sub.toLowerCase()}`); }}
                      className="flex items-center gap-1.5 whitespace-nowrap text-black transition-colors cursor-pointer"
                    >
                      {isActive && <Square />}
                      {sub}
                    </button>
                  );
                })}
            </div>
          )}

          {/* زر البحث */}
          <div className="absolute right-[3cm] top-1/2 -translate-y-1/2 mt-[-0.3cm]">
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setShowDropdown((prev) => !prev)}
              className="relative text-xs tracking-[0.15em] uppercase min-w-[90px] sm:min-w-[100px] h-4 text-[#A7A7A7]"
            >
              {/* أيقونة البحث ثابتة */}
              <svg
                className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              {!showDropdown && (
                <span className="block text-left pl-[16px] leading-4 whitespace-nowrap">
                  {tempWord ?? words[placeholderIndex]}
                </span>
              )}
            </button>

            {/* القائمة المنسدلة مع رفع 2سم وإزاحة 1سم */}
            <div
              ref={dropdownRef}
              onMouseDown={(e) => e.stopPropagation()}
              className={`fixed right-[-1cm] top-[0.5cm] bg-white border border-black/10 shadow-md z-[9999] transform transition-transform duration-500 ${
                showDropdown
                  ? 'translate-x-0 opacity-100 visible'
                  : 'translate-x-full opacity-0 invisible pointer-events-none'
              }`}
            >
              {words.map((w) => (
                <button
                  key={w}
                  onClick={() => {
                    handleWordSelect(w);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    navigateWithTransition(`/projects/${w.toLowerCase()}`);
                  }}
                  className="block w-full text-left px-3 py-0.5 text-[10px] tracking-[0.15em] uppercase text-[#A7A7A7] hover:text-black whitespace-nowrap transition-colors cursor-pointer"
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
