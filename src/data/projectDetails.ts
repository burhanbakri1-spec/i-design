export interface ProjectDetail {
  client: string;
  typology: string;
  size: string;
  status: string;
  quote: string;
  quoteAuthor: string;
  features: { title: string; text: string; image: string }[];
  team: { label: string; members: string[] }[];
}

const clients: Record<string, string> = {
  'the-plus': 'Vestre',
  'not-a-hotel-setouchi': 'NOT A HOTEL Inc.',
  'copenhill': 'Amager Resource Center',
  'amager-bakke': 'Amager Resource Center',
  'le-goeland': 'Saint-Malo Municipality',
  'musee-des-confluences': 'Lyon Métropole',
  'the-shed': 'Durst Organization',
  'vessel': 'Related Companies',
  'rasmus-knudsen-school': 'Odense Municipality',
  'bloxhub': 'Realdania',
  'nordic-pavilion': 'Danish Arts Foundation',
  'royal-danish-library': 'Danish Ministry of Culture',
  'auckland-art-gallery': 'Auckland Council',
  'kistefos-museum': 'Kistefos Museum',
  'mountain-dwellings': 'Høpfner A/S',
  '8-house': 'St. Frederikslund Invest',
  'vm-houses': 'Høpfner A/S',
  'tietgen-dormitory': 'Fonden Tietgenkollegiet',
  'sdu-campus': 'University of Southern Denmark',
  'kaleidoscope': 'C40 Cities',
  'silver-spur': 'LVMH Group',
  'the-narrow-house': 'Private Client',
  'forest-retreat': 'Private Client',
  'monochrome-apartment': 'Prada Group',
  'loft-living': 'Related Companies',
  'japandi-serenity': 'Aman Resorts',
  'art-deco-revival': 'Faena Group',
  'brutalist-home': 'Private Client',
  'coastal-villa': 'Private Client',
  'urban-jungle': 'IKEA',
  'sky-view': 'Emaar Properties',
  'desert-rose': 'Royal Mansour',
  'ice-hotel': 'Icehotel AB',
  'treehouse-lodge': 'Rainforest Alliance',
  'underwater-suite': 'Conrad Hotels',
  'villa-m': 'Private Client',
  'courtyard-house': 'Private Client',
  'cliffside-cabin': 'Private Client',
  'urban-bridge': 'Rotterdam Municipality',
  'green-facade': 'CapitaLand',
  'solar-pavilion': 'Masdar City',
  'floating-market': 'Bangkok Metropolitan',
  'lunar-habitat': 'NASA',
  'mars-station': 'SpaceX',
  'orbital-hotel': 'Virgin Galactic',
  'space-dock': 'Blue Origin',
  'aquatic-centre': 'London Legacy DC',
  'stadium-park': 'LA City Council',
  'climbing-gym': 'Innsbruck Tourism',
  'healing-garden': 'Tokyo Healthcare',
  'wellness-centre': 'Zurich Insurance',
  'mental-health-pavilion': 'Beyond Blue',
  'superkilen': 'Copenhagen Municipality',
  'high-line': 'Friends of the High Line',
  'gardens-by-the-bay': 'National Parks Board',
  'botanical-bridge': 'Bristol City Council',
  'rooftop-meadow': 'Galeries Lafayette',
  'coastal-walk': 'Sydney Harbour Trust',
  'vertical-garden': 'Milan Municipality',
  'desert-oasis': 'Scottsdale Parks',
  'rain-garden': 'Portland Water Bureau',
  'alpine-terrace': 'Zermatt Tourism',
  'eco-district': 'Freiburg City Council',
  'smart-city': 'Songdo IBD',
  'riverfront-revival': 'Pittsburgh Urban Redevelopment',
  'university-campus': 'Oxford University',
  'tech-park': 'Bangalore Development Authority',
  'cultural-quarter': 'Manchester City Council',
  'green-belt': 'London Mayor\'s Office',
  'coastal-plan': 'Barcelona Regional',
  'transit-oriented': 'Tokyo Metro',
  'industrial-redevelopment': 'Essen City Council',
  'leaf-lamp': 'Artemide',
  'modular-shelf': 'IKEA',
  'bamboo-bike': 'Bali Eco Cycles',
  'ceramic-set': 'Muji',
  'kinetic-mobile': 'Studio Drift',
  'woven-chair': 'Hay',
  'solar-lantern': 'Little Sun',
  '3d-printed-vase': 'Dus Architects',
  'light-pavilion': 'TeamLab',
  'foldable-stool': 'Vitra',
  'co-working-tower': 'WeWork',
  'creative-hub': 'Berlin Senate',
  'innovation-lab': 'Google',
  'media-centre': 'Reliance Industries',
  'green-office': 'ING Bank',
  'urban-beach': 'Rotterdam City',
  'community-garden': 'Detroit Land Bank',
  'sky-park': 'Hong Kong Housing Authority',
  'wetland-park': 'Shanghai Municipal',
  'pocket-park': 'Tokyo Metropolitan',
  'vineyard-terrace': 'Marchesi Antinori',
  'botanical-garden': 'Royal Botanic Gardens',
  'harbour-promenade': 'Sydney Harbour Trust',
  'meditation-garden': 'Kyoto Prefecture',
  'harbour-masterplan': 'Oslo Harbour Authority',
  'eco-corridor': 'Costa Rica Government',
  'innovation-district': 'Boston Planning Agency',
  'residential-masterplan': 'HDB Singapore',
  'arts-district': 'Lisbon Municipality',
  'acoustic-panel': 'Kvadrat',
  'smart-planter': 'Click & Grow',
  'paper-lamp': 'Isamu Noguchi Foundation',
  'cork-stool': 'Amorim',
  'interactive-wall': 'Google Arts & Culture',
  'pop-up-pavilion': 'Serpentine Galleries',
  'infinity-tower': 'Emaar Properties',
  'glass-house': 'Private Client',
  'wave-roof': 'Osaka Prefecture',
  'bamboo-pavilion': 'Bali Cultural Council',
  'urban-wind-farm': 'Eneco',
  'sports-arena': 'Madrid City Council',
  'health-clinic': 'Rwandan Ministry of Health',
  'space-observatory': 'ESO',
  'hospitality-resort': 'Six Senses',
  'coworking-campus': 'WeWork',
  'art-school': 'Oslo National Academy',
  'green-school-bali': 'Green School Foundation',
  'future-learning-lab': 'Helsinki Education Department',
  'rooftop-haven': 'CapitaLand',
  'hanging-gardens-barcelona': 'Barcelona City Council',
};

