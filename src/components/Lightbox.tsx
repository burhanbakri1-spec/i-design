'use client';

import { useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import type { Project } from '@/data/projects';

interface Props {
  project: Project;
  onClose: () => void;
}

export default function Lightbox({ project, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    const handleScroll = () => onClose();
    window.addEventListener('scroll', handleScroll, { once: true });
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleKeyDown, onClose]);

  const meta = [
    { label: 'YEAR', value: project.year },
    { label: 'CLIENT', value: 'Vestre A/S' },
    { label: 'TYPOLOGY', value: project.subCategory || project.category },
    { label: 'SIZE M2/FT2', value: '7,000 / 75,000' },
    { label: 'STATUS', value: 'Completed' },
  ];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] bg-white overflow-y-auto"
      style={{ animation: 'fadeIn 0.3s ease' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <main className="w-full px-10 pt-12 pb-20 min-h-screen">
        <div className="grid grid-cols-12 gap-10 max-w-[1400px] mx-auto">
          <aside className="col-span-12 md:col-span-3 lg:col-span-2 text-right">
            <div className="text-[40px] font-bold text-black leading-none mb-6">+</div>
            <h1 className="text-2xl font-normal text-black leading-tight mb-1">{project.title}</h1>
            <p className="text-[11px] tracking-[0.1em] text-black/40 uppercase mb-8">{project.location}</p>
            {meta.map((m) => (
              <div key={m.label} className="mb-4">
                <p className="text-[10px] tracking-[0.1em] text-black/30 uppercase mb-1">{m.label}</p>
                <p className="text-[12px] text-black">{m.value}</p>
              </div>
            ))}
          </aside>

          <section className="col-span-12 md:col-span-9 lg:col-span-7">
            <div className="relative w-full aspect-[4/3] lg:aspect-[16/10] overflow-hidden rounded image-wrap">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 60vw"
              />
            </div>
          </section>

          <aside className="col-span-12 lg:col-span-3">
            <div className="text-[13px] leading-relaxed text-[#333] space-y-4">
              {project.description.split('. ').map((sentence, i) => (
                <p key={i}>{sentence}{i < project.description.split('. ').length - 1 ? '.' : ''}</p>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
