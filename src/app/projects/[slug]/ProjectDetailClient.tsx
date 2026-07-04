'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { projects } from '@/data/projects';
import { getProjectDetail } from '@/data/projectDetails';
import type { Project } from '@/data/projects';
import Navbar from '@/components/Navbar';

export default function ProjectDetailClient({ project, slug }: { project: Project; slug: string }) {
  const detail = getProjectDetail(slug, project);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const isDraggingRef = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);
  const galleryDragRef = useRef<HTMLDivElement>(null);
  const isGalleryDraggingRef = useRef(false);
  const galleryDragStartX = useRef(0);
  const galleryDragScrollLeft = useRef(0);

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

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleCategoryClick = useCallback((cat: string) => {
    setExpandedCategory((prev) => (prev === cat ? null : cat));
    setSelectedCategory(cat);
    setSelectedSubCategory(null);
  }, []);

  const handleSubCategoryClick = useCallback((cat: string, sub: string) => {
    setSelectedCategory(cat);
    setSelectedSubCategory(sub || null);
  }, []);

  const sameCategoryProjects = projects
    .filter((p) => p.category === project.category && p.id !== project.id)
    .slice(0, 8);

  if (!detail) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar
          selectedCategory={selectedCategory}
          selectedSubCategory={selectedSubCategory}
          expandedCategory={expandedCategory}
          onCategoryClick={handleCategoryClick}
          onSubCategoryClick={handleSubCategoryClick}
        />
        <div className="h-[calc(100vh-44px)] flex items-center justify-center px-7 md:px-[70px] lg:px-[100px] xl:px-[130px]">
          <div className="max-w-[700px]">
            <Link
              href="/"
              className="inline-block text-[11px] uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors mb-6"
            >
              ← Back to all projects
            </Link>
            <p className="text-[15px] leading-relaxed text-black/70">{project.description}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        selectedCategory={selectedCategory}
        selectedSubCategory={selectedSubCategory}
        expandedCategory={expandedCategory}
        onCategoryClick={handleCategoryClick}
        onSubCategoryClick={handleSubCategoryClick}
      />

      <div className="w-full px-[4cm]">
        <div
          ref={scrollRef}
          className="h-[calc(100vh-44px)] overflow-x-auto overflow-y-hidden no-scrollbar flex -mx-[4cm] cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {/* Slide 1: Info Sidebar + Horizontal Image Gallery */}
          <div className="big-project-view relative w-screen flex h-full shrink-0">
            <div className="hidden md:block h-full w-[380px] bg-white shrink-0">
              <div className="flex flex-col h-full px-8 pb-8 pt-[4cm]">
                  <div className="mb-4 text-right">
                    <div className="flex justify-end mb-3">
                      <svg viewBox="0 0 12 12" className="w-9 h-9">
                        <rect width="12" height="12" fill="black" />
                        <rect x="5" y="2" width="2" height="8" fill="white" />
                        <rect x="2" y="5" width="8" height="2" fill="white" />
                      </svg>
                    </div>
                    <h1 className="text-[22px] leading-[1.1] uppercase text-black mb-1">
                      {project.title}
                    </h1>
                    <p className="text-[10px] uppercase text-[#969696]">
                      {project.location}
                    </p>
                    <p className="text-[10px] uppercase text-[#969696] mt-1">{project.year}</p>
                  </div>
                  <div className="text-right">
                    <div className="space-y-[10px]">
                    <div>
                      <p className="text-[11px] text-[#969696] uppercase mb-[2px]">Client</p>
                      <p className="text-[13px] text-black">{detail.client}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#969696] uppercase mb-[2px]">Typology</p>
                      <p className="text-[13px] text-black">{detail.typology}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#969696] uppercase mb-[2px]">Size m2/ft2</p>
                      <p className="text-[13px] text-black">{detail.size.replace(/ m²|\s?ft²/g, '')}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#969696] uppercase mb-[2px]">Status</p>
                      <p className="text-[13px] text-black">{detail.status}</p>
                    </div>
                    <div className="pt-4 border-t border-black/10">
                      <p className="text-[11px] text-[#969696] uppercase mb-3">Share</p>
                      <div className="flex gap-2 justify-end">
                        {[
                          <svg key="mail" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM20 7.23792L12.0718 14.338L4 7.21594V19H20V7.23792ZM4.51146 5L12.0619 11.662L19.501 5H4.51146Z"/></svg>,
                          <svg key="fb" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47062 14 5.5 16 5.5H17.5V2.1401C17.1743 2.09685 15.943 2 14.6429 2C11.9284 2 10 3.65686 10 6.69971V9.5H7V13.5H10V22H14V13.5Z"/></svg>,
                          <svg key="x" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                          <svg key="li" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M6.94048 4.99993C6.94011 5.81424 6.44608 6.54702 5.69134 6.85273C4.9366 7.15845 4.07187 6.97605 3.5049 6.39155C2.93793 5.80704 2.78195 4.93715 3.1105 4.19207C3.43906 3.44699 4.18654 2.9755 5.00048 2.99993C6.08155 3.03238 6.94097 3.91837 6.94048 4.99993ZM7.00048 8.47993H3.00048V20.9999H7.00048V8.47993ZM13.3205 8.47993H9.34048V20.9999H13.2805V14.4299C13.2805 10.7699 18.0505 10.4299 18.0505 14.4299V20.9999H22.0005V13.0699C22.0005 6.89993 14.9405 7.12993 13.2805 10.1599L13.3205 8.47993Z"/></svg>,
                        ].map((icon, idx) => (
                          <span key={idx} className="flex items-center justify-center w-7 h-7 bg-black text-white cursor-pointer hover:opacity-70 transition-opacity">
                            {icon}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              ref={galleryDragRef}
              className="flex-1 h-full overflow-x-auto overflow-y-hidden no-scrollbar flex cursor-grab"
              onMouseDown={handleGalleryMouseDown}
              onMouseMove={handleGalleryMouseMove}
              onMouseUp={handleGalleryMouseUp}
              onMouseLeave={handleGalleryMouseLeave}
            >
              {project.images.map((img, i) => (
                <div key={i} className="h-full w-[80vw] shrink-0 relative">
                  <img src={img} alt={`${project.title} ${i + 1}`} className="h-full w-full object-cover" />
                  <span className="absolute bottom-6 right-8 text-[10px] leading-[10px] uppercase">
                    <span className="text-[#969696]">{String(i + 1).padStart(2, '0')}</span>/{String(project.images.length).padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Feature / Concept slides */}
          {detail.features.map((f, i) => (
            <div key={i} className="big-project-view relative w-screen h-full shrink-0">
              <img src={f.image} alt={f.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-10 left-0 right-0 mx-auto text-center max-w-[500px] px-4">
                <p className="text-[10px] leading-[10px] text-white">
                  <strong className="font-normal uppercase">{f.title}</strong>
                </p>
                <p className="text-[10px] leading-[10px] text-white/70 mt-2">{f.text}</p>
              </div>
            </div>
          ))}

          {/* Quote slide */}
          <div className="big-project-view relative w-screen h-full shrink-0 flex items-center justify-center lg:justify-start bg-white px-7 md:px-[70px] lg:px-[100px] xl:px-[130px]">
            <div className="max-w-[700px]">
              <p className="text-[16px] leading-[1.4] text-black/70 lg:text-[21px] lg:leading-[1.44]">
                &ldquo;{detail.quote}&rdquo;
              </p>
              <p className="text-[10px] uppercase not-italic text-[#969696] mt-6 lg:mt-8">
                {detail.quoteAuthor}
              </p>
            </div>
          </div>

          {/* Team slide */}
          <div className="big-project-view relative w-screen h-full shrink-0 bg-white flex items-center px-7 md:px-[70px] lg:px-[100px] xl:px-[130px]">
            <div className="flex flex-wrap gap-x-16 gap-y-8 max-h-[70vh] flex-col">
              {detail.team.map((section, i) => (
                <div key={i} className="min-w-[200px]">
                  <p className="text-[11px] text-[#969696] uppercase mb-[2px]">
                    {section.label}
                  </p>
                  {section.members.map((m) => (
                    <p key={m} className="text-[13px] text-black">{m}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Other Projects */}
        {sameCategoryProjects.length > 0 && (
          <section className="border-t border-black/10 py-12 lg:py-16">
            <div className="flex flex-col gap-[1.3cm] w-full">
              {sameCategoryProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="grid grid-cols-1 gap-3 w-full px-2 sm:px-0 lg:grid-cols-[290px_336px] lg:gap-x-[37px] text-left ml-[4cm]"
                >
                  <div className="flex flex-col items-end pt-[22px] -mt-[1.5cm]">
                    <div className="flex items-center justify-center w-[39px] h-[39px] bg-black shrink-0 mr-[3px]">
                      <img src="/screenshot.png" alt="" className="h-[15px] w-[15px] object-contain" />
                    </div>
                    <div className="w-full text-right mt-[16px]">
                      <h3 className="text-[16px] font-normal leading-[1.1] text-black">{p.title}</h3>
                    </div>
                    <div className="w-full text-right mt-[6px]">
                      <p className="text-[11px] uppercase tracking-[0.25em] text-[#8E8E8E] leading-none">{p.location}</p>
                    </div>
                  </div>
                  <div className="relative w-full overflow-hidden pt-[28px] pb-[14px] -mt-[1.7cm]">
                    <img src={p.image} alt={p.title} className="w-full h-[234px] object-cover" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
