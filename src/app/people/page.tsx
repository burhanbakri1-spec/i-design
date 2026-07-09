'use client';

import { useState, useEffect } from 'react';

interface Person {
  name: string;
  title: string;
  office: string;
  bio: string;
}

interface Group {
  id: string;
  label: string;
  people: Person[];
}

const groups: Group[] = [
  {
    id: 'partners',
    label: 'Partners',
    people: [
      { name: 'Bjarke Ingels', title: 'Founder & Creative Director', office: 'CPH', bio: 'Bjarke Ingels is the founder of BIG. His work is driven by the belief that architecture can be a tool for turning fiction into fact \u2013 merging pragmatic solutions with utopian possibilities.\n\nSince founding BIG in 2005, Ingels has led projects that redefine typologies and challenge conventional constraints. From the figure-eight loop of 8 House in Copenhagen, to the hybrid pyramid-courtyard of VIA 57 West in Manhattan, to the skiable waste-to-energy plant CopenHill, his work proposes that sustainable cities can not only be better for the environment, but also more enjoyable to live in.\n\nHe has taught at Harvard, Yale, and Columbia, and is the author of Yes Is More. His recognitions include the Golden Lion at the Venice Biennale, the Louis I. Kahn Award, and the Aga Khan Award for Architecture, as well as being named one of TIME\u2019s 100 Most Influential People.' },
      { name: 'Sheela Maini S\u00f8gaard', title: 'CEO, Partner', office: 'CPH', bio: 'Sheela Maini S\u00f8gaard is Chief Executive Officer and Partner at BIG. She manages the health and growth of Bjarke Ingels Group\u2019s studio offices globally along with its internationally represented team of 800+ designers and staff. Since joining BIG in 2008 as Chief Financial Officer, Sheela has transformed BIG from Bjarke Ingels\u2019 Danish architectural firm into an internationally acclaimed company led by design, community and innovation.\n\nSheela complements her professional work by serving as board member of The Bikuben Foundation and Adjunct Professor with Copenhagen Business School. In 2022, the Danish Association of Managers and Executives honored Sheela with the title of CEO of the Year.' },
      { name: 'Andreas Klok Pedersen', title: 'Sr. Partner, Design Director', office: 'LON', bio: 'Andreas is the Design Director of BIG London and a member of the practice\u2019s global Board of Directors. He has worked with us since our founding and led projects of all typologies and sizes in locations around the world, with a focus on Europe and the Middle East.\n\nKey recent work includes Google\u2019s new UK Headquarters in Central London, Ocean House in Dubai, and the Saadiyat Island Cultural Masterplan in Abu Dhabi. Andreas has spearheaded many of BIG\u2019s strategic planning projects including Plan for the Planet and Mars Science City.' },
      { name: 'David Zahle', title: 'Partner', office: 'CPH', bio: 'David Zahle is a Partner at BIG and has been Project and Design Architect for many of BIG\u2019s award-winning and built projects. Since BIG inception in 2006, David has been responsible for delivering imaginative and pioneering designs for buildings such as Copenhill, The Maritime Museum, The Twist Museum and the sustainable Vestre factory.\n\nThrough thorough analysis David challenges conventional perspectives of what a building can be in itself and for the city around it. He is dedicated to creating a more equitable future through good design.' },
      { name: 'Jakob Lange', title: 'Partner', office: 'CPH', bio: 'Jakob Lange joined BIG in 2003 and was named Partner in 2009. He successfully led the design and development of Copenhill, The Mountain, and Urban Rigger. Jakob also heads BIG Products, BIG\u2019s product design division.\n\nHe jointly created the Alphabet of Light, the Vine light, and the Stellar Nebula lamp with Artemide as well as led the design of Hyperloop\u2019s Pegasus pods. He is currently in charge of creating a 3D-printed infrastructure for living on the Moon with NASA.' },
      { name: 'Brian Yang', title: 'Partner', office: 'CPH', bio: 'Brian Yang joined BIG in 2007 and was named Partner in 2015. He has worked closely with Bjarke Ingels on a wide range of projects such as an energy efficient skyscraper in Shenzhen, the 8 House in Copenhagen, Copenhill, Kistefos Art Museum, and the LEGO House.\n\nMost recently, he has been the partner-in-charge for a 280m tall mixed-use tower in Singapore and the Vltava Philharmonic Prague. With a background in energy efficiency research, Brian brings additional focus on environmental and economic sustainability.' },
      { name: 'Kai-Uwe Bergmann', title: 'Partner', office: 'NYC', bio: 'Kai-Uwe Bergmann is a Partner globally at BIG, bringing his expertise to proposals around the world. Working out of the New York office, Kai-Uwe coordinates with BIG\u2019s international offices, helping lead work in over 40 different countries.\n\nHe contributed to the East Side Coastal Resiliency Project (the BIG U). His work expands to the exhibition and publication of BIG\u2019s literary portfolio. He complements his professional work through teaching assignments at Pratt Institute and Georgia Tech.' },
      { name: 'Daniel Sundlin', title: 'Partner', office: 'NYC', bio: 'Daniel Sundlin\u2019s approach to design is anchored in holistic thinking around the synergies of community, economy, ecology and sustainability. He began working at BIG Copenhagen in 2008, and in 2010 he opened BIG\u2019s first office outside of Denmark with the establishment of BIG New York.\n\nDaniel has worked on The Heights Public School, VIA 57 West, Wildflower Film Studios, Google Bay View campus, the East Side Coastal Resiliency project, and OCEANIX Busan.' },
      { name: 'Cat Huang', title: 'Partner', office: 'CPH', bio: 'Catherine Huang joined BIG in 2007 and became partner in 2017. She has worked closely with Bjarke Ingels across a wide range of projects such as the Danish Pavilion for the 2010 Shanghai Expo, an energy efficient skyscraper in Shenzhen, and residential projects like Dortheavej 2 in Copenhagen and 79 & PARK in Stockholm.\n\nCat is currently Partner in Charge for the Suzhou Art Museum in Suzhou, China.' },
      { name: 'Finn N\u00f8rkj\u00e6r', title: 'Partner', office: 'CPH', bio: 'Finn N\u00f8rkj\u00e6r is a Partner at BIG and has collaborated with Bjarke Ingels since he won the competition on his very first project for the Copenhagen Harbour Bath in 2001. Finn has been instrumental in translating Bjarke\u2019s visionary architecture into buildable projects.\n\nHis portfolio includes the LEGO House, Tirpitz Museum, Gammel Hellerup School, noma 2.0, and BIG\u2019s new Headquarters in Copenhagen.' },
    ],
  },
  {
    id: 'associates',
    label: 'Associates/Directors',
    people: [],
  },
  {
    id: 'copenhagen',
    label: 'IDESIGN Copenhagen',
    people: [
      { name: 'Frederik Lyng', title: 'Partner', office: 'CPH', bio: 'Frederik Lyng joined BIG in 2008 and was named Partner in 2024. He has led numerous projects from competitions to realization, with a focus on Denmark and Scandinavia. He was design lead for Gammel Hellerup School, Glasir in the Faroe Islands, and noma 2.0.' },
      { name: 'Jakob Sand', title: 'Partner', office: 'CPH', bio: 'Jakob Sand joined BIG in 2011. He has led and won numerous international competitions across Europe, with focus on France, Germany, Luxembourg, and Switzerland. His portfolio includes M\u00c9CA Cultural Center in Bordeaux, Galeries Lafayette Champs-\u00c9lys\u00e9es, and the Sorbonne University innovation center.' },
      { name: 'Giulia Frittoli', title: 'Partner, BIG Landscape', office: 'CPH', bio: 'Named BIG Landscape Partner in 2021, Giulia is an instrumental leader within BIG Landscape. She led the proposal for Toyota Woven City and has extensive experience in resilient master-planning and public space design at various scales.' },
    ],
  },
  {
    id: 'barcelona',
    label: 'IDESIGN Barcelona',
    people: [
      { name: 'Hanna Johansson', title: 'Partner', office: 'BCN', bio: 'Hanna joined BIG Copenhagen in 2008 and relocated to establish BIG in Barcelona in 2019. She has led award-winning projects including the Biosphere in Sweden, Copenhagen Harbour Bath, and Tirpitz Museum. She secured competition wins for the Gastronomy Open Ecosystem and the Joint Research Center in Sevilla.' },
      { name: 'Jo\u00e3o Albuquerque', title: 'Partner, Design Director', office: 'BCN', bio: 'Jo\u00e3o began his career at BIG Copenhagen in 2008 and moved to Barcelona in 2019 to establish BIG Barcelona. He became Design Director and was named Partner in 2021. He leads projects across Southern Europe, Middle East, India, and South America.' },
      { name: 'Agustin Perez-Torres', title: 'Partner', office: 'BCN', bio: 'Agustin Perez-Torres is a Partner at BIG, leading work throughout North America and South America. His design approach focuses on placemaking, elevating community, and celebrating culture. He has led the Cultural District of Miraya in Saudi Arabia and Vancouver House.' },
    ],
  },
  {
    id: 'london',
    label: 'IDESIGN London',
    people: [
      { name: 'Andy Young', title: 'Partner', office: 'LON', bio: 'Andy joined BIG in 2016 as Technical Director and has been a Partner since 2021. He has led some of BIG\u2019s most prominent projects including Google\u2019s new UK Headquarters in Kings Cross, 120 Fleet Street, and the Kosovo Opera and Ballet Theatre. Prior to BIG, Andy spent two decades at Rogers Stirk Harbour & Partners.' },
      { name: 'Henriette Helstrup', title: 'Managing Director & Partner', office: 'LON', bio: 'Henriette joined BIG in 2018 as Operations Director and is now a Partner and the Managing Director of BIG\u2019s London office. She has over 20 years\u2019 experience within architectural practice from both a design and a management perspective.' },
      { name: 'Alexandru Malaescu', title: 'Partner', office: 'LON', bio: 'Alexandru joined BIG in 2018 as a Senior Urban Designer and was made a Partner in 2024. He is the Head of Urban Design for the London Studio and has extensive experience with Urban Design and Masterplanning projects across the UK and Middle East.' },
    ],
  },
  {
    id: 'newyork',
    label: 'IDESIGN New York',
    people: [
      { name: 'Daria Stark', title: 'Managing Director & Partner', office: 'NYC', bio: 'Daria Pahhota is the Managing Director of BIG New York City and became a Partner in 2021. She leads the office\u2019s general management and operations. Daria first joined BIG in 2008 and previously led all of the firm\u2019s internal and external communication efforts.' },
      { name: 'Beat Schenk', title: 'Partner', office: 'NYC', bio: 'Beat Schenk brings 35+ years of professional expertise in architectural detailing, conceptual technical analysis, code, and zoning. He has led numerous high-profile projects including the East Side Coastal Resiliency Project, VIA 57 West, Telus Sky, and Vancouver House.' },
    ],
  },
  {
    id: 'shanghai',
    label: 'IDESIGN Shanghai',
    people: [],
  },
  {
    id: 'losangeles',
    label: 'IDESIGN Los Angeles',
    people: [
      { name: 'Leon Rost', title: 'Partner', office: 'LAX', bio: 'Leon Rost leads BIG\u2019s Los Angeles office, overseeing projects that span large-scale masterplans, workplaces, higher education, and residential design. He oversaw the design of 3 million square feet within Google\u2019s next-generation campus and played a key role in the Athletics Ballpark Masterplan.' },
    ],
  },
  {
    id: 'zurich',
    label: 'IDESIGN Z\u00fcrich',
    people: [],
  },
  {
    id: 'bhutan',
    label: 'IDESIGN Bhutan',
    people: [],
  },
];

