'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Project } from '@/data/projects';
import { getProjectDetail } from '@/data/projectDetails';

const spring = {
  type: "spring" as const,
  stiffness: 120,
  damping: 20,
};

function ShareButtons({ projectId, projectTitle }: { projectId: string; projectTitle: string }) {
  const [url, setUrl] = useState(`https://big.dk/projects/${projectId}`);
  useEffect(() => { setUrl(window.location.href); }, []);
  const subject = encodeURIComponent(projectTitle);
  const shareUrl = encodeURIComponent(url);

  return (
    <div className="flex gap-1 pt-1 lg:justify-end">
      <a href={`mailto:?body=${shareUrl}&subject=${subject}`} target="_blank" title={`Share ${projectTitle} via email`}
        className="flex h-4 w-4 shrink-0 items-center justify-center bg-black p-[2px] text-white hover:opacity-70 transition-opacity">
        <svg aria-label="Email" className="w-full h-full" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM20 7.23792L12.0718 14.338L4 7.21594V19H20V7.23792ZM4.51146 5L12.0619 11.662L19.501 5H4.51146Z"/></svg>
      </a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" title="Share on Facebook"
        className="flex h-4 w-4 shrink-0 items-center justify-center bg-black p-[2px] text-white hover:opacity-70 transition-opacity">
        <svg aria-label="Facebook" className="w-full h-full" fill="currentColor" viewBox="0 0 24 24"><path d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47062 14 5.5 16 5.5H17.5V2.1401C17.1743 2.09685 15.943 2 14.6429 2C11.9284 2 10 3.65686 10 6.69971V9.5H7V13.5H10V22H14V13.5Z"/></svg>
      </a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" title="Share on LinkedIn"
        className="flex h-4 w-4 shrink-0 items-center justify-center bg-black p-[2px] text-white hover:opacity-70 transition-opacity">
        <svg aria-label="LinkedIn" className="w-full h-full" fill="currentColor" viewBox="0 0 24 24"><path d="M6.94048 4.99993C6.94011 5.81424 6.44608 6.54702 5.69134 6.85273C4.9366 7.15845 4.07187 6.97605 3.5049 6.39155C2.93793 5.80704 2.78195 4.93715 3.1105 4.19207C3.43906 3.44699 4.18654 2.9755 5.00048 2.99993C6.08155 3.03238 6.94097 3.91837 6.94048 4.99993ZM7.00048 8.47993H3.00048V20.9999H7.00048V8.47993ZM13.3205 8.47993H9.34048V20.9999H13.2805V14.4299C13.2805 10.7699 18.0505 10.4299 18.0505 14.4299V20.9999H22.0005V13.0699C22.0005 6.89993 14.9405 7.12993 13.2805 10.1599L13.3205 8.47993Z"/></svg>
      </a>
      <a href={`https://x.com/share?url=${shareUrl}`} target="_blank" title="Share on X"
        className="flex h-4 w-4 shrink-0 items-center justify-center bg-black text-white hover:opacity-70 transition-opacity">
        <svg aria-label="X" className="h-[10px] w-[10px]" fill="currentColor" viewBox="0 0 24 24"><path d="M18.2048 2.25H21.5128L14.2858 10.51L22.7878 21.75H16.1308L10.9168 14.933L4.95084 21.75H1.64084L9.37084 12.915L1.21484 2.25H8.04084L12.7538 8.481L18.2048 2.25ZM17.0438 19.77H18.8768L7.04484 4.126H5.07784L17.0438 19.77Z"/></svg>
      </a>
    </div>
  );
}

function MetadataPanel({ detail, project, className }: { detail: NonNullable<ReturnType<typeof getProjectDetail>>; project: Project; className?: string }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <div>
        <h4 className="text-[10px] text-[#797979] uppercase lg:text-[12px]">Client</h4>
        <p className="text-[10px] leading-none text-black uppercase lg:text-sm lg:max-w-[180px]">{detail.client}</p>
        <h4 className="mt-3 text-[10px] leading-none text-[#797979] uppercase lg:mt-4 lg:text-[12px]">Typology</h4>
        <p className="text-[10px] text-black uppercase lg:text-sm lg:max-w-[180px]">{detail.typology}</p>
        <h4 className="mt-3 text-[10px] leading-none text-[#797979] uppercase lg:mt-4 lg:text-[12px]">Size</h4>
        <p className="text-[10px] text-black uppercase lg:text-sm lg:max-w-[180px]">{detail.size}</p>
        <h4 className="mt-3 text-[10px] leading-none text-[#797979] uppercase lg:mt-4 lg:text-[12px]">Status</h4>
        <p className="text-[10px] text-black uppercase lg:text-sm lg:max-w-[180px]">{detail.status}</p>
      </div>
      <div className="mt-auto pt-[1.8cm]">
        <div className="text-[11px] text-[#797979] uppercase">Share</div>
        <ShareButtons projectId={project.id} projectTitle={project.title} />
      </div>
    </div>
  );
}

