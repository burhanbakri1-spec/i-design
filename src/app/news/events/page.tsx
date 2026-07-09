'use client';

import { useCallback, useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const items = [
  {
    date: '20.06.2026',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&q=80',
    title: 'BIG AT VENICE ARCHITECTURE BIENNALE 2026',
    description:
      'BIG participated in the 19th International Architecture Exhibition at La Biennale di Venezia, showcasing the studio\u2019s latest research and completed works.',
    link: 'https://biennale.com',
  },
  {
    date: '15.05.2026',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1400&q=80',
    title: '3DAYSOFDESIGN 2026 \u2013 AIR\u00b2 LAUNCH',
    description:
      'European clean technology company Everyday\u00b2 unveiled its new product Air\u00b2 at BIG HQ during 3daysofdesign.',
    link: 'https://everyday.io',
  },
];

export default function EventsPage() {
  const router = useRouter();
  const [entranceClass, setEntranceClass] = useState('');

  useEffect(() => {
    const pe = sessionStorage.getItem('page-entrance');
    sessionStorage.removeItem('page-entrance');
    if (pe === 'slide-in-left') {
      setEntranceClass('animate-slide-in-left');
    }
  }, []);
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
      <nav className="lg:hidden flex gap-4 overflow-x-auto px-4 py-3 text-xs uppercase tracking-[0.2em] z-30 bg-white border-b border-black/5 sticky top-14">
        {['News', 'Events', 'Awards', 'Lectures'].map((item) => {
          const href = item === 'News' ? '/news' : `/news/${item.toLowerCase()}`;
          return (
            <button
              key={item}
              onClick={() => navigateWithTransition(href)}
              className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 ${item === 'Events' ? 'text-black' : 'text-[#949494] hover:text-black'}`}
            >
              {item === 'Events' && <span className="inline-block w-1.5 h-1.5 bg-black shrink-0" />}
              {item}
            </button>
          );
        })}
      </nav>
      <nav className="hidden lg:flex fixed flex-col gap-[26px] text-xs uppercase tracking-[0.2em] z-30" style={{ top: '291px', left: '38px' }}>
        {['News', 'Events', 'Awards', 'Lectures'].map((item) => {
          const href = item === 'News' ? '/news' : `/news/${item.toLowerCase()}`;
          return (
            <button
              key={item}
              onClick={() => navigateWithTransition(href)}
              className={`flex items-center gap-1.5 ${item === 'Events' ? 'text-black' : 'text-[#949494] hover:text-black'}`}
            >
              {item === 'Events' && <span className="inline-block w-1.5 h-1.5 bg-black shrink-0" />}
              {item}
            </button>
          );
        })}
      </nav>
      <section className="relative pt-[40px] pb-[100px]">
        <h1 className="relative z-20 mb-5 -translate-x-1.5 bg-white px-4 pt-[26px] text-[clamp(2rem,10vw,55px)] leading-[1.14em] uppercase md:mb-7 md:px-[70px] md:pt-20 lg:mb-[60px] lg:px-[100px] lg:pt-[120px] lg:text-[70px] xl:px-[130px] xl:text-[100px] lg:-mt-[38px]">
          Events
        </h1>

        <div id="news-section" className={`px-4 md:px-[70px] lg:px-[100px] xl:px-[130px] max-w-[1600px] mx-auto ${entranceClass}`}>
          {items.map((item, i) => (
            <article key={i} className="mb-16 lg:mb-[80px] grid grid-cols-1 lg:grid-cols-[68px_2fr_1fr] gap-x-10 gap-y-4">
              <span className="text-xs text-[#898989] uppercase tabular-nums self-start lg:ml-[5cm]">
                {item.date}
              </span>
              <div className="flex justify-center">
                <Image
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  alt={item.title}
                  className="relative w-full lg:w-[80%] object-cover"
                  src={item.image}
                  width={1400}
                  height={800}
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