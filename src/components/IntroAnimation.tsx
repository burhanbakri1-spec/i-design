'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const lines = [
  { x1: 45, y1: 10, x2: 45, y2: 90, sw: 18 },
  { x1: 75, y1: 10, x2: 75, y2: 90, sw: 5 },
  { x1: 75, y1: 10, x2: 130, y2: 10, sw: 5 },
  { x1: 75, y1: 90, x2: 130, y2: 90, sw: 5 },
  { x1: 130, y1: 10, x2: 130, y2: 35, sw: 5 },
  { x1: 124, y1: 35, x2: 124, y2: 65, sw: 5 },
  { x1: 130, y1: 65, x2: 130, y2: 90, sw: 5 },
  { x1: 145, y1: 10, x2: 145, y2: 90, sw: 5 },
  { x1: 145, y1: 10, x2: 195, y2: 10, sw: 5 },
  { x1: 145, y1: 50, x2: 192, y2: 50, sw: 5 },
  { x1: 145, y1: 90, x2: 195, y2: 90, sw: 5 },
  { x1: 210, y1: 10, x2: 262, y2: 10, sw: 5 },
  { x1: 210, y1: 10, x2: 210, y2: 50, sw: 5 },
  { x1: 210, y1: 50, x2: 262, y2: 50, sw: 5 },
  { x1: 262, y1: 50, x2: 262, y2: 90, sw: 5 },
  { x1: 210, y1: 90, x2: 262, y2: 90, sw: 5 },
  { x1: 278, y1: 10, x2: 278, y2: 90, sw: 18 },
  { x1: 295, y1: 10, x2: 350, y2: 10, sw: 5 },
  { x1: 365, y1: 10, x2: 365, y2: 90, sw: 5 },
  { x1: 418, y1: 10, x2: 418, y2: 90, sw: 5 },
];

const menuItems = [
  'PROJECTS',
  ' NEWS',
  ' ABOUT',
  ' SUSTAINABILITY',
  'PEOPLE',
  'CAREERS',
  ' CONTACT',
];

export default function IntroAnimation() {
  const [phase, setPhase] = useState<'show' | 'screenHidden'>('show');
  const [blackScreenLift, setBlackScreenLift] = useState(false);
  const [logoStart, setLogoStart] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuEntered, setMenuEntered] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    requestAnimationFrame(() => {
      setBlackScreenLift(true);
      setLogoStart(true);
    });
    const hideTimer = setTimeout(() => {
      setPhase('screenHidden');
    }, 6000);

    return () => {
      clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    if (!menuVisible) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-logo-menu]')) { setMenuEntered(false); setTimeout(() => setMenuVisible(false), 300); }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuVisible]);

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {phase !== 'screenHidden' && (
        <div
          className={`absolute inset-0 bg-black transition-transform duration-[5000ms] ease-in-out ${
            blackScreenLift ? '-translate-y-full' : 'translate-y-0'
          }`}
        />
      )}
      <div
        data-logo-menu
        className={`fixed transition-all duration-[5000ms] ease-in-out ${
          logoStart || phase === 'screenHidden'
            ? 'left-[2cm] top-[-5px]'
            : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
        }`}
      >
        <button
          onClick={() => {
            if (menuVisible) {
              setMenuEntered(false);
              setTimeout(() => setMenuVisible(false), 300);
            } else {
              setMenuVisible(true);
              requestAnimationFrame(() => setMenuEntered(true));
            }
          }}
          className="cursor-pointer pointer-events-auto"
        >
          <div className="relative h-[62px] sm:h-[72px] scale-[0.5] origin-left">
            <svg
              viewBox="0 0 460 100"
              className={`h-full transition-all duration-300 ${menuVisible ? 'opacity-0' : ''} ${!menuVisible && logoHovered ? 'opacity-0 -translate-x-[4cm]' : ''}`}
              fill="none"
              onMouseEnter={() => setLogoHovered(true)}
              onMouseLeave={() => setLogoHovered(false)}
            >
              {lines.map((l, i) => (
                <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} strokeWidth={l.sw} strokeLinecap="square" className="transition-[stroke] duration-[5000ms]" stroke={logoStart ? 'black' : '#999'} />
              ))}
              <polyline points="295,18 295,90 350,90 350,50 328,50" strokeWidth={5} strokeLinecap="square" strokeLinejoin="miter" className="transition-[stroke] duration-[5000ms]" stroke={logoStart ? 'black' : '#999'} />
              <polyline points="365,90 365,78 377,78 377,66 389,66 389,54 401,54 401,42 413,42 413,30 418,30" strokeWidth={5} strokeLinecap="square" strokeLinejoin="miter" className="transition-[stroke] duration-[5000ms]" stroke={logoStart ? 'black' : '#999'} />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 ${menuVisible ? 'opacity-100' : ''} ${!menuVisible && logoHovered ? 'opacity-100' : ''} pointer-events-none -translate-x-[4cm]`}>
              <img
                src="/hamburger.png"
                alt=""
                className="h-full object-contain scale-[0.7]"
              />
            </div>
          </div>
        </button>
      </div>
      {menuVisible && (
        <div data-logo-menu className={`fixed left-[2cm] top-[72px] sm:top-[80px] w-[4cm] bg-white pointer-events-auto z-0 -translate-y-[0.3cm] transition-transform duration-300 ${menuEntered ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="py-5 -mt-[0.5cm] -ml-[0.3cm] text-xs tracking-[0.15em]">
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => {
                  const label = item.trim();
                  const pathname = window.location.pathname;
                  setMenuEntered(false);
                  if (
                    (label === 'PROJECTS' && pathname === '/') ||
                    (label === 'NEWS' && pathname.startsWith('/news')) ||
                    (label === 'SUSTAINABILITY' && pathname.startsWith('/sustainability')) ||
                    (label === 'PEOPLE' && pathname.startsWith('/people')) ||
                    (label === 'CAREERS' && pathname.startsWith('/careers'))
                  ) {
                    setTimeout(() => setMenuVisible(false), 300);
                    return;
                  }
                  if (label === 'ABOUT' && pathname.startsWith('/about')) {
                    setTimeout(() => {
                      setMenuVisible(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 300);
                    return;
                  }
                  const section = document.getElementById('projects-section') || document.getElementById('news-section');
                  const aboutSection = document.getElementById('about-section');
                  const careersSection = document.getElementById('careers-section');
                  if (section && (label === 'PROJECTS' || label === 'NEWS')) {
                    section.classList.add('animate-slide-out-right');
                  }
                  if (aboutSection && label === 'ABOUT') {
                    aboutSection.classList.add('animate-slide-out-bottom');
                  }
                  if (careersSection && label === 'CAREERS') {
                    careersSection.classList.add('animate-slide-out-bottom');
                  }
                  setTimeout(() => {
                    setMenuVisible(false);
                    sessionStorage.setItem('page-entrance', 'slide-in-left');
                    if (label === 'NEWS') {
                      router.push('/news');
                    } else if (label === 'PROJECTS') {
                      router.push('/');
                    } else if (label === 'ABOUT') {
                      router.push('/about');
                    } else if (label === 'SUSTAINABILITY') {
                      router.push('/sustainability');
                    } else if (label === 'PEOPLE') {
                      router.push('/people');
                    } else if (label === 'CAREERS') {
                      router.push('/careers');
                    }
                  }, 300);
                }}
                className="block text-[#949494] hover:text-black transition-colors cursor-pointer py-[3.5px]"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