function InitialsAvatar({ name }: { name: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['#1b1b1b', '#2d2d2d', '#404040', '#555', '#6b6b6b'];
  const hue = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return (
    <div
      className="flex h-full w-full items-center justify-center text-white text-lg font-medium select-none"
      style={{ backgroundColor: colors[hue % colors.length] }}
    >
      {initials}
    </div>
  );
}

function PersonRow({ person, groupId, onSelect, isSelected, onHover, onLeave, expanded, onToggle }: { person: Person; groupId: string; onSelect: (person: Person, groupId: string) => void; isSelected: boolean; onHover: (person: Person) => void; onLeave: () => void; expanded: boolean; onToggle: () => void }) {
  const isPartners = groupId === 'partners';

  const handleClick = () => {
    onSelect(person, groupId);
    if (isPartners) {
      onToggle();
    }
  };

  return (
    <div className="group py-1.5" onMouseEnter={() => onHover(person)} onMouseLeave={onLeave}>
      <div
        className="grid cursor-pointer grid-cols-[1fr_auto] items-center"
        onClick={handleClick}
      >
        <div className="origin-left duration-500 ease-out group-hover:scale-[1.55] group-hover:duration-400 text-sm">
          <span className="mr-1 ml-0 inline-block origin-center -translate-y-0.5 text-xs font-medium text-[#797979] transition-transform select-none">
            +
          </span>
          <span className={isSelected ? 'font-bold' : ''}>{person.name}</span>
        </div>
        <div className="ml-auto truncate text-right text-xs text-[#9e9e9e] uppercase lg:max-w-50 xl:max-w-none">
          {person.title}
        </div>
      </div>
      {isPartners && (
        <div
          className={`z-20 w-full overflow-hidden transition-all duration-300 ${
            expanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="relative mt-4 mb-12">
            <p className="text-sm leading-5 whitespace-pre-wrap text-[#555]">{person.bio}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PeoplePage() {
  const [entranceClass, setEntranceClass] = useState('');

  useEffect(() => {
    const pe = sessionStorage.getItem('page-entrance');
    sessionStorage.removeItem('page-entrance');
    if (pe === 'slide-in-left') {
      setEntranceClass('animate-slide-in-left');
    }
  }, []);

  const [activeNav, setActiveNav] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<{ person: Person; groupId: string } | null>(null);
  const [hoveredPerson, setHoveredPerson] = useState<Person | null>(null);
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (entry.target.id === 'sentinel') {
            setActiveNav(groups[groups.length - 1].id);
          } else {
            setActiveNav(entry.target.id);
          }
        }
      }
    }, { rootMargin: '-40% 0% -10% 0%' });

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(s => observer.observe(s));

    const sentinel = document.getElementById('sentinel');
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, [groups.length]);

  const handleSelect = (person: Person, groupId: string) => {
    setSelectedPerson({ person, groupId });
  };

  const displayPerson = hoveredPerson || selectedPerson?.person || null;

  return (
    <>
      <div id="people-section" className={`relative z-10 bg-white pb-[100px] ${entranceClass}`}>
        <div className="mx-auto px-4 md:px-[70px] lg:max-w-full lg:px-[100px] xl:max-w-[95%] xl:px-[130px] lg:ml-[4cm] lg:mr-[4cm]">
          <h1 className="mb-5 -translate-x-1.5 pt-[26px] text-[clamp(2rem,10vw,55px)] leading-[1.14em] uppercase md:pt-20 lg:mb-[60px] lg:pt-[120px] lg:text-[70px] xl:text-[100px]">
            People
          </h1>

          {/* Sections */}
          {groups.map((group) => (
            <section
              key={group.id}
              id={group.id}
              className="scroll-mt-[40vh] md:mt-24 mt-0"
            >
              <h3 className="mb-4 text-xs text-[#9e9e9e] uppercase">{group.label}</h3>
              {group.people.map((person, i) => (
                <PersonRow
                  key={i}
                  person={person}
                  groupId={group.id}
                  onSelect={handleSelect}
                  isSelected={selectedPerson?.person.name === person.name && selectedPerson?.groupId === group.id}
                  onHover={(p) => setHoveredPerson(p)}
                  onLeave={() => setHoveredPerson(null)}
                  expanded={expandedPerson === person.name}
                  onToggle={() => setExpandedPerson(prev => prev === person.name ? null : person.name)}
                />
              ))}
            </section>
          ))}

          <div id="sentinel" className="h-[1px]" />
        </div>
      </div>

      {/* Fixed side nav */}
      {/* Mobile side nav */}
      <nav className="lg:hidden flex gap-3 overflow-x-auto px-4 py-3 text-[9px] uppercase tracking-[0.2em] z-[101] bg-white border-b border-black/5 sticky top-14">
        {groups.map((g) => (
          <a
            key={g.id}
            href={`#${g.id}`}
            onClick={() => setActiveNav(g.id)}
            className={`flex items-center gap-1 whitespace-nowrap shrink-0 ${activeNav === g.id ? 'text-black' : 'text-[#949494] hover:text-black'}`}
          >
            {activeNav === g.id && <span className="inline-block w-1.5 h-1.5 bg-black shrink-0" />}
            {g.label}
          </a>
        ))}
      </nav>
      <nav className="hidden lg:flex fixed flex-col gap-[19px] text-[10px] uppercase tracking-[0.2em] z-[101]" style={{ top: '291px', left: '38px' }}>
        {groups.map((g) => (
          <a
            key={g.id}
            href={`#${g.id}`}
            onClick={() => setActiveNav(g.id)}
            className={`flex items-center gap-1.5 ${activeNav === g.id ? 'text-black' : 'text-[#949494] hover:text-black'}`}
          >
            {activeNav === g.id && <span className="inline-block w-1.5 h-1.5 bg-black shrink-0" />}
            {g.label}
          </a>
        ))}
      </nav>

      {/* Fixed bottom-right avatar panel */}
      {displayPerson && (
        <div className="hidden lg:block fixed bottom-0 right-0 z-[101] p-8">
          <div className="w-32 h-32 overflow-hidden">
            <InitialsAvatar name={displayPerson.name} />
          </div>
        </div>
      )}
    </>
  );
}