interface Props {
  project: Project;
  compact?: boolean;
}

export default function ProjectDetailView({ project, compact = false }: Props) {
  const detail = getProjectDetail(project.id, project);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);
  const galleryDragRef = useRef<HTMLDivElement>(null);
  const isGalleryDraggingRef = useRef(false);
  const galleryDragStartX = useRef(0);
  const galleryDragScrollLeft = useRef(0);

  const slideHeight = compact ? '70vh' : '91vh';

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDraggingRef.current = true;
    dragStartX.current = e.pageX;
    dragScrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = 'grabbing';
    scrollRef.current.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    e.preventDefault();
    const dx = e.pageX - dragStartX.current;
    scrollRef.current.scrollLeft = dragScrollLeft.current - dx;
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!scrollRef.current) return;
    isDraggingRef.current = false;
    scrollRef.current.style.cursor = '';
    scrollRef.current.style.removeProperty('user-select');
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!scrollRef.current) return;
    isDraggingRef.current = false;
    scrollRef.current.style.cursor = '';
    scrollRef.current.style.removeProperty('user-select');
  }, []);

  const handleGalleryMouseDown = useCallback((e: React.MouseEvent) => {
    if (!galleryDragRef.current) return;
    e.stopPropagation();
    isGalleryDraggingRef.current = true;
    galleryDragStartX.current = e.pageX;
    galleryDragScrollLeft.current = galleryDragRef.current.scrollLeft;
    galleryDragRef.current.style.cursor = 'grabbing';
    galleryDragRef.current.style.userSelect = 'none';
  }, []);

  const handleGalleryMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isGalleryDraggingRef.current || !galleryDragRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    const dx = e.pageX - galleryDragStartX.current;
    galleryDragRef.current.scrollLeft = galleryDragScrollLeft.current - dx;
  }, []);

  const handleGalleryMouseUp = useCallback(() => {
    if (!galleryDragRef.current) return;
    isGalleryDraggingRef.current = false;
    galleryDragRef.current.style.cursor = '';
    galleryDragRef.current.style.removeProperty('user-select');
  }, []);

  const handleGalleryMouseLeave = useCallback(() => {
    if (!galleryDragRef.current) return;
    isGalleryDraggingRef.current = false;
    galleryDragRef.current.style.cursor = '';
    galleryDragRef.current.style.removeProperty('user-select');
  }, []);

  if (!detail) {
    return (
      <div className="flex items-center justify-center px-7 md:px-[70px] lg:px-[100px] xl:px-[130px] py-16">
        <p className="text-[15px] leading-relaxed text-black/70">{project.description}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        ref={scrollRef}
        className={`flex flex-col overflow-x-hidden overflow-y-scroll select-none ${compact ? 'max-h-[70vh]' : 'lg:max-h-[91vh]'} lg:flex-row lg:overflow-x-scroll lg:overflow-y-hidden cursor-grab no-scrollbar`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ willChange: 'height' }}
      >
        {/* SLIDE 1: Hero image + project info */}
        <div className="big-project-view w-screen shrink-0 flex flex-col lg:flex-row lg:py-24 lg:px-[5vw] max-lg:mx-[5vw] max-lg:justify-center">
          {/* Desktop: text left, image right */}
          <div className="hidden lg:flex lg:flex-row lg:w-full lg:gap-16 lg:items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...spring }}
              className="flex flex-col items-end text-right shrink-0 -ml-[2cm]"
              style={{ width: '280px', minHeight: slideHeight }}
            >
              <div className="size-[50px] bg-black flex items-center justify-center">
                <img src="/screenshot.png" alt="" className="h-[20px] w-[20px] object-contain" />
              </div>
              <div className="mt-6">
                <h1 className="text-[18px] leading-5 font-normal break-words">{project.title}</h1>
                <p className="mt-1 text-[15px] text-[#797979] uppercase">{project.location}</p>
              </div>
              <MetadataPanel detail={detail} project={project} className="mt-10 text-right" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative select-none drag-none"
            >
              <div className={`relative overflow-hidden select-none drag-none`} style={{ height: slideHeight }}>
                <img
                  src={project.image}
                  alt={project.title}
                  className="drag-none h-full w-auto object-cover select-none"
                  style={{ height: slideHeight }}
                  draggable={false}
                />
              </div>
            </motion.div>
          </div>

          {/* Mobile: image + text side by side */}
          <div className="lg:hidden w-full flex flex-row items-stretch min-h-[40vh]">
            <div className="relative select-none drag-none flex-1 min-w-0 overflow-hidden">
              <div className="relative w-full h-full overflow-hidden select-none drag-none">
                <img
                  src={project.image}
                  alt={project.title}
                  className="drag-none w-full h-full object-cover select-none"
                  draggable={false}
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-between px-4 py-2">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...spring, delay: 0.15 }}
                  className="flex flex-nowrap"
                >
                  <div className="size-[20px] bg-black shrink-0 flex items-center justify-center">
                    <img src="/screenshot.png" alt="" className="h-[8px] w-[8px] object-contain" />
                  </div>
                  <div className="ml-[8px]">
                    <h1 className="text-[11px] leading-[11px] font-normal break-words">
                      {project.title}
                    </h1>
                    <p className="mt-[2px] text-[9px] text-[#797979] uppercase">
                      {project.location}
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...spring, delay: 0.25 }}
                  className="mt-3"
                >
                  <MetadataPanel detail={detail} project={project} className="text-[9px]" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Remaining images */}
        {project.images.slice(1).map((img, i) => (
          <div key={i} className="big-project-view relative w-screen shrink-0 flex flex-col lg:flex-row lg:items-start lg:gap-[5vw] lg:gap-16 lg:py-24 lg:px-[5vw] max-lg:mx-[5vw] max-lg:justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative select-none drag-none max-lg:w-full"
            >
              <div className="max-w-[90vw] min-w-[90vw] lg:min-w-0 relative overflow-hidden select-none drag-none" style={{ height: slideHeight }}>
                <img
                  src={img}
                  alt={`${project.title} ${i + 2}`}
                  className="drag-none w-full h-full object-cover select-none max-lg:max-h-[40vh]"
                  style={{ height: slideHeight, width: 'auto' }}
                  draggable={false}
                />
                <span className="absolute bottom-4 right-4 text-[10px] leading-[10px] uppercase select-none">
                  <span className="text-[#797979]">{String(i + 2).padStart(2, '0')}</span>/{String(project.images.length).padStart(2, '0')}
                </span>
              </div>
            </motion.div>
          </div>
        ))}

        {/* Feature slides */}
        {detail.features.map((f, i) => (
          <div key={i} className="big-project-view relative w-screen shrink-0 flex flex-col lg:flex-row lg:items-start lg:gap-[5vw] lg:gap-16 lg:py-24 lg:px-[5vw] max-lg:mx-[5vw] max-lg:justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative select-none drag-none max-lg:w-full"
            >
              <div className="max-w-[90vw] min-w-[90vw] lg:min-w-0 relative overflow-hidden select-none drag-none" style={{ height: slideHeight }}>
                <img
                  src={f.image}
                  alt={f.title}
                  className="drag-none w-full h-full object-cover select-none max-lg:max-h-[40vh]"
                  style={{ height: slideHeight, width: 'auto' }}
                  draggable={false}
                />
                <div className="absolute bottom-6 left-0 right-0 mx-auto text-center max-w-[500px] px-4 select-none">
                  <p className="text-[10px] leading-[10px] text-white">
                    <strong className="font-normal uppercase">{f.title}</strong>
                  </p>
                  <p className="text-[10px] leading-[10px] text-white/70 mt-2">{f.text}</p>
                </div>
              </div>
            </motion.div>
          </div>
        ))}

        {/* Quote slide */}
        <div className="big-project-view relative w-screen shrink-0 flex items-center justify-center lg:justify-start bg-white lg:px-[5vw]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring }}
            className="max-w-[700px] px-7 md:px-[70px] lg:px-[100px] xl:px-[130px]"
          >
            <p className="text-[16px] leading-[1.4] text-black/70 lg:text-[21px] lg:leading-[1.44]">
              &ldquo;{detail.quote}&rdquo;
            </p>
            <p className="text-[10px] uppercase not-italic text-[#797979] mt-6 lg:mt-8">
              {detail.quoteAuthor}
            </p>
          </motion.div>
        </div>

        {/* Team slide */}
        <div className="big-project-view relative w-screen shrink-0 bg-white flex items-center lg:px-[5vw]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-x-16 gap-y-8 max-h-[70vh] flex-col px-7 md:px-[70px] lg:px-[100px] xl:px-[130px]"
          >
            {detail.team.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...spring, delay: i * 0.05 }}
                className="min-w-[200px]"
              >
                <p className="text-[11px] text-[#797979] uppercase mb-[2px]">
                  {section.label}
                </p>
                {section.members.map((m) => (
                  <p key={m} className="text-[13px] text-black">{m}</p>
                ))}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
