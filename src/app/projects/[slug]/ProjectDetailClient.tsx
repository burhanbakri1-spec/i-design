'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { projects as localProjects, type Project } from '@/data/projects';
import { getProjectDetail } from '@/data/projectDetails';
import type { ProjectDetails } from '@/lib/api/types';
import Navbar from '@/components/Navbar';
import MobileNavbar from '@/components/MobileNavbar';
import PortfolioGrid from '@/components/PortfolioGrid';

const spring = {
  type: "spring" as const,
  stiffness: 120,
  damping: 20,
};

interface Props {
  project: Project & { apiDetails?: ProjectDetails };
  slug: string;
  urlCat?: string;
  urlSub?: string;
}

type DetailField = {
  client: string;
  typology: string;
  size: string;
  status: string;
};

function formatProjectStatus(status?: string | null) {
  return status ? status.replace(/_/g, ' ') : '';
}

function formatProjectSize(project?: ProjectDetails) {
  if (!project) return '';
  const values = [project.sizeM2, project.sizeFt2].filter((value) => value !== null && value !== undefined && value !== '');
  return values.map((value) => String(value)).join(' / ');
}

function buildApiDetail(project: Project & { apiDetails?: ProjectDetails }): DetailField {
  const api = project.apiDetails;
  if (api) {
    return {
      client: api.client ?? '',
      typology: api.categories?.map((category) => category.name).filter(Boolean).join(', ') || project.subCategory || project.category,
      size: formatProjectSize(api),
      status: formatProjectStatus(api.status),
    };
  }

  const local = getProjectDetail(project.id, project);
  return {
    client: local.client,
    typology: local.typology,
    size: local.size,
    status: local.status,
  };
}

