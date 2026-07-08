'use client';

import { useState } from 'react';

type Section = 'EMAIL' | 'OFFICE' | 'SOCIAL' | 'LEGAL';

const offices = [
  {
    name: 'Copenhagen',
    address: ['Kalkbrænderiløbsvej 10', '2150, Nordhavn', 'Copenhagen, DK', '+45 7221 7227', '+45 3512 7227', 'cph@big.dk'],
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
    name: 'Zürich',
    address: ['Planergemeinschaft Raumfachwerk', 'Flughafenstrasse 90', '8302 Kloten', 'Switzerland', 'bigzrh@big.dk'],
  },
  {
    name: 'Riyadh',
    address: ['King Abdullah Financial District', 'Innovation Street – Building 4.07', 'Riyadh 13519', 'Saudi Arabia', 'ksa@big.dk'],
  },
];

export default function Footer() {
  const [openSection, setOpenSection] = useState<Section | null>(null);
  const [openOffice, setOpenOffice] = useState<string | null>(null);

  const toggleSection = (s: Section) => {
    setOpenSection((prev) => (prev === s ? null : s));
  };

  const toggleOffice = (name: string) => {
    setOpenOffice((prev) => (prev === name ? null : name));
  };

  return (
    <footer className="bg-white border-t border-black/10 pt-8 lg:pt-16 pb-8 px-3 sm:px-4 md:px-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* EMAIL */}
          <div>
            <button
              onClick={() => toggleSection('EMAIL')}
              className="text-[11px] tracking-[0.25em] text-black/30 uppercase mb-4 block w-full text-left hover:text-black/60 transition-colors"
            >
              EMAIL  {openSection === 'EMAIL' ? '−' : '+'}
            </button>
            {openSection === 'EMAIL' && (
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] tracking-[0.15em] font-bold text-black uppercase">NEW PROJECTS</p>
                  <a href="mailto:newbiz@big.dk" className="text-[11px] tracking-[0.05em] text-black underline underline-offset-2 hover:opacity-60 transition-opacity">newbiz@big.dk</a>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.15em] font-bold text-black uppercase">PRESS</p>
                  <a href="mailto:press@big.dk" className="text-[11px] tracking-[0.05em] text-black underline underline-offset-2 hover:opacity-60 transition-opacity">press@big.dk</a>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.15em] font-bold text-black uppercase">LECTURES</p>
                  <a href="mailto:lectures@big.dk" className="text-[11px] tracking-[0.05em] text-black underline underline-offset-2 hover:opacity-60 transition-opacity">lectures@big.dk</a>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.15em] font-bold text-black uppercase">EXHIBITIONS</p>
                  <a href="mailto:exhibitions@big.dk" className="text-[11px] tracking-[0.05em] text-black underline underline-offset-2 hover:opacity-60 transition-opacity">exhibitions@big.dk</a>
                </div>
              </div>
            )}
          </div>

          {/* OFFICE */}
          <div>
            <button
              onClick={() => toggleSection('OFFICE')}
              className="text-[11px] tracking-[0.25em] text-black/30 uppercase mb-4 block w-full text-left hover:text-black/60 transition-colors"
            >
              OFFICE  {openSection === 'OFFICE' ? '−' : '+'}
            </button>
            {openSection === 'OFFICE' && (
              <div className="space-y-1">
                {offices.map((office) => (
                  <div key={office.name}>
                    <button
                      onClick={() => toggleOffice(office.name)}
                      className="text-[11px] tracking-[0.15em] text-black uppercase hover:opacity-60 transition-opacity"
                    >
                      {office.name}
                    </button>
                    {openOffice === office.name && (
                      <div className="mt-1 mb-2 text-[11px] text-black/60 leading-relaxed">
                        {office.address.map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SOCIAL */}
          <div>
            <button
              onClick={() => toggleSection('SOCIAL')}
              className="text-[11px] tracking-[0.25em] text-black/30 uppercase mb-4 block w-full text-left hover:text-black/60 transition-colors"
            >
              SOCIAL  {openSection === 'SOCIAL' ? '−' : '+'}
            </button>
            {openSection === 'SOCIAL' && (
              <div className="space-y-2">
                {[
                  { name: 'Instagram', url: 'https://www.instagram.com/' },
                  { name: 'X', url: 'https://x.com/' },
                  { name: 'LinkedIn', url: 'https://www.linkedin.com/' },
                  { name: 'Vimeo', url: 'https://vimeo.com/' },
                  { name: 'Facebook', url: 'https://www.facebook.com/' },
                ].map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] tracking-[0.15em] text-black underline uppercase hover:opacity-60 transition-opacity"
                  >
                    {s.name}
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black">
                      <path d="M2 1H9V8" stroke="currentColor" />
                      <path d="M9 1L1 9" stroke="currentColor" />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* LEGAL */}
          <div>
            <button
              onClick={() => toggleSection('LEGAL')}
              className="text-[11px] tracking-[0.25em] text-black/30 uppercase mb-4 block w-full text-left hover:text-black/60 transition-colors"
            >
              LEGAL  {openSection === 'LEGAL' ? '−' : '+'}
            </button>
            {openSection === 'LEGAL' && (
              <div className="space-y-2">
                {[
                  'TRAFFICKING STATEMENT 2018',
                  "BIG'S PRIVACY POLICY 2024",
                  'BIG UN GLOBAL COMPACT REPORT',
                  "BIG'S ANNUAL SUSTAINABILITY REPORT, 2023",
                  'WHISTLEBLOWER POLICY',
                ].map((l) => (
                  <p key={l} className="text-[11px] tracking-[0.05em] text-black uppercase hover:opacity-60 transition-opacity cursor-pointer">
                    {l}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-[10px] tracking-[0.25em] text-black/30 uppercase hover:text-black/60 transition-colors"
          >
            ↑ Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
