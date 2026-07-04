'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface Office {
  name: string;
  image: string;
  description: string;
}

const offices: Office[] = [
  { name: 'IDESIGN COPENHAGEN', image: 'https://media.big.dk/2024/01/bhq-small.jpg?width=800', description: 'Our headquarters in Copenhagen\'s Nordhavn district houses a diverse team of architects, engineers, and designers working across all scales — from furniture to masterplans.' },
  { name: 'IDESIGN NEW YORK', image: 'https://media.big.dk/2022/02/test2.jpg?width=800', description: 'Located in Brooklyn, our New York studio leads some of our most iconic high-rise and civic projects across the Americas.' },
  { name: 'IDESIGN LONDON', image: 'https://media.big.dk/2024/01/big-lon-small.jpg?width=800', description: 'Our London office at 1 Finsbury Avenue drives projects across Europe with a focus on sustainable urban development and workplace design.' },
  { name: 'IDESIGN BARCELONA', image: 'https://media.big.dk/AGP1886_9147-PREVIA_edit-pm-web.jpg?width=800', description: 'Barcelona brings Mediterranean creativity to IDESIGN, leading projects in Southern Europe, the Middle East, and beyond.' },
  { name: 'IDESIGN LOS ANGELES', image: 'https://media.big.dk/2023/10/20230924_BIG-LAX-OFFICE-PHOTO_PA_1-2.jpg?width=800', description: 'Our LA studio on Santa Monica\'s Wilshire Boulevard anchors our West Coast presence, driving entertainment, tech, and mixed-use projects.' },
];

const locations = ['All', 'Barcelona', 'Copenhagen', 'London', 'Los Angeles', 'New York', 'Shanghai', 'Zürich'];
const departments = ['All', 'Architects', 'Business Development', 'Design Technology', 'Executive Management', 'Finance', 'Interior', 'Landscape', 'Model Shop', 'People', 'Products'];