const sizes: Record<string, string> = {
  'the-plus': '7,000 / 75,347',
  'not-a-hotel-setouchi': '3,200 / 34,445',
  'copenhill': '41,000 / 441,320',
  'amager-bakke': '41,000 / 441,320',
  'le-goeland': '850 / 9,150',
  'musee-des-confluences': '14,000 / 150,695',
  'the-shed': '18,500 / 199,132',
  'vessel': '5,000 / 53,820',
  'rasmus-knudsen-school': '12,000 / 129,167',
  'bloxhub': '8,500 / 91,493',
  'nordic-pavilion': '600 / 6,458',
  'royal-danish-library': '21,000 / 226,042',
  'auckland-art-gallery': '7,500 / 80,729',
  'kistefos-museum': '1,800 / 19,375',
  'mountain-dwellings': '33,000 / 355,208',
  '8-house': '61,000 / 656,597',
  'vm-houses': '25,000 / 269,098',
  'tietgen-dormitory': '26,000 / 279,862',
  'sdu-campus': '15,000 / 161,459',
  'kaleidoscope': '2,500 / 26,910',
  'creative-hub': '12,400 / 133,472',
  'desert-rose': '14,705 / 158,284',
  'desert-oasis': '14,705 / 158,284',
  'sky-view': '58,000 / 624,306',
};

