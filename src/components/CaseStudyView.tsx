'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { getProjectDetail } from '@/data/projectDetails';
import type { Project } from '@/data/projects';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  project: Project;
}

export default function CaseStudyView({ project }: Props) {
  const router = useRouter();
  const detail = useMemo(() => getProjectDetail(project.id, project), [project]);

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const revealElements = gsap.utils.toArray<HTMLElement>('.reveal-up', container);
      revealElements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      const staggerElements = gsap.utils.toArray<HTMLElement>('.stagger-up', container);
      if (staggerElements.length > 0) {
        gsap.fromTo(
          staggerElements,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: staggerElements[0].parentElement,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      const parallaxImages = gsap.utils.toArray<HTMLElement>('.parallax-image', container);
      parallaxImages.forEach((img) => {
        gsap.to(img, {
          y: '15%',
          ease: 'none',
          scrollTrigger: {
            trigger: img.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      });

      const fadeElements = gsap.utils.toArray<HTMLElement>('.fade-in', container);
      fadeElements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1.2,
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, container);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const heroImage = heroImageRef.current;
    if (!hero || !heroImage) return;

    const ctx = gsap.context(() => {
      gsap.to(heroImage, {
        y: '8%',
        scale: 1.05,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      gsap.fromTo(
        '.hero-title',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.3, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.hero-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.hero-scroll',
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 1.2, ease: 'power2.out' }
      );
    }, hero);

    return () => ctx.revert();
  }, []);

  const handleBack = () => {
    router.push('/');
  };

  if (!detail) return null;

  return (
    <div ref={containerRef} className="bg-white">
      {/* ============ 1. HERO ============ */}
      <section
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden"
      >
        <div ref={heroImageRef} className="absolute inset-0 will-change-transform">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        <nav className="absolute top-8 left-8 z-20">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm tracking-wider uppercase"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Projects
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 z-10 pb-16 md:pb-24 px-6 md:px-12 xl:px-24">
          <div className="max-w-6xl mx-auto">
            <p className="hero-subtitle text-xs md:text-sm tracking-[0.3em] uppercase text-white/60 mb-4">
              {project.category} — {project.location}
            </p>
            <h1 className="hero-title text-4xl md:text-6xl xl:text-7xl font-light tracking-[0.02em] text-white leading-[1.1] max-w-4xl">
              {project.title}
            </h1>
          </div>
        </div>

        <div className="hero-scroll absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll</span>
            <div className="w-[1px] h-8 bg-white/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-white/60 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. PROJECT IDENTITY ============ */}
      <section className="py-20 md:py-28 xl:py-36 px-6 md:px-12 xl:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-4">
              <div className="space-y-8">
                <div>
                  <p className="text-[11px] tracking-[0.25em] uppercase text-black/40 mb-2">Client</p>
                  <p className="text-sm md:text-base text-black/80">{detail.client}</p>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.25em] uppercase text-black/40 mb-2">Typology</p>
                  <p className="text-sm md:text-base text-black/80">{detail.typology}</p>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.25em] uppercase text-black/40 mb-2">Size</p>
                  <p className="text-sm md:text-base text-black/80">{detail.size} m²/ft²</p>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.25em] uppercase text-black/40 mb-2">Status</p>
                  <p className="text-sm md:text-base text-black/80">{detail.status}</p>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.25em] uppercase text-black/40 mb-2">Year</p>
                  <p className="text-sm md:text-base text-black/80">{project.year}</p>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.25em] uppercase text-black/40 mb-2">Location</p>
                  <p className="text-sm md:text-base text-black/80">{project.location}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <div className="reveal-up">
                <p className="text-[11px] tracking-[0.25em] uppercase text-black/30 mb-6">The Vision</p>
                <p className="text-lg md:text-xl xl:text-2xl leading-relaxed text-black/70 font-light">
                  {project.description}
                </p>
              </div>
              <div className="reveal-up mt-8">
                <p className="text-base md:text-lg leading-relaxed text-black/50 font-light">
                  Located in the heart of Dubai&apos;s financial district, Sky View redefines the luxury hospitality
                  experience through a synthesis of architectural daring and sensory refinement. The tower rises
                  350 meters above the city, its form — a precisely calibrated twist — responding to both the
                  solar path and the prevailing wind patterns of the Gulf.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 3. ARCHITECTURAL CONCEPT ============ */}
      <section className="relative py-20 md:py-28 xl:py-36">
        <div className="relative h-[50vh] md:h-[65vh] xl:h-[80vh] overflow-hidden">
          <div className="parallax-image absolute inset-0 will-change-transform">
            <Image
              src={project.images[0] || project.image}
              alt={`${project.title} concept`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/20" />
          </div>
        </div>

        <div className="relative z-10 -mt-32 md:-mt-40 px-6 md:px-12 xl:px-24">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl bg-white/95 backdrop-blur-sm p-8 md:p-12 xl:p-16">
              <p className="text-[11px] tracking-[0.25em] uppercase text-black/30 mb-4 reveal-up">
                Architectural Concept
              </p>
              <h2 className="text-2xl md:text-3xl xl:text-4xl font-light leading-[1.2] text-black mb-6 reveal-up">
                A Vertical Oasis
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-black/60 font-light reveal-up">
                The design inverts the typical tower typology: instead of a solid mass punctuated by windows,
                Sky View is conceived as a stack of open terraces, each one a garden suspended in the air.
                The continuous ribbon of glazing — over 2,800 individual panes — is angled to capture the
                optimal light while reducing solar gain by 40% compared to a conventional curtain wall.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 4. DESIGN NARRATIVE ============ */}
      <section className="py-20 md:py-28 xl:py-36 px-6 md:px-12 xl:px-24">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] uppercase text-black/30 mb-8 reveal-up">
            Design Narrative
          </p>

          <div className="space-y-8 md:space-y-12">
            <p className="reveal-up text-base md:text-lg xl:text-xl leading-relaxed text-black/65 font-light">
              The brief was deceptively simple: create a hotel that makes guests feel as though they are
              floating above the city. Our response was to eliminate the traditional distinction between
              interior and exterior — to treat the entire building as a permeable membrane that filters
              light, air, and views.
            </p>

            <p className="reveal-up text-base md:text-lg xl:text-xl leading-relaxed text-black/65 font-light">
              The structural system is a diagrid Exoskeleton that transfers lateral loads through a
              network of intersecting steel members. This eliminates the need for interior columns,
              allowing the guest rooms to be completely free of structural obstructions. The result is
              an uninterrupted panorama from every room — a 270-degree view of the Dubai skyline.
            </p>

            <div className="reveal-up py-8 md:py-12">
              <div className="border-l-2 border-black/10 pl-6 md:pl-8">
                <p className="text-lg md:text-xl xl:text-2xl leading-relaxed text-black/50 font-light italic">
                  &ldquo;We wanted to create not just a place to sleep, but a place to experience the city from
                  a new vantage point — a lens through which to see Dubai differently.&rdquo;
                </p>
                <p className="text-xs tracking-[0.2em] uppercase text-black/30 mt-4">
                  Bjarke Ingels — Founder &amp; Creative Director
                </p>
              </div>
            </div>

            <p className="reveal-up text-base md:text-lg xl:text-xl leading-relaxed text-black/65 font-light">
              The material palette is restrained and tactile: Portuguese limestone, brushed bronze,
              fluted glass, and textured plaster. Each material was selected not only for its aesthetic
              qualities but for its ability to age gracefully in the harsh Gulf climate — to develop
              a patina that deepens over time.
            </p>
          </div>
        </div>
      </section>

      {/* ============ 5. LARGE SCALE IMAGERY ============ */}
      <section className="py-12 md:py-20">
        <div className="relative h-[60vh] md:h-[80vh] xl:h-screen overflow-hidden">
          <div className="parallax-image absolute inset-0 will-change-transform">
            <Image
              src={project.images[1] || project.image}
              alt={`${project.title} panoramic view`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
          </div>
          <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 xl:bottom-16 xl:left-24 z-10">
            <p className="text-xs md:text-sm tracking-[0.3em] uppercase text-white/60 reveal-up">
              Panoramic Terrace
            </p>
            <p className="text-sm md:text-base text-white/40 mt-1 reveal-up">
              The cantilevered pool extends 12m beyond the building envelope
            </p>
          </div>
        </div>
      </section>

      {/* ============ 6. FEATURES ============ */}
      <section className="py-20 md:py-28 xl:py-36 px-6 md:px-12 xl:px-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] uppercase text-black/30 mb-4 reveal-up">
            Key Features
          </p>
          <h2 className="text-2xl md:text-3xl xl:text-4xl font-light text-black mb-12 md:mb-16 reveal-up">
            Defining Elements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 xl:gap-16">
            {detail.features.map((feature, i) => (
              <div key={i} className="stagger-up group">
                <div className="relative h-48 md:h-56 xl:h-64 overflow-hidden mb-6">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="text-[11px] tracking-[0.25em] uppercase text-black/30 mb-2">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="text-lg md:text-xl font-medium text-black mb-2">{feature.title}</h3>
                <p className="text-sm md:text-base leading-relaxed text-black/50 font-light">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 7. QUOTE ============ */}
      <section className="py-20 md:py-28 xl:py-36 px-6 md:px-12 xl:px-24 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <div className="fade-in">
            <svg className="w-8 h-8 md:w-10 md:h-10 text-white/20 mx-auto mb-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
            </svg>
            <p className="text-xl md:text-2xl xl:text-3xl leading-relaxed text-white/80 font-light">
              &ldquo;{detail.quote}&rdquo;
            </p>
            <p className="text-xs md:text-sm tracking-[0.2em] uppercase text-white/40 mt-8">
              {detail.quoteAuthor}
            </p>
          </div>
        </div>
      </section>

      {/* ============ 8. GALLERY ============ */}
      <section className="py-20 md:py-28 xl:py-36 px-6 md:px-12 xl:px-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] uppercase text-black/30 mb-4 reveal-up">
            Gallery
          </p>
          <h2 className="text-2xl md:text-3xl xl:text-4xl font-light text-black mb-12 md:mb-16 reveal-up">
            Project Photography
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 xl:gap-4">
            {project.images.map((img, i) => (
              <div key={i} className={`stagger-up relative overflow-hidden ${i === 0 ? 'md:col-span-2 md:aspect-[2.4/1]' : 'aspect-[4/3]'}`}>
                <Image
                  src={img}
                  alt={`${project.title} gallery ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-black/5 py-12 md:py-16 px-6 md:px-12 xl:px-24">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-sm text-black/40 tracking-wider">iDESIGN Studio</p>
            <p className="text-xs text-black/30 mt-1">{project.title} — Case Study</p>
          </div>
          <motion.button
            onClick={handleBack}
            className="group flex items-center gap-3 text-sm tracking-wider uppercase text-black/50 hover:text-black transition-colors"
            whileHover={{ x: -4 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to all projects
          </motion.button>
        </div>
      </footer>
    </div>
  );
}
