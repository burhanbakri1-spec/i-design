'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Article {
  image: string;
  title: string;
  text: string;
  noClamp?: boolean;
}

const articles: Article[] = [
  {
    image: 'https://media.big.dk/Untitled-1-1.jpg?width=1600&height=800',
    title: 'SUSTAINABLE MANUFACTURING',
    text: 'The Plus is the first factory building in the world that meets the BREEAM Outstanding certification\u2019s strict environmental requirements for safe, healthy, and good physical working environments. Constructed in just 18 months, the 7,000 m\u00b2 production facility is made of local PEFC-certified cross-laminated timber (CLT) and glued-laminated timber (glulam), low-carbon concrete, and recycled steel. \n\nThe square roof above the office area is one of only two concrete elements in the building alongside the foundation, both made from a mixture of high-strength and low-carbon concrete to minimize emissions and material use. \n\nThe factory\u2019s energy and heating demands are partly met with the help of 900 rooftop solar panels which generate about 250,000 kWh of renewable energy annually, 17 geothermal wells, and heat pumps hidden behind the walls to capture excess energy from the process of drying the components and convert it into heat that is then fed back into the production line and used to warm the building. \n\nHidden behind the walls of each wing is a technical corridor, in which waste products from the manufacturing process are recycled for reuse. Here, the water needed for washing metal components is cleaned and filtered so that 90% of it can be cycled back into the process, while wood chips and sawdust are collected and sent off to a biomass power plant to be burned for electricity. \n\nEvery aspect of the design is based on principles of renewable and clean energy to match Vestre\u2019s eco-friendly production, such as ensuring a minimum of 50% lower greenhouse gas emissions than comparable factories.',
  },
  {
    image: 'https://media.big.dk/0_0002_Google-Bay-View-22-04-BIG-THA-5816-1.jpg?width=1600&height=800',
    title: 'NET-ZERO EMISSIONS & OPERATIONS',
    text: 'Located on a 42-acre site at the NASA Ames Research Center, Google\u2019s Bay View campus consists of three buildings totaling 1.1 million square feet and approximately 18 acres of open space. The all-electric campus has achieved a LEED-NC v4 Platinum certification\u2014making it the largest LEED v4 BD+C: NC Platinum certified project in the world\u2014and has become the largest facility ever to attain the International Living Future Institute (ILFI) Living Building Challenge (LBC) Water Petal Certification. \n\nOn the exterior, the buildings feature a first-of-its-kind \u201cdragonscale\u201d solar skin roof equipped with 50,000 silver solar panels that generate a total of nearly four megawatts of energy, approximately 40% of the buildings\u2019 annual energy use. \n\nThe clerestory windows dotting the canopy bring in abundant natural light into the workspaces, and a highly efficient HVAC system helps cut down on overall energy use. Combining on-site renewable energy generation with fulfillment of the majority of heating and cooling needs by geothermal systems, in combination with reducing energy needs via passive design measures, means that the Google Bay View HQ contributes substantially to Google\u2019s goal of achieving net-zero emissions by 2030. \n\nThe integrated geothermal pile system at Bay View is the largest in North America, estimated to reduce carbon emissions by roughly 50%: of 3,900 structural piles, 2,200 are utilized for geothermal and contain embedded pipes connected to heat recovery chillers that move heat energy from one place to another. These heat recovery chillers connected to the geothermal system also generate domestic hot water for the buildings. In the winter, the campus recovers heat from the ground and uses it to warm the building. In the summer, the buildings are cooled by capturing heat from the air and, instead of evaporating it with water, transferring it directly to the ground via the geothermal system. This means the campus is able to reduce the amount of water used for cooling at Bay View by 90%, which equates to 5 million gallons of water annually. \n\nTo help deliver on Google\u2019s commitment to replenish 120% of the water the HQ consumes by 2030, the site is net water-positive, with all non-potable water demands being met using the recycled water it generates on site. The on-site systems built by Google collect, treat, and reuse all stormwater and wastewater and provide habitat restoration, sea level rise protection, and access to the beauty of natural wetlands for both Googlers and the public on the nearby Bay Trail. The campus includes 17.3 acres of high-value natural areas\u201435% of the site is dedicated to promoting urban agriculture through native pollinator habitat, demonstration garden beds, and bee boxes while wet meadows, woodlands, and marsh contribute to Google\u2019s broader efforts to reestablish missing essential habitat in the Bay Area.',
  },
  {
    image: 'https://media.big.dk/0_0000_Skypark-Business-Center-24.jpg?width=1600&height=800',
    title: 'THE FUTURE OF TIMBER CONSTRUCTION',
    text: 'From bringing the first heavy timber building to the iconic Johns Hopkins University Homewood campus to building the first timber terminal at Zurich Airport, BIG is adopting timber as a core material in our architecture across all building scales and types. \n\nSkypark Business Center is one of Europe\u2019s largest wooden buildings and the first in an ambitious master plan that aims to turn the Luxembourg airport district into a thriving economic hub. Located in Findel adjacent to terminal A, the project is not only a landmark to visitors entering the country but also to Luxembourg\u2019s architectural and sustainability ambitions. \n\nThe building design takes a holistic approach to sustainability, addressing environmental, economic, and social aspects. Its sustainable practices respond to growing concerns over resource scarcity and climate change, focusing on reducing energy consumption, material waste, and emissions in construction. The building\u2019s upper structure uses 15,000 m\u00b3 of CE-conforming and FSC-certified timber, a renewable, biogenic material with a substantially lower carbon footprint than conventional building materials such as concrete and steel. The timber structure also serves as a carbon sink, reducing carbon in the planet\u2019s atmosphere during the life of the building. The use of the advanced timber technology led to the development of new construction regulations in Luxembourg, supported by extensive studies carried out during the design process. \n\nWater management is another key element of the building\u2019s sustainable design. Extensive green roofs and terraces assist with stormwater management, absorbing rainwater while also helping to insulate the building and reduce the urban heat island effect. A rainwater harvesting system stores up to 150 m\u00b3 of water for irrigation, and potable water use by building occupants is reduced due to sensor-activated systems that minimize water use. \n\nThe health and well-being of occupants are central to the building\u2019s design. The fa\u00e7ade incorporates a double-skin system that optimizes natural ventilation, prevents overheating, and enhances comfort. Despite the proximity to the airport, the design ensures high indoor air quality via the use of filtered cavities that enable ventilation without exposing the interior to external pollutants. Green rooftop gardens and terraces are designed with vegetation that considers local wildlife and adheres to airport security requirements, creating green pedestrian paths and relaxation areas that support the mental and physical health of occupants. \n\nSkypark Business Center is equipped with smart building technologies that monitor and optimize energy use. Sensors collect real-time data on room occupancy, weather, and other factors to improve the efficiency of heating, cooling, and electricity usage. The system also facilitates contactless access through a mobile app, reducing the use of plastic fobs and paper. \n\nSkypark\u2019s commitment to sustainability is further emphasized by targeting BREEAM Excellent, WELL Gold, and WELL Platinum certifications.',
  },
  {
    image: 'https://media.big.dk/0_0005_copyright_laurianghinitoiu_big_hq_02.jpg?width=1600&height=800',
    title: 'UNI-GREENE CONCRETE',
    text: 'Located on a narrow pier in Copenhagen\u2019s Nordhavn neighborhood, BIG\u2019s new headquarters is a 27-meter-tall, 7-storey structure, anchored in the city harbor\u2019s industrial heritage. The building embodies the first application of Uni-Green concrete, developed in collaboration with Unicon, where the cement clinker is replaced with calcined clay and lime filler, representing a CO2 reduction of approximately 25% compared to traditional concrete. Tested and developed during construction, BIG HQ stands as a testament to the durability and potential of the Uni-Green, as well as a pioneer project not only in terms of materials but also in building methods\u2014pushing the boundaries for the possibilities of concrete. \n\nThe building integrates solar and geothermal energy systems that contribute to a 60% reliance on renewable energy, covering 84% of the building\u2019s heat demand and 100% of the cooling demand. The latest Life Cycle Assessment completed in accordance with the Danish Standard BR18:2020 indicates a carbon-equivalency impact of 11.3 kg CO2e per square meter per year of building life. The building is designed to achieve DGNB Gold.',
  },
  {
    image: 'https://media.big.dk/0_0004_JRC_DD_Aerial-02.jpg?width=1600&height=800',
    title: 'HARVESTING SOLAR ENERGY',
    text: 'Located at the former EXPO \u00b492 site in Isla de la Cartuja, the new 9,900 m\u00b2 building for the European Commission ties into the City of Sevilla\u2019s goal to become a global benchmark for sustainability by 2025 and the local vision of the eCity Sevilla project to decarbonize and transition Isla de la Cartuja to 100% renewable energy sources.\n\nInformed by the shaded plazas and streets of Seville, BIG proposes to cover the entire project site with a cloud of solar canopies sheltering the plaza, garden, and research building underneath, akin to the pergolas typical to Seville. The canopies consist of square lightweight PV sheets supported by slender columns. The roofscape cascades down from the center to a human-scale height at its periphery, creating a variety of public spaces underneath. \n\nThe passive design of the building through its shallow floorplate and constant shading under the pergola cloud enables natural cross ventilation and ideal light qualities, reducing the energy consumption typically used on artificial lighting, air conditioning, and mechanical ventilation. The design prioritizes locally sourced materials, such as limestone, wood, and ceramic tiling. The structure is low-carbon concrete, reducing up to 30% of typical CO2 emissions, while the pergola cloud is made from recycled steel. Outdoor gardens, greenery from the region, and water elements reduce/eliminate the heat island effect and create a comfortable microclimate.',
  },
  {
    image: 'https://media.big.dk/2024/10/DYMAK_AERIAL.jpg?width=1600&height=800',
    title: 'HOLISTIC FOCUS ON EMBODIED AND OPERATIONAL CARBON',
    text: 'The mission for Dymak\u2019s new HQ was to be the most sustainable office building in Denmark, which has resulted in a building form optimized to reduce embodied carbon content, reduce energy needs, increase on-site energy production, and to ensure a high level of occupant well-being. \n\nThe round shape provides a continuously connected interior experience, while the varying roof height buffers occupants from the noise of the adjacent highway while optimizing views to nature on the opposite side of the building. The form of the roof has been determined by orienting a series of 880 photovoltaic panels, consisting of 11 unique shapes, such that solar radiation potential is optimized for energy production. \n\nReducing carbon emissions was a driver of all material choices on the project, from the mixed timber and precast concrete structure to the interior finishes. Early studies included assessments of the carbon and cost impact of various structural materials and grid dimensions, with the results used to drive the architectural design. As the design progressed, meticulous studies were completed for almost all interior materials, enabling a selection of finishes with low embodied carbon while maintaining a high quality of materiality. \n\nCurrently under construction, the Dymak Headquarters is set to achieve DGNB Gold and Heart Certification. Current Life-Cycle Analysis (LCA) results\u2014completed in accordance with Danish Standard BR18:2020\u2014indicate a carbon-equivalency impact of 10.5 kgCO2e per square meter per year of life of the building.',
  },
  {
    image: 'https://media.big.dk/0_0001_R_Hjortshoj-Flugt-PRESS-24.jpg?width=1600&height=800',
    title: 'REUSING EXISTING BUILDINGS',
    text: 'Located at the site of Denmark\u2019s largest refugee camp from World War II, BIG has adapted and extended one of the camp\u2019s few remaining structures\u2014a hospital building\u2014into a 1,600 m\u00b2 museum. \n\nFrom the very beginning of the design process, it was vital for BIG and the client, Vardemuseerne, to preserve the two hospital buildings. The buildings are some of the last remaining physical manifestations of the former refugee camp, and not only is their preservation invaluable for future generations to understand the past and the present, the buildings also directly informed our design of the extension by means of their unique elongated form, structure, and materiality. \n\nFLUGT is an example of how adaptive reuse can result in sustainable, functional, and beautiful buildings that preserve our shared history while standing out architecturally.',
  },
  {
    image: 'https://media.big.dk/0_0003_V23_Royal-Boulevard.jpg?width=1600&height=800',
    title: 'PRESERVATION, REGENERATION, & RESILIENCE IN PLANNING',
    text: 'Bhutan has a unique context and approach to sustainability: it is a carbon-negative country and global biodiversity hotspot with a commitment to supporting its population\u2019s well-being through the Gross National Happiness index (GNH). Three quarters of Bhutan\u2019s geographical area is forest, and the constitution mandates maintaining at least 60% forest cover in perpetuity. It is home to many endemic, endangered, and rare species across a variety of landscapes from mountains to interweaving rivers and floodplains. \n\nLocated in the town of Gelephu in Southern Bhutan, the 2,500 km\u00b2 masterplan titled \u2018Gelephu Mindfulness City\u2019 (GMC) by BIG, Arup, and Cistri is informed by Bhutanese culture, the principles of the GNH, and the country\u2019s strong spiritual heritage. To guide the work over the next 100 years from design through construction and operation, the design team has developed a bespoke draft sustainability framework to help achieve Bhutan\u2019s sustainability aspirations, provide resilient social and economic infrastructure, and opportunities to counter its current socioeconomic challenges whilst retaining the natural and cultural core principles that make the country so unique. \n\nThe masterplan framework prioritizes conservation and ecological enhancement by not only preserving all existing forests for a total cover of the site of 85% but also creating new ecological corridors and forested areas to support wildlife habitats. This approach will strengthen biodiversity, ensure long-term environmental health, and limit the development land to only 4% of the total project site. Our approach to resilience embraces nature-based solutions, allowing the 35 Natural Rivers and 500+ Creeks to naturally expand their space, minimizing reliance on engineered flood control solutions. By enhancing the natural waterways and converting them into swales, we can manage stormwater effectively, particularly during flood events, using these natural processes. \n\nFor both architecture and landscape, we propose the use of locally sourced materials such as river stone, bamboo, and timber. By limiting building heights to a maximum of 6 floors, with an average FAR of 0.9, we significantly reduce the need for structural concrete or steel, lowering the environmental impact of construction. Rather than demolishing existing structures and roads, we will focus on renovating and repurposing them, maintaining the site\u2019s history and reducing waste from construction. The masterplan emphasizes creating a vibrant, human-centered environment with lively streets and public spaces designed to encourage outdoor social interaction. These spaces will foster community engagement and well-being. \n\nThe city will be fully powered by renewable energy, with the construction of 2 new dams on the western side of the site, with a particular focus on hydropower and a supplementary mix of solar panels. The energy produced will greatly exceed local demand, ensuring sufficient power for data centers, machine learning, and energy-intensive activities like mining, all sustained by a clean, renewable energy supply. Most of the existing agricultural fields will be preserved and enhanced, ensuring the city can produce its own food locally. This will promote food security and reduce reliance on external sources. \n\nThe masterplan is designed to be highly sustainable for mobility by prioritizing pedestrians and public transportation, following the principles of the 15-minute city. Every district is efficiently connected by trackless trams in flat zones and cable cars for uphill areas, with stops spaced evenly across the development area at 1 km intervals. Surrounding these stops are public spaces, mixed-use developments, and essential amenities, all of which reduce the need for long trips within the city. This results in a significant reduction of private vehicle use, with an estimated mode share of only 8% for cars, compared to 38% for public transport and 56% for soft micro-mobility. Streets are limited to a maximum of four vehicular lanes, allowing for much more expansive pedestrian zones, linear parks, and recreational boulevards, further enhancing the sustainable urban landscape. \n\nFinally, the masterplan will adopt best practices in sustainability standards and aims to create a new certification system. This system will measure not only carbon emission reduction targets but also social and environmental sustainability, with a special focus on individual health and spirituality. By addressing holistic well-being, GMC sets a new benchmark in city planning that integrates environmental stewardship with human-centered, mindful living practices.',
  },
  {
    image: 'https://media.big.dk/0_0006_20221125-104409-5106.jpg?width=1600&height=800',
    title: 'ENHANCING NATURAL HABITATS & BIODIVERSITY',
    text: 'The Treehotel in Swedish Lapland is known for its broad variety of cabins, with each one having a distinct identity that responds and interacts differently with the surrounding forest. BIG\u2019s aim was to amplify Treehotel\u2019s focus on sustainability and natural tourism and create a resilient design in a region with strong seasonal climatic contrasts. \n\nInventories in Norrbotten County, carried out by ornithologists and the County Administrative Board, show that a number of different bird populations are decreasing due to forestry and climate change. \n\nDesigned in collaboration with Treehotel and Swedish ornithologist Ulf \u00d6hman, the Biosphere cabin brings 350 birdhouses to the Harads village, with the mission to decrease the downward spiral of the bird and bat population in the region.',
  },
  {
    image: 'https://media.big.dk/2022/11/MicrosoftTeams-image-8.jpg?width=1600&height=800',
    title: 'PLAN FOR THE PLANET',
    text: 'Plan for the Planet is a research project that aims to establish a plan for achieving a carbon neutral planet Earth in 10 years, while addressing the fundamental challenges of energy, transport, resources, biodiversity, resilience, pollution, water, food, and prosperous living conditions for a world with up to 10 billion inhabitants.',
    noClamp: true,
  },
];

