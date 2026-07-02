'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

const items = [
  {
    date: '04.06.2026',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1400&q=80',
    title: 'BJARKE INGELS SPEAKS AT BREAD AND HEART FESTIVAL IN TIRANA',
    description:
      'Bjarke Ingels participated in the second edition of the Bread & Heart Festival in Tirana, delivering a keynote titled \u201cUtopian Pragmatism: Materializing Mindfulness.\u201d',
    link: 'https://archdaily.com',
  },
  {
    date: '14.04.2026',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80',
    title: 'BJARKE INGELS AND AMY ASTLEY IN CONVERSATION AT THE GUGGENHEIM NEW YORK',
    description:
      'To celebrate the release of Phaidon\u2019s new monograph BIG Atlas, Bjarke Ingels and Architectural Digest Editor-in-Chief Amy Astley sat down for a fireside chat at the Guggenheim.',
    link: 'https://phaidon.com',
  },
];

export default function LecturesPage() {
  const router = useRouter();
  const [entranceClass] = useState(() => {
    if (typeof window !== 'undefined') {
      const pageEntrance = sessionStorage.getItem('page-entrance');
      if (pageEntrance === 'slide-in-left') {
        sessionStorage.removeItem('page-entrance');
        return 'animate-slide-in-left';
      }
    }
    return 'animate-slide-up-from-below';
  });
  const navigateWithTransition = useCallback((href: string) => {
    const section = document.getElementById('news-section');
    if (section) {
      section.classList.remove('animate-slide-up-from-below', 'animate-slide-down', 'animate-slide-in-left');
      section.classList.add('animate-slide-up');
    }
    setTimeout(() => {
      router.push(href);
    }, 400);
  }, [router]);

  return (
    <div>
      <nav className="fixed flex flex-col gap-[0.7cm] text-xs uppercase tracking-[0.2em] z-30" style={{ top: '7.7cm', left: '1cm' }}>
        {['News', 'Events', 'Awards', 'Lectures'].map((item) => {
          const href = item === 'News' ? '/news' : `/news/${item.toLowerCase()}`;
          return (
            <button
              key={item}
              onClick={() => navigateWithTransition(href)}
              className={`flex items-center gap-1.5 ${item === 'Lectures' ? 'text-black' : 'text-[#949494] hover:text-black'}`}
            >
              {item === 'Lectures' && <span className="inline-block w-1.5 h-1.5 bg-black shrink-0" />}
              {item}
            </button>
          );
        })}
      </nav>
      <section className="relative pt-[40px] pb-[100px]">
        <h1 className="relative z-20 mb-5 -translate-x-1.5 bg-white px-7 pt-[26px] text-[55px] leading-[1.14em] uppercase md:mb-7 md:px-[70px] md:pt-20 lg:mb-[60px] lg:px-[100px] lg:pt-[120px] lg:text-[70px] xl:px-[130px] xl:text-[100px] -mt-[1cm]">
          Lectures
        </h1>

        <div id="news-section" className={`px-7 md:px-[70px] lg:px-[100px] xl:px-[130px] max-w-[1600px] mx-auto ${entranceClass}`}>
          {items.map((item, i) => (
            <article key={i} className="mb-16 lg:mb-[80px] grid grid-cols-1 lg:grid-cols-[68px_2fr_1fr] gap-x-10 gap-y-4">
              <span className="text-xs text-[#898989] uppercase tabular-nums self-start ml-[5cm]">
                {item.date}
              </span>
              <div className="flex justify-center ml-[3cm]">
                <img
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  alt={item.title}
                  className="relative h-full w-[80%] bg-transparent object-cover transition-opacity duration-75 ease-in-out"
                  src={item.image}
                />
              </div>
              <div>
                <h2 className="mb-3 text-sm text-[#1b1b1b] uppercase lg:mb-5">
                  {item.title}
                </h2>
                <p className="mb-3 last:mb-0 text-sm leading-relaxed text-[#666]">
                  {item.description}
                </p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors mt-4 inline-block"
                >
                  {item.link.replace('https://', '')}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
