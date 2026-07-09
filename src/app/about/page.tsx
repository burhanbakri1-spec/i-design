'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';

const heroText =
  'The escalating complexity of the world and the accelerating speed of change exceed any individual\u2019s capacity to comprehend. For architects operating today, the Golden Ratio is no longer the standard \u2013 rather, the UN\u2019s 17 Sustainable Development Goals are. From a single elegant equation, architects are now held to multidimensional success criteria with almost infinite variables.\n\nSince sustainability is inherently a question of complex systems, circular design, and holistic thinking, no single person holds the solution. As architects and urbanists, we must team with scientists, engineers with biologists, politicians with entrepreneurs, to combine skill sets and perspectives, knowledge and sensibility, to match the complexity of the challenges we face. As future formgivers, we aren\u2019t defined by our individual talents or singular skill sets \u2013 but rather by our capacity to pool the skills of the many to give our future form.';

const heroText2 =
  'BIG has grown organically over the last two decades from a founder, to a family, to a force of 700. Our latest transformation is the BIG LEAP: Bjarke Ingels Group of Landscape, Engineering, Architecture, Planning, and Products. A plethora of in-house perspectives allows us to see what none of us would be able to see on our own. The sum of our individual talents becomes our collective creative genius. A small step for each of us becomes a BIG LEAP for all of us.\n\nBjarke Ingels\nFounder & Creative Director';

interface Card {
  image: string;
  title: string;
  description: string;
}

interface Section {
  title: string;
  text: string;
  cards: Card[];
}

