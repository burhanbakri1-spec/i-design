'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '@/data/projects';
import { getProjectDetail } from '@/data/projectDetails';

interface BigGridProps {
  projects: Project[];
}

// Spring configuration for liquid, organic layout transitions
const spring = {
  type: "spring" as const,
  stiffness: 120,
  damping: 20,
};

function ExpandedRow({ project }: { project: Project }) {
  const detail = getProjectDetail(project.id, project);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ ...spring, opacity: { duration: 0.2 } }}
      className="overflow-hidden"
    >
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 py-8 md:py-10 border-t border-b border-black/10 mt-4">
        {/* Image gallery - horizontal scroll */}
        <div className="flex-1 min-w-0">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {project.images.map((img, i) => (
              <div
                key={i}
                className="relative w-[240px] sm:w-[280px] md:w-[320px] shrink-0 aspect-[4/3] overflow-hidden bg-gray-50"
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        {/* Details panel */}
        <div className="w-full md:w-[280px] lg:w-[320px] shrink-0 flex flex-col justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-normal text-black leading-tight">
              {project.title}
            </h3>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted mt-2">
              {project.location} <span className="mx-1">—</span> {project.year}
            </p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted mt-1">
              {project.category}{project.subCategory ? <span className="mx-1">/</span> : ''}{project.subCategory}
            </p>
            <p className="text-sm text-black/50 mt-4 leading-relaxed border-l-2 border-black/10 pl-4">
              {project.description}
            </p>
            {detail && (
              <div className="mt-4 space-y-1.5">
                <div className="flex gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-muted min-w-[60px]">Client</span>
                  <span className="text-[11px] text-black">{detail.client}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-muted min-w-[60px]">Size</span>
                  <span className="text-[11px] text-black">{detail.size}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-muted min-w-[60px]">Status</span>
                  <span className="text-[11px] text-black">{detail.status}</span>
                </div>
              </div>
            )}
          </div>
          {/* Action links */}
          <div className="flex gap-4 mt-[5000px] pt-4 border-t border-black/5">
            <span className="text-[10px] uppercase tracking-[0.25em] text-black/30 hover:text-black cursor-pointer transition-colors duration-300">
              View Project →
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-black/30 hover:text-black cursor-pointer transition-colors duration-300">
              Share →
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function BigGrid({ projects }: BigGridProps) {
  // Track multiple open projects using a Set of active IDs.
  // This allows accumulation: clicking a new project adds it while
  // previously expanded items remain open.
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleProject = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  if (projects.length === 0) {
    return (
      <section className="py-24 px-4 md:px-6 max-w-[1600px] mx-auto">
        <p className="text-black/40 text-sm tracking-wider text-center">No projects found.</p>
      </section>
    );
  }

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-16 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <AnimatePresence mode="popLayout">
          {projects.map((project) => {
            const isExpanded = expandedIds.has(project.id);
            return (
              <motion.div
                key={project.id}
                layout
                transition={spring}
                // Expanded items span the full grid width, morphing into a horizontal row
                // while collapsed items remain as standard grid cells.
                className={isExpanded ? 'md:col-span-2 lg:col-span-3' : ''}
              >
                {/* Card / thumbnail */}
                <motion.div
                  layout
                  transition={spring}
                  onClick={() => toggleProject(project.id)}
                  className="cursor-pointer group"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gray-50">
                    <motion.img
                      layout
                      transition={spring}
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3 md:mt-4 flex justify-between items-start">
                    <div>
                      <h3 className="text-sm md:text-base font-normal text-black leading-snug">
                        {project.title}
                      </h3>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted mt-0.5">
                        {project.location}
                      </p>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted shrink-0 ml-2">
                      {project.year}
                    </span>
                  </div>
                </motion.div>
                {/* Expanded horizontal row content */}
                <AnimatePresence initial={false}>
                  {isExpanded && <ExpandedRow key="expanded" project={project} />}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