const quotes: Record<string, { text: string; author: string }> = {
  'the-plus': {
    text: 'The Plus is conceived as a tour de force in low-carbon materiality: mass timber construction, clay tiles, clay mortar, and eelgrass lower the embodied carbon of the building while providing a warm and organic atmosphere.',
    author: 'Bjarke Ingels — Founder & Creative Director, IDESIGN',
  },
  'not-a-hotel-setouchi': {
    text: 'This retreat is designed to dissolve the boundary between architecture and nature, creating a space where guests can reconnect with the elemental forces that shape our world.',
    author: 'Bjarke Ingels — Founder & Creative Director, IDESIGN',
  },
  'copenhill': {
    text: 'Copenhill is a clear example of hedonistic sustainability — a waste-to-energy plant that also serves as a ski slope, hiking trail, and climbing wall. It generates clean energy while generating joy.',
    author: 'Bjarke Ingels — Founder & Creative Director, IDESIGN',
  },
  'amager-bakke': {
    text: 'By transforming a conventional industrial facility into a public amenity, we have created a new typology for urban infrastructure — one that gives back to the community.',
    author: 'Bjarke Ingels — Founder & Creative Director, IDESIGN',
  },
  'musee-des-confluences': {
    text: 'The museum is conceived as a gateway between knowledge and wonder, its crystalline form reflecting the confluence of science, art, and humanity.',
    author: 'Bjarke Ingels — Founder & Creative Director, IDESIGN',
  },
  'the-shed': {
    text: 'The Shed is a cultural chameleon — its movable shell allows it to adapt to any artistic expression, from intimate performances to large-scale installations.',
    author: 'Bjarke Ingels — Founder & Creative Director, IDESIGN',
  },
  'vessel': {
    text: 'Vessel is not a building but a destination — a honeycomb of spaces that invites exploration and connection, offering unparalleled views of the Hudson Yards.',
    author: 'Bjarke Ingels — Founder & Creative Director, IDESIGN',
  },
  'le-goeland': {
    text: 'Inspired by the graceful flight of the seagull, the pavilion captures the essence of the Breton coastline — a delicate balance between land and sea. The sculptural form emerges from the landscape like a wing catching the wind, creating a dialogue between architecture and the maritime environment.',
    author: 'Bjarke Ingels — Founder & Creative Director, IDESIGN',
  },
  'superkilen': {
    text: 'Superkilen is a celebration of diversity — a park where global cultures converge through objects and artifacts sourced from over 50 countries.',
    author: 'Bjarke Ingels — Founder & Creative Director, IDESIGN',
  },
  'high-line': {
    text: 'The High Line demonstrates how abandoned infrastructure can be reimagined as a public space that brings nature, art, and community together above the city streets.',
    author: 'Bjarke Ingels — Founder & Creative Director, IDESIGN',
  },
  '8-house': {
    text: '8 House is a three-dimensional urban neighborhood where the traditional horizontal city is folded into a vertical landscape, creating an interconnected community.',
    author: 'Bjarke Ingels — Founder & Creative Director, IDESIGN',
  },
  'mountain-dwellings': {
    text: 'Mountain Dwellings invert the typical relationship between parking and living — placing homes above a parking garage, each with a terraced garden that cascades down the slope.',
    author: 'Bjarke Ingels — Founder & Creative Director, IDESIGN',
  },
  'kistefos-museum': {
    text: 'The Twist museum is a habitable bridge that twists at its center, transforming a simple crossing into a sculptural journey through art and landscape.',
    author: 'Bjarke Ingels — Founder & Creative Director, IDESIGN',
  },
  'creative-hub': {
    text: 'Creative Hub represents a new chapter in architectural innovation, where the past and future coalesce to inspire the next generation of artists.',
    author: 'Bjarke Ingels — Founder & Creative Director, IDESIGN',
  },
  'sky-view': {
    text: 'Sky View is a vertical oasis suspended between earth and sky — a hotel where every surface, every vista, and every spatial sequence is calibrated to elevate the human spirit through the simple act of looking outward.',
    author: 'Bjarke Ingels — Founder & Creative Director, IDESIGN',
  },
};

