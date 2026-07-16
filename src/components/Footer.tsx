'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';

type Section = 'EMAIL' | 'OFFICE' | 'SOCIAL' | 'LEGAL';

const offices = [
  {
    name: 'Copenhagen',
    address: ['Sundkaj 165', '2150, Nordhavn', 'Copenhagen, DK', '+45 7221 7227', '+45 3512 7227', 'cph@big.dk'],
  },
  {
    name: 'London',
    address: ['1 Finsbury Avenue', 'London EC2M 2PF', 'United Kingdom', '+44 20 3735 4996', 'lon@big.dk'],
  },
  {
    name: 'Barcelona',
    address: ['Ronda de Sant Pere, 56 Bajos', '08010 Barcelona', 'Spain', '+34 610 029 747', 'bcn@big.dk'],
  },
  {
    name: 'New York',
    address: ['45 Main Street, 9th Floor', 'Brooklyn, NY 11201', 'United States', '+1 347 549 4141', '+1 866 738 4336', 'nyc@big.dk'],
  },
  {
    name: 'Shanghai',
    address: ['363 Chang Ping Road, FL 6', 'Jing An District, Shanghai', 'China', '+86 180 1923 8903', 'sha@big.dk'],
  },
  {
    name: 'Los Angeles',
    address: ['310 Wilshire Boulevard, 2nd floor', 'Santa Monica, 90401', 'California', '+1 310 692 7280', 'lax@big.dk'],
  },
  {
    name: 'Z\u00fcrich',
    address: ['Planergemeinschaft Raumfachwerk', 'Flughafenstrasse 90', '8302 Kloten', 'Switzerland', 'bigzrh@big.dk'],
  },
  {
    name: 'Riyadh',
    address: ['King Abdullah Financial District', 'Innovation Street - Building 4.07', 'Riyadh 13519', 'Saudi Arabia', 'ksa@big.dk'],
  },
];

const emailLinks = [
  { label: 'NEW PROJECTS', href: 'mailto:newbiz@big.dk', value: 'newbiz@big.dk' },
  { label: 'PRESS', href: 'mailto:press@big.dk', value: 'press@big.dk' },
  { label: 'LECTURES', href: 'mailto:lectures@big.dk', value: 'lectures@big.dk' },
  { label: 'EXHIBITIONS', href: 'mailto:exhibitions@big.dk', value: 'exhibitions@big.dk' },
];

const socialLinks = [
  { name: 'Instagram', url: 'https://www.instagram.com/' },
  { name: 'X', url: 'https://x.com/' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/' },
  { name: 'Vimeo', url: 'https://vimeo.com/' },
  { name: 'Facebook', url: 'https://www.facebook.com/' },
];

const legalLinks = [
  'BIG’s Anti-Slavery and Human Trafficking Statement 2018',
  'BIG’s Privacy Policy 2026',
  'BIG UN GLOBAL COMPACT REPORT',
  'BIG’s Annual Sustainability Report, 2023',
  'Whistleblower Policy',
];

const ease = [0.25, 0.1, 0.25, 1] as const;

const panelMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
  transition: { duration: 0.28, ease },
};

function ArrowIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden className="shrink-0">
      <path d="M2 1H10V9" stroke="currentColor" strokeWidth="1" />
      <path d="M10 1L1 10" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function UpIcon() {
  return (
    <svg width="9" height="11" viewBox="0 0 9 11" fill="none" aria-hidden className="shrink-0">
      <path d="M4.5 10V1" stroke="currentColor" strokeWidth="1" />
      <path d="M1 4.5L4.5 1L8 4.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function SectionIcon({ section }: { section: Section }) {
  if (section === 'EMAIL') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
        <path d="M4 6H20V18H4V6Z" stroke="currentColor" strokeWidth="1.4" />
        <path d="M4 7L12 13L20 7" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }

  if (section === 'OFFICE') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
        <path d="M6 20V5H18V20" stroke="currentColor" strokeWidth="1.4" />
        <path d="M9 8H11M13 8H15M9 12H11M13 12H15M9 16H11M13 16H15" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }

  if (section === 'SOCIAL') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
        <path d="M7 12A5 5 0 0 1 12 7H17V12A5 5 0 0 1 12 17H7V12Z" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 16L4 20" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
      <path d="M6 4H18V20H6V4Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 8H15M9 12H15M9 16H13" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function SocialQr() {
  const cells = [
    0, 1, 2, 3, 5, 6, 8, 9, 10,
    12, 16, 18, 20, 22, 24, 25,
    27, 28, 30, 33, 35, 36, 38,
    40, 42, 43, 44, 46, 48, 50,
    51, 53, 56, 58, 60, 62, 63,
    65, 67, 68, 70, 72, 75, 76,
    78, 80, 82, 83, 85, 87, 88,
    90, 91, 93, 95, 97, 99, 100,
    102, 104, 105, 107, 108, 110,
    112, 113, 115, 117, 119, 120,
  ];

  return (
    <div className="relative mt-[0.45cm] grid h-[86px] w-[86px] grid-cols-11 grid-rows-11 gap-[2px] bg-white p-[2px]" aria-hidden>
      {Array.from({ length: 121 }).map((_, index) => (
        <span key={index} className={cells.includes(index) ? 'bg-black' : 'bg-white'} />
      ))}
      <span className="absolute left-1/2 top-1/2 flex h-[20px] w-[20px] -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-white text-[7px] font-normal tracking-normal text-black">
        BIG
      </span>
    </div>
  );
}

