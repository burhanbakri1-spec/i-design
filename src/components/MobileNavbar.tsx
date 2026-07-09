'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { categories, categorySubItems } from '@/data/projects';

const words = [
  { name: 'COMPLETED', link: '/projects/completed' },
  { name: 'FRANCE', link: '/projects/france' },
  { name: 'EDUCATION', link: '/projects/education' },
  { name: 'MUSEUM', link: '/projects/museum' },
  { name: 'SUSTAINABILITY', link: '/projects/sustainability' },
];

interface Props {
  selectedCategory: string | null;
  selectedSubCategory: string | null;
  expandedCategory: string | null;
  onCategoryClick: (cat: string) => void;
  onSubCategoryClick: (cat: string, sub: string) => void;
}

export default function MobileNavbar({
  selectedCategory,
  selectedSubCategory,
  expandedCategory,
}: Props) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [tempWord, setTempWord] = useState<string | null>(null);
  const tempWordTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [expandedMobileCat, setExpandedMobileCat] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (tempWord) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [tempWord]);

  useEffect(() => {
    if (!menuOpen) setExpandedMobileCat(null);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    return () => {
      if (tempWordTimer.current) clearTimeout(tempWordTimer.current);
    };
  }, []);

  const handleSearchSelect = useCallback((link: string, name: string) => {
    setTempWord(name);
    setShowSearch(false);
    if (tempWordTimer.current) clearTimeout(tempWordTimer.current);
    tempWordTimer.current = setTimeout(() => setTempWord(null), 2500);
    router.push(link);
  }, [router]);

  const handleNavClick = useCallback((href: string) => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => router.push(href), 200);
  }, [router]);

  const menuVariants = {
    closed: { opacity: 0, x: '100%' },
    open: { opacity: 1, x: 0 },
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 lg:hidden transition-colors duration-300 ${
        scrolled || menuOpen ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between h-14 px-4">
        <div className="w-6" />

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="w-10 h-10 flex items-center justify-center"
            aria-label="Toggle search"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={`block w-5 h-[2px] bg-black transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
            <span className={`block w-5 h-[2px] bg-black transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-[2px] bg-black transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="px-4 pb-3 border-b border-black/10">
          <div className="flex flex-wrap gap-2">
            {words.map((w) => (
              <button
                key={w.name}
                onClick={() => handleSearchSelect(w.link, w.name)}
                className="text-[10px] tracking-[0.15em] uppercase text-[#949494] hover:text-black px-3 py-2 border border-black/10 transition-colors"
              >
                {w.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 top-14 bg-white z-40 overflow-y-auto"
          >
            <nav className="flex flex-col px-6 py-8">
              {categories.map((cat) => {
                const hasSub = (categorySubItems[cat]?.length ?? 0) > 0;
                const isExpanded = expandedMobileCat === cat;
                return (
                  <div key={cat} className="mb-2">
                    <button
                      onClick={() => {
                        if (hasSub) {
                          setExpandedMobileCat(isExpanded ? null : cat);
                        } else {
                          handleNavClick(`/projects/${cat.toLowerCase()}`);
                        }
                      }}
                      className={`w-full text-left py-4 text-sm tracking-[0.2em] uppercase border-b border-black/5 flex items-center justify-between transition-colors ${
                        selectedCategory === cat ? 'text-black font-medium' : 'text-[#666]'
                      }`}
                    >
                      {cat}
                      {hasSub && (
                        <span className={`text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                          ↓
                        </span>
                      )}
                    </button>
                    {hasSub && isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col pl-4 py-2">
                          {categorySubItems[cat]
                            .filter((sub) => sub)
                            .map((sub) => (
                              <button
                                key={sub}
                                onClick={() => handleNavClick(`/projects/${cat.toLowerCase()}/${sub.toLowerCase()}`)}
                                className={`text-left py-3 text-xs tracking-[0.2em] uppercase text-[#666] hover:text-black transition-colors`}
                              >
                                {sub}
                              </button>
                            ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}

              <div className="mt-4 space-y-1 border-t border-black/10 pt-6">
                {[
                  { label: 'NEWS', href: '/news' },
                  { label: 'ABOUT', href: '/about' },
                  { label: 'SUSTAINABILITY', href: '/sustainability' },
                  { label: 'PEOPLE', href: '/people' },
                  { label: 'CAREERS', href: '/careers' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.href)}
                    className="block w-full text-left py-4 text-sm tracking-[0.2em] uppercase text-[#666] hover:text-black transition-colors border-b border-black/5"
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
                  }}
                  className="block w-full text-left py-4 text-sm tracking-[0.2em] uppercase text-[#666] hover:text-black transition-colors"
                >
                  CONTACT
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}