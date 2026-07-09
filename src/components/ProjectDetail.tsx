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

export default function ProjectDetail({ project, onBack }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    sectionsRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom-=50',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [project]);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      <div className="relative h-[70vh] overflow-hidden image-wrap">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-background" />
        <button
          onClick={onBack}
          className="absolute top-8 left-8 z-20 px-6 py-2 border border-white/20 text-white/80 text-sm tracking-wider hover:bg-white/10 transition-colors rounded-none"
        >
          ← Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10">
        <div ref={addToRefs} className="mb-8">
          <h1 className="text-5xl md:text-7xl font-thin tracking-[0.05em] text-white">
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-6 mt-4 text-sm tracking-wider text-white/50">
            <span>{project.category}</span>
            <span>{project.location}</span>
            <span>{project.year}</span>
          </div>
        </div>

        <div ref={addToRefs} className="max-w-3xl mb-16">
          <p className="text-lg leading-relaxed font-light text-white/70">
            {project.description}
          </p>
        </div>

        <div ref={addToRefs} className="mb-24">
          <h3 className="text-sm tracking-[0.2em] text-white/40 mb-6 uppercase">Gallery</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 lg:gap-[0.225cm]">
            {project.images.map((img, i) => (
              <div key={i} className="relative overflow-hidden aspect-[4/3] image-wrap">
                <Image
                  src={img}
                  alt={`${project.title} ${i + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