const sections: Section[] = [
  {
    title: 'LANDSCAPE',
    text: 'As public space and biodiversity are subtracted in urban spaces, BIG Landscape works with architects and other disciplines to integrate the built and natural worlds, connecting people to people, and people to nature. With every project, we go beyond the brief to give the gift of public space to the communities in which we work, creating equitable and accessible public spaces for all. \n\nOur work not only responds to challenges today, it mitigates challenges of the future: we approach every project as an opportunity to use nature-based solutions for social and technological integration, community building, ecology preservation, biophilia, and biodiversity enhancement to design sustainable, smarter, and safer cities.',
    cards: [
      { image: 'https://media.big.dk/2022/07/Urbanspace.jpg?width=800', title: 'PUBLIC REALM', description: 'A new city square Henning Kruses Plads creates a more lively public realm in Denmark\u2019s fifth largest city, Esbjerg. The design brings together Esbjerg\u2019s old town center and the green city park around the local concert venue Musikhuset. The square is planted with 55 pollen-free Betula Pendula Birch, whose white stems blend with the white interior columns of the music venue. Planted in a grid system around a cymatic pool, the trees are all stemmed at a height of 4-5 m to ensure views in all directions.' },
      { image: 'https://media.big.dk/2024/10/copyright_laurianghinitoiu_big_hq_04.jpg?width=800', title: 'PARKS', description: 'At the foot of BIG\u2019s headquarters in Copenhagen, a former parking area has been transformed into a 1,500 m2 public park and promenade, inspired by the sandy beaches and the coastal forests of Denmark. Towards the north, native forest trees, such as pines and oaks, create shelter from the harsh winds of the harbour. Towards the south, areas with planting, rocks and woods support habitat creation for biodiversity. At the heart of the park, tucked away between the trees, a sculpture by American artist Benjamin Langholz titled \u201cStone 40\u201d will surprise and engage visitors of all ages.' },
      { image: 'https://media.big.dk/2024/10/2023_Nov_SHF_Exterior-5-edit.jpg?width=800', title: 'GARDENS', description: 'Surrounding the UAE Pavilion, meandering paths frame a series of thematic gardens that explore the power of plants as a source of food, health and energy. Throughout the gardens, guests can explore a total of 6,609 plants \u2013 highlighting species that were both essential for the survival of ancestors and plants that now contribute to sustainable objectives.' },
      { image: 'https://media.big.dk/2024/10/SPIRAL_Jan_Edit_2.jpg?width=800', title: 'TERRACES', description: 'Located at the intersection of the High Line and the newly developed Hudson Boulevard Park on Manhattan\u2019s new western frontier, the terraces at The Spiral visually extend the green space of the former train tracks in a spiraling motion towards the sky \u2013 from High Line to the skyline. The 1,005 ft high-rise is a unique hybrid that intertwines a continuous green pathway with workspaces on every level. The terraces set a new standard for the contemporary workplace, making nature an integrated part of the work environment.' },
    ],
  },
  {
    title: 'ARCHITECTURE',
    text: 'We take on the creation of socially, economically and environmentally perfect places as a practical objective. Traditionally, architecture is dominated by two extremes: one that is very wild and expressive, but also expensive and unrealistic, and the other \u2013 that is practical and rational, but may also be un-ambitious and uninspiring. We try to occupy the overlap between the two extremes, a place where we use all the different forces that flow through society \u2013 the cultural and economic structures, infrastructure itself \u2013 as the driving force of the design. \n\nOur \u201cpragmatic utopian\u201d designs include powerplants where you can ski on the roof, flood protection that doubles like playgrounds or parks \u2013 parking structures that become mountains of houses with gardens \u2013 or a three-dimensional urban block where people can walk and bicycle along townhouses all the way to the 10th story penthouse. All seem and sound utopian in their ambition or radical combination of seemingly incompatible elements \u2013 but once realized they form an integrated part of our everyday lives.',
    cards: [
      { image: 'https://media.big.dk/2022/07/culture.jpg?width=800', title: 'CULTURE', description: 'The Twist in Kistefos sculpture park is a hybrid spanning several traditional categories: it\u2019s a museum, it\u2019s a bridge, it\u2019s an inhabitable sculpture. As a bridge, it reconfigures the sculpture park, turning the journey through the park into a continuous loop. As a museum, it connects two distinct spaces \u2013 an introverted vertical gallery and an extraverted horizontal gallery with panoramic views across the river. A third space is created through the blatant translation between these two galleries, creating the project\u2019s namesake twist. The resultant form becomes another sculpture among the sculptures within the park.' },
      { image: 'https://media.big.dk/2022/07/wils.jpg?width=800', title: 'EDUCATION', description: 'The density of the urban Arlington neighborhood became the inspiration for the school \u2013 BIG fanned the classrooms to allow each and every floor to be connected to the roof garden on top of the classrooms below. The resultant cascading terraces are connected by a curving stair that weaves through all levels \u2013 inside as well as outside \u2013 making all students, from both programs and all ages, visually and physically connected to each other. Each terrace is landscaped to lend itself not just to the social life of the students but also as informal outdoor spaces for learning.' },
      { image: 'https://media.big.dk/Untitled-1.jpg?width=800', title: 'WORK', description: 'BIG\u2019s design of the Google Bay View campus is the result of an incredibly collaborative design process. Working with a client as data driven as Google has led to an architecture where every single decision is informed by hard information and empirical analysis. The result is a campus where the striking dragonscale solar canopies harvest every photon that hits the buildings; the energy piles store and extract heating and cooling from the ground, and even the naturally beautiful floras are in fact hardworking rootzone gardens that filter and clean the water from the buildings.' },
      { image: 'https://media.big.dk/2022/07/hospitality.jpg?width=800', title: 'HOSPITALITY', description: 'Conceived as a manmade extension of the sloping meadows of the Vall\u00e9e du Joux, the five-story building volume is folded to form a serpentine mountain path ascending from the fields to the roof while opening all spaces inside to visually connect to the valley outside. This full immersion into the local landscape, climate, and flora and fauna makes the guest experience inseparable from the Vall\u00e9e du Joux, the cradle of Swiss watchmaking.' },
      { image: 'https://media.big.dk/2022/07/arc.jpg?width=800', title: 'INFRASTRUCTURE', description: 'CopenHill is a blatant architectural expression of something that would otherwise have remained invisible: it is the cleanest waste-to-energy power plant in the world. As a power plant, CopenHill is so clean that BIG was able to turn its building mass into the bedrock of the social life of the city \u2013 its fa\u00e7ade is climbable, its roof is hikeable and its slopes are skiable. A crystal clear example of Hedonistic Sustainability \u2013 that a sustainable city is not only better for the environment \u2013 it is also more enjoyable for the lives of its citizens.' },
      { image: 'https://media.big.dk/2022/07/via.jpg?width=800', title: 'RESIDENTIAL', description: 'Located at the northern tip of the Hudson River Park, VIA continues the process of greenification in NYC allowing open space to invade the urban fabric of the Manhattan city grid. VIA fuses what seems to be two mutually exclusive typologies \u2013 the courtyard and the skyscraper, into the Courtscraper.' },
      { image: 'https://media.big.dk/2022/08/galaxy.jpg?width=800', title: 'SPACE', description: 'BIG is pioneering new frontiers \u2013 materially, technologically, and environmentally through our work in outer space. The NASA Olympus habitats are designed with the inherent redundancy required for extraterrestrial buildings, while also using groundbreaking robotic construction that uses only in-situ resources with zero waste left behind.' },
      { image: 'https://media.big.dk/2022/09/civic.jpg?width=800', title: 'CIVIC', description: 'Located at the heart of the Copenhagen Zoo, BIG made the entire Panda House enclosure accessible from 360 degrees, turning the two pandas into the new rotation point for Copenhagen Zoo.' },
      { image: 'https://media.big.dk/2022/07/sport.jpg?width=800', title: 'SPORTS', description: 'BIG\u2019s design for sports architecture pushes the boundaries of what athletic facilities can be \u2013 transforming them into civic landmarks that serve communities beyond game day.' },
      { image: 'https://media.big.dk/2022/07/health.jpg?width=800', title: 'HEALTH', description: 'BIG\u2019s healthcare architecture reimagines the hospital as a healing environment where architecture contributes directly to patient well-being and recovery.' },
    ],
  },
  {
    title: 'PRODUCTS',
    text: 'BIG Product team makes product design a literal extension of our efforts in architecture. Architects rarely have the possibility to specify a building component from scratch, limiting our imagination to what is already on the shelves. Our work in furniture, lighting, transportation, and IoT ensures that we connect the big picture to the small details, increasing our overall influence on the built environment.',
    cards: [
      { image: 'https://media.big.dk/2022/07/interiors.jpg?width=800', title: 'LIGHTING', description: 'Our latest design, Stellar Nebula for Italian lighting manufacturer Artemide is a family of lamps designed to interpret and enhance artisanal glass blowing with innovative PVD finishing techniques. Other collaborations with Artemide have led to the award-winning Alphabet and Vine lights - in addition to earlier collaborations with Danish design brands Louis Poulsen and Fritz Hansen.' },
      { image: 'https://media.big.dk/2022/07/wils.jpg?width=800', title: 'FURNITURE', description: 'The Brick sofa series for Jot.Jot is designed to have strong architectural references: a classic brick bond forming the cushion pattern, tied together and fixed with tailor-quality buttons made from fiber concrete. The architectural references are felt in many of our furniture designs - from the VIA chair designed for VIA 57 West building in NYC to the Shanghay chair for BIG\u2019s 2010 Expo Pavilion.' },
      { image: 'https://media.big.dk/Untitled-1.jpg?width=800', title: 'CONSUMER PRODUCTS', description: 'With its two guiding principles \u2013 beauty and simplicity \u2013 the unique shape of DUO Smart Lock is inspired by the architectural principle of the Saddle Roof, making it striking and a perfect fit for any home. Other consumer products include the HAV Porcelain collection for Royal Copenhagen and TURN reusable cups to end single use plastics from events and concerts.' },
      { image: 'https://media.big.dk/2022/07/culture.jpg?width=800', title: 'MOBILITY', description: 'Mobility includes large scale infrastructure projects that tie together cities to bicycles that take you the last stretch home. In collaboration with the engineering team at Virgin Hyperloop One we have designed the pods with a focus on comfort and functionality, defining an entirely new sustainable transportation typology.' },
      { image: 'https://media.big.dk/2022/07/hospitality.jpg?width=800', title: 'INSTALLATIONS', description: 'SKUM is a bubble-like cloud pavilion filled with air, powered by two wind turbines. Fully inflated in seven minutes, the idea was to plug in and play. Debuting as the Tuborg VIP bar at Roskilde Festival 2016, the pavilion features a generous canopy for visitors to relax under its shade.' },
    ],
  },
  {
    title: 'PLANNING',
    text: 'BIG Planning takes a comprehensive view on the built environment, supporting our teams and clients in thinking in the long-term and across multiple scales and systems. We engage with clients early in their process \u2013 before a building is built, or a landscape is designed, to help answer fundamental questions: what, where, why, and for whom should we be building? We engage deeply with communities, institutions, and governments to help answer these questions, and build consensus amongst complex stakeholder groups in the process. We add value to projects by constantly returning to the big picture \u2013 in an age of climate change, aging infrastructure, heavy population growth, and rapid urbanization, built investments must work overtime to achieve social, economic, and environmental success. BIG Planning pursues these goals relentlessly, with results ranging from resilient urban design to regional visioning, and from campus masterplans to planetary strategy.',
    cards: [
      { image: 'https://media.big.dk/2024/10/SPIRAL_Jan_Edit_2.jpg?width=800', title: 'CAMPUS', description: 'Our projects at Google Bay View and Gradient Canopy help to support Google\u2019s campus goals by drastically reducing energy consumption through elements such as geothermal wells and optimized daylight as well as contributing energy to the grid through the use of photovoltaic roof arrays. The site has achieved a LEED-NC v4 Platinum certification and become the largest facility ever to attain the International Living Future Institute (ILFI) Living Building Challenge (LBC) Water Petal Certification.' },
      { image: 'https://media.big.dk/2024/10/copyright_laurianghinitoiu_big_hq_04.jpg?width=800', title: 'CITY', description: 'To accelerate the transformation and advance all aspects of mobility and beyond, a 170-acre former factory site in Susono, at the foothills of Mt. Fuji in Japan, will be transformed into an urban incubator \u2013 Toyota Woven City. Envisioned as a living laboratory to test and advance personal mobility, autonomy, mobility as a service, connectivity, hydrogen-powered infrastructure, and industry collaboration.' },
      { image: 'https://media.big.dk/2022/07/Urbanspace.jpg?width=800', title: 'REGION', description: 'Our vision for the Penang island and region titled BiodiverCity includes an integrated system of localized water resources, renewable energy, and waste management, tied altogether in a human-made ecosystem. Rather than designing a region for cars, we designed BiodiverCity for waterways, rail and different kinds of personal mobility.' },
    ],
  },
  {
    title: 'VISION',
    text: 'BIG Vision brings focus and form to your ideas. As your thought-partner, we translate ideas at any stage into physical space, bringing them one step closer to reality \u2013 in the form of an experience, product, building or city.\n\nWe unlock potential through analysis, experimentation and methodical design. We provoke, test the limits, explore new perspectives and ask the right questions during a series of bespoke engagements. This design approach defines project ambitions, explores its value, and gives clients the tools to make decisions and realize it.\n\nWe believe in the power of unexpected findings when great thinkers, open dialogue and iterative design come together to drive consensus and solve global and human problems.',
    cards: [
      { image: 'https://media.big.dk/2022/07/arc.jpg?width=800', title: 'FUTURE OF RESILIENT CITIES', description: 'As part of UN-Habitat\u2019s New Urban Agenda, we proposed a vision for the world\u2019s first resilient and sustainable floating community for 10,000 residents. Designed as a man-made ecosystem, Oceanix City is anchored in the UN Sustainable Development Goals, channeling flows of energy, water, food and waste to create a blueprint for a modular maritime metropolis.' },
      { image: 'https://media.big.dk/2024/10/2023_Nov_SHF_Exterior-5-edit.jpg?width=800', title: 'FUTURE OF MULTIMEDIA MEMORIALS', description: 'In collaboration with Cirque du Soleil founder Guy Lalibert\u00e9, we reimagined traditional funerary practices to create an immersive experience that preserves personal stories for future generations. The buildings will live in major cities worldwide to serve as a \u201cpublic library of the human experience,\u201d bringing together people from diverse cultures and backgrounds to share stories and celebrate the lives of those who have passed.' },
      { image: 'https://media.big.dk/2022/07/via.jpg?width=800', title: 'FUTURE OF WORK', description: 'Area 2071 is a co-creation space that embodies the UAE\u2019s ambition to position Dubai as a global hub for innovation. Located on the ground floor of Emirates Towers, creative workspaces enable start-ups, corporations, venture capitalists and the government to work side-by-side. A kit-of-parts embraces sharing, collaboration and contemplation to untap the creative potential within Area 2071 residents and the public.' },
    ],
  },
];

