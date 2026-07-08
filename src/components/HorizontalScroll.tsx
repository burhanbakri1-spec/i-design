'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import type { Project } from '@/data/projects';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  project: Project;
  onBack: () => void;
}

export default function HorizontalScroll({ project, onBack }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    const totalScroll = track.scrollWidth - window.innerWidth;

    if (totalScroll <= 0) return;

    gsap.to(track, {
      x: -totalScroll,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${totalScroll}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [project]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-background"
    >
      <button
        onClick={onBack}
        className="fixed top-8 left-8 z-50 px-6 py-2 border border-white/20 text-white/80 text-sm tracking-wider hover:bg-white/10 transition-colors rounded-none"
      >
        ← Back to Projects
      </button>

      <div
        ref={trackRef}
        className="flex h-screen will-change-transform"
        style={{ gap: '0' }}
      >
        <div className="min-w-[100vw] h-full flex items-center justify-center px-24">
          <div className="max-w-2xl">
            <p className="text-sm tracking-[0.3em] text-white/40 uppercase mb-4">
              {project.category}
            </p>
            <h2 className="text-6xl md:text-8xl font-thin tracking-[0.02em] text-white mb-6">
              {project.title}
            </h2>
            <p className="text-lg font-light text-white/60 leading-relaxed">
              {project.description}
            </p>
            <div className="flex gap-6 mt-6 text-sm tracking-wider text-white/40">
              <span>{project.location}</span>
              <span>{project.year}</span>
            </div>
          </div>
        </div>

        {project.images.map((img, i) => (
          <div
            key={i}
            className="min-w-[80vw] h-full flex items-center justify-center p-8"
          >
            <div className="relative w-full h-[80vh] overflow-hidden image-wrap">
              <Image
                src={img}
                alt={`${project.title} gallery ${i + 1}`}
                fill
                className="object-cover"
                priority={i === 0}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