const featuresList: Record<string, { title: string; text: string }[]> = {
  'the-plus': [
    { title: 'SQUARE BLOCK', text: 'The headquarters\' programs are connected in a continuous flow to create a coherent and transparent workspace.' },
    { title: 'PROTECTED COURTYARD', text: 'A central courtyard at the heart of the building is protected from the noise of the highway.' },
    { title: 'DYNAMICS', text: 'The dynamic location is referenced in the round shape of the building, with no sharp corners to create a seamless flow.' },
    { title: 'FORMGIVING', text: 'The cascading roof tilts towards the south to provide the ideal angle for efficient solar energy utilization.' },
  ],
  'copenhill': [
    { title: 'SKI SLOPE', text: 'A 400-meter artificial ski slope on the roof provides year-round recreational opportunities in the heart of Copenhagen.' },
    { title: 'CLEAN ENERGY', text: 'The plant converts waste into clean energy for 150,000 households while emitting minimal pollutants.' },
    { title: 'CLIMBING WALL', text: 'The facade features the world\'s tallest climbing wall, integrated seamlessly into the building\'s design.' },
  ],
  '8-house': [
    { title: 'FIGURE-EIGHT FORM', text: 'The figure-eight shape creates two internal courtyards and allows natural light to reach all residences.' },
    { title: 'CONTINUOUS PATH', text: 'A continuous public path winds from ground to roof, creating an urban promenade through the building.' },
    { title: 'MIXED-USE PROGRAM', text: 'The building integrates residential, commercial, and office spaces in a single interconnected volume.' },
  ],
  'le-goeland': [
    { title: 'SCULPTURAL FORM', text: 'The pavilion\'s wing-like roof sweeps upward, echoing the silhouette of a seagull in flight and creating a landmark on the Saint-Malo coastline.' },
    { title: 'MARITIME MATERIALITY', text: 'Local stone, weathering steel, and timber are used to create a palette that ages gracefully in the coastal climate, referencing the region\'s shipbuilding heritage.' },
    { title: 'PANORAMIC OUTLOOK', text: 'Floor-to-ceiling glazing frames uninterrupted views of the bay, dissolving the boundary between interior and the vast seascape beyond.' },
    { title: 'SHELTERED TERRACE', text: 'A cantilevered deck extends towards the sea, offering visitors an immersive experience of the coastal elements while remaining sheltered from the wind.' },
  ],
  'superkilen': [
    { title: 'THREE ZONES', text: 'The park is divided into three zones: the Red Square for sports, the Black Market for urban living, and the Green Park for nature.' },
    { title: 'GLOBAL COLLECTION', text: 'Objects from 50+ countries — from Moroccan fountains to Chinese palm trees — create a truly international urban space.' },
  ],
  'creative-hub': [
    { title: 'DESIGN CONCEPT', text: 'Studios organized around a central open courtyard, fostering collaboration and chance encounters between artists.' },
    { title: 'MATERIALITY', text: 'Recycled timber framework set against original concrete walls, preserving the industrial heritage while introducing warmth.' },
    { title: 'SPATIAL EXPERIENCE', text: 'Variable high ceilings and saw-tooth skylights provide optimal natural lighting for artist studios and gallery spaces.' },
  ],
  'the-shed': [
    { title: 'KINETIC SHELL', text: 'The building\'s telescoping outer shell glides on rails, extending the footprint by 15 meters to create a vast, column-free event space.' },
    { title: 'ADAPTIVE REUSE', text: 'The design integrates a preserved historic structure with a new movable envelope, blending heritage with cutting-edge engineering.' },
    { title: 'FLEXIBLE PROGRAM', text: 'From intimate performances to large-scale exhibitions, the variable configuration accommodates an unprecedented range of cultural events.' },
  ],
  'sky-view': [
    { title: 'CANTILEVERED POOL', text: 'An infinity pool extends 12 meters beyond the building envelope, creating the sensation of swimming into the sky. The glass-bottom feature offers vertiginous views of the city 300 meters below.' },
    { title: 'SKY LOBBY', text: 'The triple-height arrival hall at level 60 features a living green wall spanning 25 meters and a kinetic art installation that responds to wind patterns at altitude.' },
    { title: 'TERRACED SUITES', text: 'Each suite features a private outdoor terrace with integrated planting, creating a cascading garden that climbs the full height of the tower.' },
    { title: 'WIND-TUNED FACADE', text: 'The sculptural facade is engineered to channel wind loads around the structure, reducing lateral sway by 30% while framing panoramic views.' },
  ],
};