function CardItem({ card }: { card: Card }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="w-[300px] min-w-0 shrink-0 lg:w-[420px] xl:w-[500px]">
      <div className="relative max-h-[290px] w-full lg:max-h-[310px] xl:max-h-[350px]">
        <Image
          loading="lazy"
          src={card.image}
          alt={`${card.title} | Bjarke Ingels Group`}
          fill
          sizes="(max-width: 1023px) 300px, (max-width: 1279px) 420px, 500px"
          className="object-cover pointer-events-none"
        />
      </div>
      <h3
        className="group mt-4 flex cursor-pointer items-center gap-2 text-sm uppercase select-none before:-mt-[0.5px] before:inline-block before:h-2 before:w-2 before:bg-black"
        onClick={() => setExpanded(!expanded)}
      >
        {card.title}
        <span className={`-mt-[2px] ml-1 inline-block origin-center transition-transform ${expanded ? 'rotate-45' : ''}`}>+</span>
      </h3>
      <p
        className={`mt-3 text-[13px] leading-4 whitespace-pre-wrap transition-all overflow-hidden ${
          expanded ? 'max-h-[300px] translate-y-0 opacity-100' : 'max-h-0 translate-y-[20px] opacity-0'
        }`}
      >
        {card.description}
      </p>
    </div>
  );
}

