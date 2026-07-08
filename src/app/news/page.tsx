'use client';

import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const items = ['News', 'Events', 'Awards', 'Lectures'];
const currentItem = 'News';

const newsItems = [
  {
    date: '25.06.2026',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1400&q=80',
    title: 'MONOCLE SPOTLIGHTS EAST SIDE COASTAL RESILIENCY AMONG GLOBAL WATERFRONT PROJECTS RETHINKING URBAN SHORELINES',
    description:
      'Monocle\u2019s July issue examines how cities are transforming their waterfronts into resilient, people-centered public spaces, spotlighting projects in Sydney, New York, and Kobe. Representing New York is the East Side Coastal Resiliency project \u2013 a 2.5-mile stretch of flood and storm protection along the East River in Manhattan, designed by BIG, Mathews Nielsen Landscape Architects, ONE Architecture & Urbanism, AKRF, and residents of the Lower East Side. The project weaves together flood barrier walls and gates, bridging berms, and pedestrian bridges with open lawns, picnic areas, tennis and basketball courts, and other amenities, building social infrastructure alongside a more resilient waterfront. Sections are now open, including East River Park, with the remainder slated to complete in 2027.',
    link: 'https://monocle.com',
  },
  {
    date: '19.06.2026',
    image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1400&q=80',
    title: 'BLOOMBERG SPOTLIGHTS GELEPHU INTERNATIONAL AIRPORT AND DOCK A AT ZURICH AIRPORT IN LOOK AT THE FUTURE OF AIR TRAVEL',
    description:
      'The Gelephu International Airport in Bhutan and Dock A at Zurich Airport in Switzerland are highlighted in a Bloomberg feature about the future of airport design. As part of a global shift towards a calmer, more human-centered air travel experience, Bloomberg spotlights BIG\u2019s two upcoming airport projects, pointing to their use of natural materials and biophilic elements.',
    link: 'https://bloomberg.com',
  },
  {
    date: '12.06.2026',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80',
    title: 'BIG JOINS CONVERSATIONS ON THE FUTURE OF HOUSING, SUSTAINABLE DESIGN, AND ENERGY AT FOLKEM\u00d8DET',
    description:
      'BIG participated in this year\u2019s Folkem\u00f8de (The People\u2019s Meeting \u2013 an annual political festival in Denmark celebrating democracy) as partner of the real estate industry\u2019s Vandkantsscene and contributed to discussions on how we will build, live and power our future.',
    link: 'https://ejendomswatch.dk',
  },
];

export default function NewsPage() {
  const router = useRouter();
  const [entranceClass, setEntranceClass] = useState('');

  useEffect(() => {
    const pe = sessionStorage.getItem('page-entrance');
    sessionStorage.removeItem('page-entrance');
    if (pe === 'slide-in-left') {
      setEntranceClass('animate-slide-in-left');
    } else {
      const dir = sessionStorage.getItem('news-direction');
      sessionStorage.removeItem('news-direction');
      setEntranceClass(dir === 'down' ? 'animate-slide-down' : 'animate-slide-up-from-below');
    }
  }, []);

  const navigateWithTransition = useCallback((href: string) => {
    const targetRaw = href === '/news' ? 'News' : href.split('/').pop()!;
    const target = targetRaw.charAt(0).toUpperCase() + targetRaw.slice(1);
    const currentIdx = items.indexOf(currentItem);
    const targetIdx = items.indexOf(target);
    const direction = targetIdx > currentIdx ? 'up' : 'down';
    sessionStorage.setItem('news-direction', direction);

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
        {items.map((item) => {
          const href = item === 'News' ? '/news' : `/news/${item.toLowerCase()}`;
          return (
            <button
              key={item}
              onClick={() => navigateWithTransition(href)}
              className={`flex items-center gap-1.5 ${item === 'News' ? 'text-black' : 'text-[#949494] hover:text-black'}`}
            >
              {item === 'News' && <span className="inline-block w-1.5 h-1.5 bg-black shrink-0" />}
              {item}
            </button>
          );
        })}
      </nav>
      <section className="relative pt-[40px] pb-[100px]">
        <h1 className="relative z-20 mb-5 -translate-x-1.5 bg-white px-7 pt-[26px] text-[55px] leading-[1.14em] uppercase md:mb-7 md:px-[70px] md:pt-20 lg:mb-[60px] lg:px-[100px] lg:pt-[120px] lg:text-[70px] xl:px-[130px] xl:text-[100px] -mt-[1cm]">
          News
        </h1>

        <div id="news-section" className={`px-7 md:px-[70px] lg:px-[100px] xl:px-[130px] max-w-[1600px] mx-auto ${entranceClass}`}>
          {newsItems.map((item, i) => (
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