const defaultFeatures = (project: { title: string; description: string; category: string; subCategory: string }) => [
  { title: 'DESIGN CONCEPT', text: `The ${project.title} embodies a bold architectural vision that redefines its context through innovative form and materiality.` },
  { title: 'MATERIALITY', text: `Sustainable materials and advanced construction techniques ensure longevity, performance, and minimal environmental impact.` },
  { title: 'SPATIAL EXPERIENCE', text: `The interior spaces are designed to maximize natural light, flexibility, and human comfort across all programmatic requirements.` },
];

const defaultTeam = [
  { label: 'Partner in Charge', members: ['Bjarke Ingels', 'Ole Elkjær-Larsen'] },
  { label: 'Project Manager', members: ['Joos Jerne'] },
  { label: 'Project Leader', members: ['Lisbet Fritze Trentemøller'] },
  { label: 'Project Team', members: ['Celia de la Osa Muñoz', 'Celina Holck', 'Christian Rasmussen', 'Emil Westlin', 'Finn Nørkjær', 'Frederik Lyng', 'Giulia Orlando', 'Ioannis Mathioudakis', 'Jakub Kulisa', 'Kamilla Heskje', 'Laura Watte', 'Lucas Malthe Mikkelsen', 'Marius Tromholt-Richter', 'Matthew Thomson', 'Narisara Ladawal Schröder', 'Oliver Steen', 'Richard Howis', 'Snorre Nash', 'Sofia Papadopoulou', 'Søren Mortensen', 'Victor-Antoine Delorme'] },
  { label: 'Collaborators', members: ['Cj Group', 'OBH Gruppen', 'Henry Jensen', 'ZERO Engineering'] },
];

const detailCache = new Map<string, ProjectDetail>();

export function getProjectDetail(id: string, project: { title: string; description: string; category: string; subCategory: string; images: string[] }): ProjectDetail {
  const cached = detailCache.get(id);
  if (cached) return cached;

  const quote = quotes[id] || {
    text: `${project.title} represents a new chapter in architectural innovation — a project that challenges conventions and inspires new ways of thinking about the built environment.`,
    author: 'Bjarke Ingels — Founder & Creative Director, IDESIGN',
  };

  const features = featuresList[id] || defaultFeatures(project);

  const result: ProjectDetail = {
    client: clients[id] || `${project.title} Commission`,
    typology: project.subCategory || project.category,
    size: sizes[id] || Math.floor(1000 + Math.random() * 20000).toLocaleString('en-US'),
    status: 'Completed',
    quote: quote.text,
    quoteAuthor: quote.author,
    features: features.map((f, i) => ({
      ...f,
      image: project.images[i % project.images.length] || project.images[0],
    })),
    team: defaultTeam,
  };
  detailCache.set(id, result);
  return result;
}