function DraggableGallery({ cards }: { cards: Card[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isDown.current = true;
    containerRef.current.style.cursor = 'grabbing';
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDown.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const onMouseUp = useCallback(() => {
    if (!isDown.current || !containerRef.current) return;
    isDown.current = false;
    containerRef.current.style.cursor = '';
  }, []);

  const onMouseLeave = useCallback(() => {
    if (!isDown.current || !containerRef.current) return;
    isDown.current = false;
    containerRef.current.style.cursor = '';
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      className="no-scrollbar flex cursor-grab flex-nowrap gap-[18px] overflow-x-auto pl-7 select-none md:pl-[70px] lg:gap-[26px] lg:pl-[100px] xl:pl-[130px]"
    >
      {cards.map((card, i) => (
        <CardItem key={i} card={card} />
      ))}
      <div className="w-7 min-w-0 shrink-0 md:w-[70px] lg:w-[100px] xl:w-[130px]" />
    </div>
  );
}

export default function AboutPage() {
  const [entranceClass, setEntranceClass] = useState('');

  useEffect(() => {
    const pe = sessionStorage.getItem('page-entrance');
    sessionStorage.removeItem('page-entrance');
    if (pe === 'slide-in-left') {
      setEntranceClass('animate-slide-in-left');
    }
  }, []);

  return (
    <div id="about-section" className={`relative z-10 bg-white pt-[26px] md:pt-[120px] pb-[100px] ${entranceClass}`}>
      {/* Hero */}
      <div className="px-4 md:px-[70px] lg:px-[100px] xl:px-[130px]">
        <h1 className="mb-5 text-[clamp(2rem,10vw,55px)] leading-[1.14em] uppercase md:mb-[60px] lg:text-[70px] xl:text-[100px]">
          About
        </h1>
        <p className="mb-[60px] max-w-[965px] gap-[65px] whitespace-pre-wrap lg:columns-2 lg:gap-[85px] xl:mb-[120px]">
          {heroText}
          <span className="mt-6 block break-before-column lg:mt-0" />
          {heroText2}
        </p>
        <Image
          loading="eager"
          decoding="async"
          fetchPriority="high"
          src="https://media.big.dk/2022/11/wallpapergallery.jpg?width=1600"
          alt="About | Bjarke Ingels Group"
          width={1600}
          height={900}
          className="relative w-full h-auto"
        />
      </div>

      {/* Discipline sections */}
      {sections.map((section) => (
        <div key={section.title}>
          <div className="mt-[60px] px-7 md:px-[70px] lg:mt-[80px] lg:px-[100px] xl:px-[130px]">
            <h2 className="mb-[24px] text-[clamp(1.5rem,6vw,35px)] leading-[1.14em] uppercase lg:mb-[50px]">
              {section.title}
            </h2>
            <p className="mb-[50px] max-w-[965px] gap-[65px] whitespace-pre-wrap lg:mb-[70px] lg:columns-2 lg:gap-[85px]">
              {section.text}
            </p>
          </div>
          <DraggableGallery cards={section.cards} />
        </div>
      ))}
    </div>
  );
}