function ZoomOverlay({
  data,
  onComplete,
}: {
  data: { rect: { top: number; left: number; width: number; height: number }; image: string };
  onComplete: () => void;
}) {
  return (
    <motion.div
      className="fixed z-50 overflow-hidden bg-white"
      style={{
        top: data.rect.top,
        left: data.rect.left,
        width: data.rect.width,
        height: data.rect.height,
      }}
      animate={{ top: 0, left: 0, width: '100vw', height: '100vh' }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      onAnimationComplete={onComplete}
    >
      <img
        src={data.image}
        alt=""
        className="w-full h-full object-cover select-none"
        draggable={false}
      />
    </motion.div>
  );
}

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

function MetadataPanel({ detail, project, className }: { detail: DetailField; project: Project; className?: string }) {
  const fields = [
    { label: 'Client', value: detail.client },
    { label: 'Typology', value: detail.typology },
    { label: 'Size m2/ft2', value: detail.size },
    { label: 'Status', value: detail.status },
  ].filter((field) => field.value);

  return (
    <div className={`flex flex-col flex-1 ${className}`}>
      <div className="flex flex-col gap-6">
        {fields.map((field) => (
          <div key={field.label}>
            <h4 className="text-[10px] text-[#797979] uppercase lg:text-[12px]">{field.label}</h4>
            <p className="text-[10px] leading-none text-black uppercase lg:text-sm lg:max-w-[180px]">{field.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-23">
        <div className="text-[11px] text-[#797979] uppercase">Share</div>
        <ShareButtons projectId={project.id} projectTitle={project.title} />
      </div>
    </div>
  );
}

export default function ProjectDetailClient({ project, slug, urlCat, urlSub }: Props) {
  const detail = useMemo(() => buildApiDetail(project), [project]);
  const apiDetails = project.apiDetails;
  const awards = apiDetails?.awards ?? [];
  const people = apiDetails?.people ?? [];
  const partners = apiDetails?.partners ?? [];
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [showZoom, setShowZoom] = useState(true);
  const [zoomData, setZoomData] = useState<{ rect: { top: number; left: number; width: number; height: number }; image: string } | null>(null);
  const [isZoomedOut, setIsZoomedOut] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('zoomData');
    sessionStorage.removeItem('zoomData');
    if (raw) {
      try {
        setZoomData(JSON.parse(raw));
      } catch {
        setShowZoom(false);
      }
    } else {
      setShowZoom(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [slug]);

  useEffect(() => {
    const onScroll = () => {
      const isDesktop = window.innerWidth >= 1024;
      setIsZoomedOut(isDesktop && window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const slidesContainerRef = useRef<HTMLDivElement>(null);

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

  const [selectedCategory, setSelectedCategory] = useState<string | null>(urlCat || project.category);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(urlSub || null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(urlCat || project.category);

  useEffect(() => {
    if (urlCat) {
      setSelectedCategory(urlCat);
      setExpandedCategory(urlCat);
      setSelectedSubCategory(urlSub || null);
    } else {
      setSelectedCategory(project.category);
      setExpandedCategory(project.category);
      setSelectedSubCategory(null);
    }
  }, [urlCat, urlSub, project.category]);

  const handleCategoryClick = useCallback((cat: string) => {
    setExpandedCategory((prev) => (prev === cat ? null : cat));
    setSelectedCategory(cat);
    setSelectedSubCategory(null);
  }, []);

  const handleSubCategoryClick = useCallback((cat: string, sub: string) => {
    setSelectedCategory(cat);
    setSelectedSubCategory(sub || null);
  }, []);

  const activeCategory = selectedCategory || project.category;
  const activeSubCategory = selectedSubCategory || null;

  const relatedProjects = useMemo(() => {
    const apiRelated = apiDetails?.relatedProjects ?? [];
    if (apiRelated.length > 0) {
      return apiRelated.map((item) => ({
        id: item.slug,
        title: item.title,
        category: project.category,
        subCategory: item.categories?.[0]?.name ?? '',
        location: [item.city, item.country].filter(Boolean).join(', ').toUpperCase(),
        year: item.year ? String(item.year) : '',
        description: item.shortDescription ?? item.description ?? '',
        image: item.coverImage ?? item.media?.[0]?.url ?? '',
        images: [item.coverImage, ...(item.media ?? []).map((media) => media.url)].filter(Boolean) as string[],
        color: '#e0e0e0',
      }));
    }

    return localProjects
      .filter((item) => item.category === project.category && item.id !== project.id)
      .slice(0, 8);
  }, [apiDetails?.relatedProjects, project.category, project.id]);

  return (
    <div className="min-h-screen bg-white">
      {showZoom && zoomData && (
        <ZoomOverlay data={zoomData} onComplete={() => setShowZoom(false)} />
      )}
      <div className={showZoom ? 'invisible' : ''}>
        <Navbar
        selectedCategory={selectedCategory}
        selectedSubCategory={selectedSubCategory}
        expandedCategory={expandedCategory}
        onCategoryClick={handleCategoryClick}
        onSubCategoryClick={handleSubCategoryClick}
      />
      <MobileNavbar
        selectedCategory={selectedCategory}
        selectedSubCategory={selectedSubCategory}
        expandedCategory={expandedCategory}
        onCategoryClick={handleCategoryClick}
        onSubCategoryClick={handleSubCategoryClick}
      />

      <motion.div
        key={slug}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, scale: isZoomedOut ? 0.8 : 1 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="w-full"
        style={{ transformOrigin: 'center top' }}>
        {/* BIG.dk-style horizontal scroll container */}
        <div
          ref={(el) => {
            (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
            (slidesContainerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          }}
          className="flex flex-row overflow-x-scroll overflow-y-visible select-none cursor-grab no-scrollbar mt-[2.5cm] pb-3 lg:max-h-[77vh] lg:overflow-y-hidden lg:pb-0"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {/* ===== SLIDE 1: Hero image + project info ===== */}
          <div className="big-project-view w-max shrink-0 flex flex-col px-8 lg:w-screen lg:flex-row lg:py-24 lg:px-[5vw] max-lg:justify-center">
            {/* Desktop: text left, image right */}
            <div className="hidden lg:flex lg:flex-row lg:w-full lg:gap-16 lg:items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...spring }}
                className="flex flex-col text-right shrink-0 lg:-ml-[1cm]"
                  style={{ width: '280px', height: '77vh' }}
              >
                <div className="flex flex-col h-full items-end">
                  <div className="size-[50px] bg-black flex items-center justify-center mb-6">
                    <img src="/screenshot.png" alt="" className="h-[20px] w-[20px] object-contain" />
                  </div>
                  <div className="mb-12">
                    <h1 className="text-[18px] leading-5 font-normal break-words">{project.title}</h1>
                    <p className="mt-1 text-[15px] text-[#797979] uppercase">{project.location}</p>
                  </div>
                  <MetadataPanel detail={detail} project={project} className="text-right" />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="relative select-none drag-none"
              >
                <div className="relative overflow-hidden select-none drag-none shrink-0"
                  style={{ height: '77vh', aspectRatio: '3 / 2' }}
                >
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="drag-none w-full h-full object-cover select-none"
                      draggable={false}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-black/[0.03] text-[10px] uppercase tracking-[0.18em] text-black/35">
                      No image
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Mobile: project details beside the main image */}
            <div className="lg:hidden flex w-max flex-col">
              <div className="flex h-[calc(75vw-3rem)] flex-row items-stretch gap-3">
                <div className="w-[calc(100vw-4rem)] shrink-0">
                <div className="relative h-full w-full select-none drag-none overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="drag-none w-full h-full object-cover select-none"
                      draggable={false}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-black/[0.03] text-[10px] uppercase tracking-[0.18em] text-black/35">
                      No image
                    </div>
                  )}
                </div>
              </div>

                <div className="mr-[1.5cm] flex h-full w-[38vw] max-w-[148px] shrink-0 flex-col overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring, delay: 0.25 }}
                    className="space-y-3"
                  >
                    {[
                      { label: 'Client', value: detail.client },
                      { label: 'Typology', value: detail.typology },
                      { label: 'Size m2/ft2', value: detail.size },
                      { label: 'Status', value: detail.status },
                    ].filter((field) => field.value).map((field) => (
                      <div key={field.label}>
                        <p className="text-[9px] uppercase leading-none text-[#797979]">{field.label}</p>
                        <p className="mt-1 text-[10px] uppercase leading-[12px] text-black">{field.value}</p>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>

                <motion.div
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...spring, delay: 0.15 }}
                  className="mt-3 flex flex-nowrap items-start gap-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-black">
                    <img src="/screenshot.png" alt="" className="h-3 w-3 object-contain" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-sm font-normal leading-[1.1] text-black break-words">
                      {project.title}
                    </h1>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[#8E8E8E] leading-none">
                      {project.location}
                    </p>
                  </div>
                </motion.div>
            </div>
          </div>

          {/* ===== Remaining images as full-viewport slides ===== */}
          {project.images.slice(1).map((img, i) => (
            <div key={i} className="big-project-view w-max shrink-0 flex flex-col lg:w-screen lg:flex-row lg:py-24 lg:px-[5vw] max-lg:justify-start">
              <div className="hidden lg:flex lg:flex-row lg:w-full lg:gap-16 lg:items-center lg:justify-end">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="relative select-none drag-none"
                >
                  <div className="relative overflow-hidden select-none drag-none shrink-0"
                    style={{ height: '77vh', aspectRatio: '3 / 2' }}
                  >
                    <img
                      src={img}
                      alt={`${project.title} ${i + 2}`}
                      className="drag-none w-full h-full object-cover select-none"
                      draggable={false}
                    />
                    <span className="absolute bottom-4 right-4 text-[10px] leading-[10px] uppercase select-none">
                      <span className="text-[#797979]">{String(i + 2).padStart(2, '0')}</span>/{String(project.images.length).padStart(2, '0')}
                    </span>
                  </div>
                </motion.div>
              </div>
              <div className="lg:hidden flex h-[calc(75vw-3rem)] w-max shrink-0 gap-3">
                <div className="relative h-[calc(75vw-3rem)] w-[calc(100vw-4rem)] shrink-0 select-none drag-none overflow-hidden">
                    <img
                      src={img}
                      alt={`${project.title} ${i + 2}`}
                      className="drag-none w-full h-full object-cover select-none"
                      draggable={false}
                    />
                  </div>
                <div className="w-[38vw] max-w-[148px] shrink-0" />
              </div>
            </div>
          ))}

          {(people.length > 0 || partners.length > 0 || awards.length > 0) && (
            <div className="big-project-view relative w-screen shrink-0 bg-white flex items-center lg:px-[5vw]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-wrap gap-x-16 gap-y-8 max-h-[70vh] flex-col px-7 md:px-[70px] lg:px-[100px] xl:px-[130px]"
              >
                {people.length > 0 && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...spring }} className="min-w-[220px]">
                    <p className="text-[11px] text-[#797979] uppercase mb-[2px]">People</p>
                    {people.map((person) => (
                      <p key={person.id} className="text-[13px] text-black">
                        {person.name}{person.jobTitle ? `, ${person.jobTitle}` : ''}{person.role ? ` / ${person.role}` : ''}
                      </p>
                    ))}
                  </motion.div>
                )}
                {partners.length > 0 && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...spring, delay: 0.05 }} className="min-w-[220px]">
                    <p className="text-[11px] text-[#797979] uppercase mb-[2px]">Partners</p>
                    {partners.map((partner) => (
                      <p key={partner.id} className="text-[13px] text-black">
                        {partner.website ? (
                          <a href={partner.website} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                            {partner.name}
                          </a>
                        ) : partner.name}
                        {partner.role ? ` / ${partner.role}` : ''}
                      </p>
                    ))}
                  </motion.div>
                )}
                {awards.length > 0 && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...spring, delay: 0.1 }} className="min-w-[260px]">
                    <p className="text-[11px] text-[#797979] uppercase mb-[2px]">Awards</p>
                    {awards.map((award) => (
                      <div key={award.id} className="mb-3 last:mb-0">
                        <p className="text-[13px] text-black">
                          {award.title}{award.organization ? `, ${award.organization}` : ''}{award.year ? `, ${award.year}` : ''}
                        </p>
                        {award.description && <p className="mt-1 max-w-[320px] text-[11px] leading-[1.35] text-black/60">{award.description}</p>}
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="pt-0 pb-3 lg:border-t lg:border-black/10 lg:py-16">
            <PortfolioGrid
              key={project.id + (activeSubCategory || '')}
              projects={relatedProjects}
              noPadding
              category={activeCategory}
              subCategory={activeSubCategory || undefined}
            />
          </section>
        )}
      </div>
    </div>
  );
}
