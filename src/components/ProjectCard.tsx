'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import type { Project } from '@/data/projects';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  project: Project;
  index: number;
  onClick: (rect: DOMRect) => void;
}

export default function ProjectCard({ project, index, onClick }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (cardRef.current) {
      onClick(cardRef.current.getBoundingClientRect());
    }
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.fromTo(
      card,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: index * 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="project-card group"
    >
      <div
        className="relative overflow-hidden rounded-sm image-wrap cursor-pointer"
        onClick={handleClick}
        data-cursor-hover
      >
        <Image
          src={project.image}
          alt={project.title}
          width={800}
          height={600}
          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500" />
      </div>
      <div className="mt-3 px-1">
        <h3 className="text-sm font-light tracking-wider text-white/90">
          {project.title}
        </h3>
        <p className="text-xs tracking-widest text-white/40 mt-1 uppercase">
          {project.category} — {project.location}
        </p>
      </div>
    </div>
  );
}