const jobs = [
  { title: 'BIM Manager', dept: 'Design Technology', loc: 'Barcelona', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/f5d310c2-3fc2-4bd3-9c5b-4c5e03691d1c/apply' },
  { title: 'Jr. Project Manager', dept: 'Architects', loc: 'Los Angeles', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/de779f53-1dba-478a-85fc-d10669db6274/apply' },
  { title: 'Global Finance Director', dept: 'Finance', loc: 'Copenhagen', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/20575e3e-99eb-4012-8a9d-4af00e261e5e/apply' },
  { title: 'Tax Manager', dept: 'Finance', loc: 'Copenhagen', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/d4a751ed-0179-4d49-8d36-733b61ef033f/apply' },
  { title: 'Chief Operating Officer (COO)', dept: 'Executive Management', loc: 'Copenhagen', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/c288de98-ac01-499a-ae60-c4788ee46959/apply' },
  { title: 'Junior Designer', dept: 'Architects', loc: 'Los Angeles', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/afc15bb1-1301-43c6-8b57-66c47a5d9e5f/apply' },
  { title: 'Design Assistant', dept: 'Architects', loc: 'Shanghai', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/9d796eda-1e7e-4291-b40f-4ab4e2271472/apply' },
  { title: 'Praktikant:in (100%)', dept: 'Architects', loc: 'Zürich', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/0a8b5b53-8c73-4fed-a30d-57ee58e3800e/apply' },
  { title: 'Architekt:in', dept: 'Architects', loc: 'Zürich', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/4af8c526-f47a-4d0c-96a3-beb3bfc7dc9f/apply' },
  { title: 'Senior Architect (Florida Licensed)', dept: 'Architects', loc: 'New York', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/b232d913-c8aa-4543-bc4f-290ac67b8766/apply' },
  { title: 'People Manager', dept: 'People', loc: 'London', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/f328e30d-daf9-4752-83c3-8f4dca8a257d/apply' },
  { title: 'Business Development Specialist', dept: 'Business Development', loc: 'New York', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/952d171f-792f-4127-95a2-0762b56b9d32/apply' },
  { title: 'Industrial Design Assistant', dept: 'Products', loc: 'Copenhagen', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/89933aba-f0a0-424a-b7dc-2a1d33b8ab1b/apply' },
  { title: 'Model Shop Manager', dept: 'Model Shop', loc: 'Barcelona', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/687c1acd-1f37-4e47-a957-0142b751fda8/apply' },
  { title: 'Project Delivery Manager', dept: 'Architects', loc: 'Barcelona', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/4ddf20b4-c0f1-4199-8dc7-f053e767263b/apply' },
  { title: 'Senior Architect \u2013 Hospitality Specialist', dept: 'Architects', loc: 'Barcelona', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/87676c89-0503-488c-9cd3-771e5254a4b8/apply' },
  { title: 'Senior Architect \u2013 Tower Specialist', dept: 'Architects', loc: 'Barcelona', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/4a0cac08-f164-4288-9286-86cd78cdfbc8/apply' },
  { title: 'Senior Architect. On-site Project in Cyprus', dept: 'Architects', loc: 'Barcelona', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/79d84eee-37a8-4932-9a28-8bd763a16db5/apply' },
  { title: 'Junior Landscape Designer', dept: 'Landscape', loc: 'New York', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/873b6ab0-95ea-4590-9e2e-e8ddd738e732/apply' },
  { title: 'Architekt:in oder Senior Architekt:in - Ausf\u00fchrungsplanung', dept: 'Architects', loc: 'Zürich', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/b1c6507f-a639-4ffb-9f1f-30632c6096d6/apply' },
  { title: 'Project Manager', dept: 'Architects', loc: 'Barcelona', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/ce3f35c5-e88d-45ab-9a06-73560a71515a/apply' },
  { title: 'Design Assistant', dept: 'Architects', loc: 'Barcelona', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/04367db3-bf9b-4441-bf75-9fd8ad3d0e8d/apply' },
  { title: 'Senior Architect', dept: 'Architects', loc: 'Barcelona', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/33803bb9-1e47-4488-b717-cfe4c97ca5c1/apply' },
  { title: 'Senior Architect', dept: 'Architects', loc: 'Los Angeles', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/1b9362ae-2b5b-4886-9593-0166d6a184ad/apply' },
  { title: 'Landscape Architect/Designer', dept: 'Landscape', loc: 'New York', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/8aea5b84-ae9d-495a-8a9c-052629881d17/apply' },
  { title: 'Senior Architect', dept: 'Architects', loc: 'New York', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/3c4c0e60-1678-42bc-9f6c-57d9fffcd753/apply' },
  { title: 'Architect', dept: 'Architects', loc: 'Los Angeles', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/9ab3e16a-56c9-4ef5-a262-0ce3976d0aa2/apply' },
  { title: 'Landscape Design Assistant', dept: 'Landscape', loc: 'Copenhagen', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/3e6b4971-d710-4043-96f5-6cd9dd49d2b6/apply' },
  { title: 'Architect (strong ability with Rhino)', dept: 'Architects', loc: 'Barcelona', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/2a9732ae-3b9f-46e2-a519-32ce76319075/apply' },
  { title: 'Constructing Architect', dept: 'Architects', loc: 'Barcelona', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/14023d26-7f98-42ff-b1dc-52c17a8aa63a/apply' },
  { title: 'Senior Architect with fa\u00e7ade experience', dept: 'Architects', loc: 'Barcelona', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/50199354-03cf-4950-adfb-b4dfc7c8f7de/apply' },
  { title: 'Designer', dept: 'Architects', loc: 'New York', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/630acd07-2e0b-460a-9120-41ae16d49d64/apply' },
  { title: 'Interior Designer', dept: 'Interior', loc: 'New York', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/fe730ec7-ce34-4bae-9356-8d3ee8948c94/apply' },
  { title: 'Architect', dept: 'Architects', loc: 'New York', url: 'https://bjarkeingelsgroup.careers.hibob.com/jobs/ce3f4755-97cf-4ff2-85ce-76119b7810bd/apply' },
];

function OfficeCardItem({ office }: { office: Office }) {
  return (
    <div className="w-[240px] min-w-0 shrink-0 lg:w-[336px] xl:w-[400px]">
      <img
        loading="lazy"
        src={office.image}
        alt={office.name}
        className="relative max-h-[232px] w-full pointer-events-none lg:max-h-[248px] xl:max-h-[280px]"
      />
      <h3 className="mt-4 flex items-center gap-[0.4cm] text-sm uppercase select-none before:-mt-[0.5px] before:inline-block before:h-2 before:w-2 before:bg-black">
        {office.name}
      </h3>
    </div>
  );
}

function DraggableOfficeGallery({ offices }: { offices: Office[] }) {
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
      className="no-scrollbar flex cursor-grab flex-nowrap gap-[18px] overflow-x-auto select-none mb-[80px]"
    >
      {offices.map((office, i) => (
        <OfficeCardItem key={i} office={office} />
      ))}
      <div className="w-7 min-w-0 shrink-0 md:w-[70px] lg:w-[100px] xl:w-[130px]" />
    </div>
  );
}

export default function CareersPage() {
  const [entranceClass, setEntranceClass] = useState('');
  const [filterLoc, setFilterLoc] = useState('All');
  const [filterDept, setFilterDept] = useState('All');

  useEffect(() => {
    const pe = sessionStorage.getItem('page-entrance');
    sessionStorage.removeItem('page-entrance');
    if (pe === 'slide-in-left') {
      setEntranceClass('animate-slide-in-left');
    }
  }, []);

  const filteredJobs = jobs.filter((j) => {
    if (filterLoc !== 'All' && j.loc !== filterLoc) return false;
    if (filterDept !== 'All' && j.dept !== filterDept) return false;
    return true;
  });

  return (
    <div id="careers-section" className={`relative z-10 bg-white pb-[100px] ${entranceClass}`}>
      <div className="mx-auto px-7 md:px-[70px] lg:px-[100px] xl:px-[130px]">
        <h1 className="mb-5 -translate-x-1.5 pt-[26px] text-[55px] leading-[1.14em] uppercase md:pt-20 lg:mb-[60px] lg:pt-[120px] lg:text-[70px] xl:text-[100px]">
          Careers
        </h1>

        <p className="mb-4 max-w-[965px] text-sm leading-relaxed text-[#666]">
          Our journey started in Copenhagen in 2005, followed by an office in NYC in 2010, London in 2016, Barcelona in 2019 and most recently Shenzhen. We have completed more than 60 buildings in 10+ countries and never limit ourselves to a specific region &ndash; we go where our projects are.
        </p>
        <p className="mb-[60px] max-w-[965px] text-sm leading-relaxed text-[#666] lg:mb-[80px]">
          Over the last two decades, we have grown organically to a 700+ person family worldwide. Working on new projects, typologies and challenges &ndash; we are joined by new IDESIGNers with the skills, experience and expertise our projects need. Join our team!
        </p>

        {/* Office cards — draggable gallery */}
        <DraggableOfficeGallery offices={offices} />

        {/* Open jobs */}
        <h2 className="text-[35px] leading-[1.14em] uppercase mb-6 lg:mb-8">Open jobs</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-8 mb-8">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase text-[#9e9e9e]">Location</span>
            <select
              value={filterLoc}
              onChange={(e) => setFilterLoc(e.target.value)}
              className="text-xs uppercase bg-transparent border border-[#ccc] px-4 py-2 text-[#666] focus:outline-none cursor-pointer"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase text-[#9e9e9e]">Department</span>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="text-xs uppercase bg-transparent border border-[#ccc] px-4 py-2 text-[#666] focus:outline-none cursor-pointer"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Jobs table */}
        <div className="w-full mb-[80px]">
          <div className="grid grid-cols-3 gap-[2cm] text-[15px] uppercase text-black font-semibold pb-3 border-b border-[#eee] mb-2 px-2">
            <span>Title</span>
            <span>Department</span>
            <span>Location</span>
          </div>
          {filteredJobs.map((job, i) => (
            <div
              key={i}
              className="grid grid-cols-3 gap-[2cm] text-sm py-3 px-2 border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors text-[#1b1b1b] mb-[0.05cm]"
            >
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">{job.title}</span>
              <span className="text-black text-xs uppercase self-center">{job.dept}</span>
              <span className="text-black text-xs uppercase self-center">{job.loc}</span>
            </div>
          ))}
          {filteredJobs.length === 0 && (
            <p className="text-sm text-[#999] py-8 text-center">No open positions match your filters.</p>
          )}
        </div>

        {/* Design process */}
        <h2 className="text-[35px] leading-[1.14em] uppercase mb-6 lg:mb-8">Design Process</h2>
        <p className="mb-8 max-w-[965px] text-sm leading-relaxed text-[#666] lg:mb-10">
          There is no monopoly on creativity at IDESIGN. When we come up with ideas, we try to be as uncritical as possible during conception and when we edit, we apply immense rigor. Anyone can come up with the idea and it doesn&apos;t matter where or who the idea comes from - what matters is why you choose it. Our design process is best described through Darwin&apos;s evolutionary theory. As life evolves, so should our cities and buildings. Darwin&apos;s famous evolutionary tree from the &apos;Origin of Species&apos; could practically be a diagram of how we work: our architecture evolves through generations of design meetings in process of excess and selection - many ideas are born and only the ones that live long enough to pollinate, pass on their attributes to the next design meeting.
        </p>

        {/* Process image */}
        <div className="mb-[80px]">
          <img
            loading="eager"
            decoding="async"
            fetchPriority="high"
            src="https://media.big.dk/2022/11/3.jpg?width=1600"
            alt="Design Process | IDESIGN"
            className="relative w-full"
          />
        </div>
      </div>
    </div>
  );
}