export default function Footer() {
  const [openSection, setOpenSection] = useState<Section | null>(null);
  const [openOffice, setOpenOffice] = useState<string | null>(null);
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: '-80px' });

  const toggleSection = (s: Section) => {
    setOpenSection((prev) => {
      const next = prev === s ? null : s;
      if (next === 'OFFICE' && !openOffice) {
        setOpenOffice(offices[0].name);
      }
      return next;
    });
  };

  const toggleOffice = (name: string) => {
    setOpenOffice((prev) => (prev === name ? null : name));
  };

  const renderSectionContent = (section: Section) => {
    if (section === 'EMAIL') {
      return (
        <div className="grid w-max max-w-none gap-y-[0.7cm] text-left">
          {emailLinks.map((item) => (
            <div key={item.label} className="grid grid-cols-[115.2px_max-content] items-baseline gap-x-[0.672cm]">
              <p className="whitespace-nowrap text-[12.48px] font-normal leading-[1.25] tracking-normal text-black uppercase">{item.label}</p>
              <a
                href={item.href}
                className="whitespace-nowrap text-[12.48px] font-normal leading-[1.25] tracking-normal text-black underline underline-offset-2 transition-opacity duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:opacity-60 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-black"
              >
                {item.value}
              </a>
            </div>
          ))}
        </div>
      );
    }

    if (section === 'OFFICE') {
      const activeOffice = offices.find((office) => office.name === openOffice) ?? offices[0];

      return (
        <div className="grid w-max grid-cols-[132px_180px] items-start gap-x-[0.55cm] gap-y-[0.75cm] text-left">
          {offices.map((office) => {
            const isActive = activeOffice.name === office.name;
            return (
              <div key={office.name} className="contents">
                <button
                  onClick={() => setOpenOffice(office.name)}
                  aria-pressed={isActive}
                  className="grid grid-cols-[10px_1fr] items-start gap-x-[0.25cm] text-left text-[13px] font-normal leading-[1.25] tracking-normal text-black uppercase transition-opacity duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:opacity-60 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-black"
                >
                  <span className={`mt-[6px] h-[5px] w-[5px] bg-black ${isActive ? 'opacity-100' : 'opacity-0'}`} aria-hidden />
                  <span>{office.name}</span>
                </button>
                {isActive ? (
                  <div className="text-[13px] font-normal leading-[1.25] tracking-normal text-black">
                    {office.address.map((line, i) =>
                      line.includes('@') ? (
                        <a
                          key={line}
                          href={`mailto:${line}`}
                          className="block underline underline-offset-2 transition-opacity duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:opacity-60 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-black"
                        >
                          {line}
                        </a>
                      ) : (
                        <p key={`${line}-${i}`}>{line}</p>
                      )
                    )}
                  </div>
                ) : (
                  <div aria-hidden />
                )}
              </div>
            );
          })}
        </div>
      );
    }

    if (section === 'SOCIAL') {
      return (
        <div className="mx-auto flex w-full max-w-[160px] -translate-x-[0.3cm] flex-col items-start gap-[0.5cm] text-left">
          {socialLinks.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[5px] text-[14px] font-normal leading-[1.15] tracking-normal text-black underline underline-offset-2 transition-opacity duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:opacity-60 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-black"
            >
              {item.name.toUpperCase()}
              <ArrowIcon />
            </a>
          ))}
          <SocialQr />
        </div>
      );
    }

    return (
      <div className="mx-auto w-full max-w-[230px] space-y-[0.7cm] text-left">
        {legalLinks.map((item) => (
          <a
            key={item}
            href="#"
            className="block text-[13px] font-normal leading-[1.25] tracking-normal text-black underline underline-offset-2 transition-opacity duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:opacity-60 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-black"
          >
            {item}
          </a>
        ))}
      </div>
    );
  };

  return (
    <motion.footer
      ref={footerRef}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.38, ease }}
      className="bg-white px-4 pt-[1cm] pb-6 sm:px-6 lg:px-[27px] lg:pt-[1cm] lg:pb-[29px]"
    >
      <div className="mx-auto w-full">
        <div className="mx-auto grid max-w-[980px] grid-cols-2 gap-x-[1.4cm] gap-y-8 md:grid-cols-4 md:gap-x-[1.75cm]">
          {(['EMAIL', 'OFFICE', 'SOCIAL', 'LEGAL'] as Section[]).map((section, index) => (
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.32, delay: index * 0.04, ease }}
            >
              <button
                onClick={() => toggleSection(section)}
                aria-expanded={openSection === section}
                className="group mx-auto flex w-full -translate-x-[1.3cm] items-center justify-center gap-[0.35cm] text-center transition-opacity duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:opacity-60 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-black"
              >
                <span className="text-[13px] font-normal uppercase tracking-[0.34em] text-[#9ca3af]">
                  {section}
                </span>
                <span className="text-[18px] font-normal leading-none text-[#9ca3af] transition-colors duration-300">
                  +
                </span>
              </button>

              <AnimatePresence initial={false}>
                {openSection === section && (
                    <motion.div
                      {...panelMotion}
                      className={`mt-[0.7cm] w-full overflow-visible pb-6 ${section === 'EMAIL' ? 'translate-x-[0.9cm]' : 'translate-x-[0.5cm]'}`}
                    >
                    {renderSectionContent(section)}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-[7cm] pt-[22px]">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mx-auto flex items-center gap-2 text-[13px] font-normal uppercase tracking-[0.34em] text-[#8f8f8f] transition-colors duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:text-black focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-black"
          >
            Back to top
            <UpIcon />
          </button>
        </div>
      </div>
    </motion.footer>
  );
}
