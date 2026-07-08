'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '@/data/projects';
import { getProjectDetail } from '@/data/projectDetails';

const ease = [0.65, 0, 0.35, 1] as const;

interface Props {
  projects: Project[];
}

function MetadataPanel({ project }: { project: Project }) {
  const detail = getProjectDetail(project.id, project);

  if (!detail) return null;

  return (
    <div className="space-y-5">
      {[
        { label: 'Client', value: detail.client },
        { label: 'Typology', value: detail.typology },
        { label: 'Size', value: detail.size },
        { label: 'Status', value: detail.status },
      ].map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.15 + i * 0.06 }}
        >
          <h4 className="text-[10px] lg:text-[11px] uppercase tracking-[0.15em] text-muted">
            {item.label}
          </h4>
          <p className="text-[13px] lg:text-sm text-foreground mt-0.5 leading-snug">
            {item.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function CollapsedCard({
  project,
  onToggle,
}: {
  project: Project;
  onToggle: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <motion.div
      key="collapsed"
      layout
      onClick={onToggle}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden bg-gray-100">
        {!loaded && !error && (
          <div className="aspect-[4/3] bg-gray-100" />
        )}
        {error ? (
          <div className="aspect-[4/3] flex items-center justify-center bg-gray-100 text-[10px] uppercase tracking-[0.2em] text-black/40">
            Image unavailable
          </div>
        ) : (
          <motion.img
            layoutId={`image-${project.id}`}
            src={project.image}
            alt={project.title}
            onLoad={() => setLoaded(true)}
            onError={() => { setLoaded(true); setError(true); }}
            className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
      </div>
      <div className="mt-3 md:mt-4 text-center">
        <h3 className="text-sm md:text-base font-normal text-foreground leading-snug">
          {project.title}
        </h3>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted mt-0.5">
          {project.location}
        </p>
      </div>
    </motion.div>
  );
}

function ExpandedCard({
  project,
  onToggle,
}: {
  project: Project;
  onToggle: () => void;
}) {
  const [error, setError] = useState(false);

  return (
    <motion.div
      key="expanded"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease }}
    >
      <div className="relative flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10 py-4 lg:py-8">
        <button
          onClick={onToggle}
          className="absolute top-0 right-0 z-10 size-8 flex items-center justify-center text-muted hover:text-foreground transition-colors"
          aria-label="Close expanded view"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
          className="w-full lg:w-[240px] shrink-0"
        >
          <MetadataPanel project={project} />
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="relative overflow-hidden bg-gray-100">
            {error ? (
              <div className="aspect-[4/3] flex items-center justify-center bg-gray-100 text-[10px] uppercase tracking-[0.2em] text-black/40">
                Image unavailable
              </div>
            ) : (
              <motion.img
                layoutId={`image-${project.id}`}
                src={project.image}
                alt={project.title}
                onError={() => setError(true)}
                className="w-full object-cover"
                style={{ maxHeight: '65vh' }}
              />
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
          className="w-full lg:w-[280px] shrink-0"
        >
          <p className="text-[13px] lg:text-sm leading-relaxed text-foreground/70">
            {project.description}
          </p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease, delay: 0.35 }}
            className="mt-6 pt-4 border-t border-black/5"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted hover:text-foreground cursor-pointer transition-colors duration-300">
              View project &rarr;
            </span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function ModernPortfolioGrid({ projects }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  if (projects.length === 0) {
    return (
      <section className="py-24 px-4 md:px-6 max-w-[1600px] mx-auto">
        <p className="text-foreground/40 text-sm tracking-wider text-center">
          No projects found.
        </p>
      </section>
    );
  }

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-16 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12">
        {projects.map((project) => {
          const isExpanded = expandedId === project.id;
          const spanClass = isExpanded
            ? 'md:col-span-2 lg:col-span-3 xl:col-span-4'
            : '';

          return (
            <motion.div
              key={project.id}
              layout
              transition={{ duration: 0.6, ease }}
              className={spanClass}
            >
              <AnimatePresence mode="popLayout">
                {isExpanded ? (
                  <ExpandedCard
                    key="expanded"
                    project={project}
                    onToggle={() => toggleExpand(project.id)}
                  />
                ) : (
                  <CollapsedCard
                    key="collapsed"
                    project={project}
                    onToggle={() => toggleExpand(project.id)}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