function ArticleCard({ article }: { article: Article }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article className="mt-[40px] items-start px-4 md:mx-auto md:px-[70px] lg:max-w-[80vw] lg:px-[180px] xl:max-w-[70vw] 2xl:max-w-[62vw]">
      <div className="relative aspect-video w-full shrink-0">
        <Image
          loading="eager"
          decoding="async"
          fetchPriority="high"
          src={article.image}
          alt={`${article.title} | Bjarke Ingels Group`}
          fill
          sizes="(max-width: 1023px) 100vw, 80vw"
          className="object-cover"
        />
      </div>
      <h2 className="mt-6 mb-5 text-sm text-[#1b1b1b] uppercase">{article.title}</h2>
      <p
        className={`text-sm whitespace-pre-wrap text-[#898989] ${
          article.noClamp || expanded
            ? ''
            : 'line-clamp-8 overflow-hidden md:line-clamp-5 xl:line-clamp-7 2xl:line-clamp-8'
        }`}
      >
        {article.text}
      </p>
      {!article.noClamp && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex cursor-pointer items-center gap-2 text-xs text-[#898989] uppercase select-none"
        >
          {expanded ? 'Read less' : 'Read more'}
          <span className={`-mt-[2px] ml-1 inline-block origin-center transition-transform ${expanded ? 'rotate-45' : ''}`}>+</span>
        </button>
      )}
    </article>
  );
}

export default function SustainabilityPage() {
  const [entranceClass, setEntranceClass] = useState('');

  useEffect(() => {
    const pe = sessionStorage.getItem('page-entrance');
    sessionStorage.removeItem('page-entrance');
    if (pe === 'slide-in-left') {
      setEntranceClass('animate-slide-in-left');
    }
  }, []);

  return (
    <div id="sustainability-section" className={`relative z-10 bg-white pb-[100px] ${entranceClass}`}>
      <h1 className="mb-5 -translate-x-1.5 px-4 pt-[26px] text-[clamp(1.8rem,9vw,48px)] leading-[1.14em] uppercase md:px-[70px] md:pt-[80px] lg:mb-[60px] lg:px-[100px] lg:pt-[120px] lg:text-[70px] xl:px-[130px] xl:text-[100px]">
        Sustainability
      </h1>
      {articles.map((article, i) => (
        <ArticleCard key={i} article={article} />
      ))}
    </div>
  );
}
