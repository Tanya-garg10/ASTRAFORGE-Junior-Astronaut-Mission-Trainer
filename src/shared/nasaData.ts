import { LearningTopic, NASAMediaItem } from './types.ts';

export interface PlanetaryComparisonRow {
  parameter: string;
  moon: string;
  mars: string;
  engineeringImpact: string;
  sourceLabel: string;
  sourceUrl: string;
}

export const PLANETARY_COMPARISON: PlanetaryComparisonRow[] = [
  {
    parameter: 'Surface Gravity',
    moon: '~1.62 m/s² (~16.6% of Earth)',
    mars: '~3.72 m/s² (~38% of Earth)',
    engineeringImpact:
      'Lower gravity reduces structural mass loads and launch escape fuel, but long-term human musculoskeletal deconditioning requires daily resistive exercise.',
    sourceLabel: 'NASA Moon & Mars Facts',
    sourceUrl: 'https://science.nasa.gov/moon/facts/',
  },
  {
    parameter: 'Atmosphere',
    moon: 'Ultra-thin exosphere (near vacuum; negligible pressure)',
    mars: 'Thin CO₂-dominated atmosphere (~95% CO₂, ~0.6% Earth sea-level pressure)',
    engineeringImpact:
      'Both require fully pressurized habitats and airlocks. Mars CO₂ can be harvested for propellant/oxygen (as demonstrated by MOXIE), while dust storms scatter sunlight.',
    sourceLabel: 'NASA Mars Facts',
    sourceUrl: 'https://science.nasa.gov/mars/facts/',
  },
  {
    parameter: 'Surface Temperature',
    moon: 'Extreme swings: ~127°C in sunlight down to -173°C in lunar night (even colder in permanently shadowed craters)',
    mars: 'Cold desert: averages roughly -63°C; ranges from ~20°C near midday equator to below -125°C at poles',
    engineeringImpact:
      'Lunar habitats face severe thermal cycling during 14-day day/night transitions; Martian habitats need continuous active heating against a frigid, thin CO₂ breeze.',
    sourceLabel: 'NASA Moon & Mars Exploration',
    sourceUrl: 'https://science.nasa.gov/moon/exploration/',
  },
  {
    parameter: 'Radiation Environment',
    moon: 'No global magnetic field or atmosphere; high exposure to galactic cosmic rays and solar energetic particles',
    mars: 'No global magnetosphere and thin atmosphere; partial atmospheric attenuation only (~1% of Earth column density)',
    engineeringImpact:
      'Habitats require regolith cover, water walls, or polyethylene shielding plus a dedicated storm shelter during solar particle events.',
    sourceLabel: 'NASA Space Place & Exploration',
    sourceUrl: 'https://spaceplace.nasa.gov/',
  },
  {
    parameter: 'Day / Night Cycle & Solar Flux',
    moon: '~29.5 Earth-day synodic cycle (~14.7 Earth days daylight, ~14.7 days night at equator; polar peaks have near-continuous sunlight)',
    mars: '~24 hr 39 min Martian sol; receives ~43% of Earth solar irradiance (~590 W/m² peak at mean orbital distance)',
    engineeringImpact:
      'Moon receives stronger peak sunlight (~1,361 W/m²) than Mars, but equatorial lunar nights demand huge batteries; polar siting or Mars sols change storage sizing.',
    sourceLabel: 'NASA Science Moon & Mars',
    sourceUrl: 'https://science.nasa.gov/planetary-science/programs/mars-exploration/',
  },
  {
    parameter: 'Communications & Resupply',
    moon: '~1.3-second one-way light delay; ~3-day crew transit',
    mars: '~4 to 24-minute one-way light delay depending on orbital alignment; ~6–9 month transit windows',
    engineeringImpact:
      'Lunar crews can communicate nearly in real time with Earth; Mars crews must operate autonomously during emergencies and maintain higher recycling closure.',
    sourceLabel: 'NASA Mars Exploration',
    sourceUrl: 'https://science.nasa.gov/planetary-science/programs/mars-exploration/',
  },
];

export const NASA_OFFICIAL_REFERENCES = [
  {
    title: 'NASA Moon Facts',
    url: 'https://science.nasa.gov/moon/facts/',
    description: 'Physical parameters, gravity, temperature extremes, and orbital characteristics of Earth’s Moon.',
  },
  {
    title: 'NASA Mars Facts',
    url: 'https://science.nasa.gov/mars/facts/',
    description: 'Martian atmosphere composition, surface temperatures, sol duration, and planetary metrics.',
  },
  {
    title: 'NASA Moon Exploration',
    url: 'https://science.nasa.gov/moon/exploration/',
    description: 'Apollo heritage, Lunar Reconnaissance Orbiter science, and Artemis South Pole exploration strategy.',
  },
  {
    title: 'NASA Mars Exploration',
    url: 'https://science.nasa.gov/planetary-science/programs/mars-exploration/',
    description: 'Perseverance, Curiosity, MOXIE oxygen experiment, and future human Mars architecture concepts.',
  },
  {
    title: 'NASA Space Place',
    url: 'https://spaceplace.nasa.gov/',
    description: 'Student-accessible explanations of solar weather, radiation, planetary orbits, and spaceflight.',
  },
  {
    title: 'NASA Moon Trek',
    url: 'https://trek.nasa.gov/moon/',
    description: 'Interactive lunar GIS terrain mapping portal built from Lunar Reconnaissance Orbiter data.',
  },
  {
    title: 'NASA Mars Trek',
    url: 'https://trek.nasa.gov/mars/',
    description: 'Interactive Martian elevation and landing-site terrain explorer for Jezero Crater and beyond.',
  },
  {
    title: 'NASA Image & Video Library API',
    url: 'https://images.nasa.gov/',
    description: 'Public multimedia search, asset manifest, metadata, and caption API at images-api.nasa.gov.',
  },
  {
    title: 'NASA Media Usage Guidelines',
    url: 'https://www.nasa.gov/nasa-brand-center/images-and-media/',
    description: 'Guidelines for crediting NASA imagery and distinguishing independent educational projects from official NASA products.',
  },
];

// Curated verified NASA media catalog used as fast-loading fallback when NASA API is unreachable or rate-limited
export const CURATED_NASA_FALLBACK_MEDIA: NASAMediaItem[] = [
  {
    nasaId: 'as11-40-5875',
    title: 'Astronaut Edwin Aldrin Poses on the Lunar Surface (Apollo 11)',
    description:
      'Astronaut Edwin (Buzz) Aldrin Jr., Lunar Module pilot, stands beside the deployed U.S. flag during the Apollo 11 extravehicular activity on the Moon, July 20, 1969.',
    mediaType: 'image',
    thumbnailUrl: 'https://images-assets.nasa.gov/image/as11-40-5875/as11-40-5875~medium.jpg',
    fallbackImageUrl: '/src/assets/images/hero_lunar_outpost_1794761660112.jpg',
    center: 'JSC',
    dateCreated: '1969-07-20',
    photographer: 'Neil Armstrong / NASA',
    keywords: ['Moon', 'Apollo 11', 'Lunar surface', 'EVA'],
    nasaPageUrl: 'https://images.nasa.gov/details/as11-40-5875',
    sourceLabel: 'NASA MEDIA SOURCE',
    credit: 'NASA Johnson Space Center (Apollo 11)',
    restrictionsNote: 'NASA media is generally not copyrighted for educational use; check specific asset metadata for third-party credits.',
  },
  {
    nasaId: 'PIA24264',
    title: "Mastcam-Z's First 360-Degree Panorama at Jezero Crater",
    description:
      'High-resolution 360-degree Martian surface panorama stitched from Mastcam-Z images aboard NASA’s Perseverance rover in Jezero Crater.',
    mediaType: 'image',
    thumbnailUrl: 'https://images-assets.nasa.gov/image/PIA24264/PIA24264~medium.jpg',
    fallbackImageUrl: '/src/assets/images/mars_outpost_horizon_1794761660330.jpg',
    center: 'JPL',
    dateCreated: '2021-02-24',
    photographer: 'NASA/JPL-Caltech/ASU/MSSS',
    keywords: ['Mars', 'Perseverance', 'Jezero Crater', 'Mastcam-Z'],
    nasaPageUrl: 'https://images.nasa.gov/details/PIA24264',
    sourceLabel: 'NASA MEDIA SOURCE',
    credit: 'NASA / JPL-Caltech / ASU / MSSS',
    restrictionsNote: 'Public educational attribution to NASA/JPL-Caltech.',
  },
  {
    nasaId: 'KSC-20170808-PH_CSH01_0092',
    title: 'Seed Planting in Veggie Pillows (ISS Plant Growth Hardware)',
    description:
      'Water and nutrients are added to plants in NASA’s Veggie hardware inside the International Space Station environment simulator chamber at Kennedy Space Center.',
    mediaType: 'image',
    thumbnailUrl: 'https://images-assets.nasa.gov/image/KSC-20170808-PH_CSH01_0092/KSC-20170808-PH_CSH01_0092~medium.jpg',
    fallbackImageUrl: '/src/assets/images/hydroponic_habitat_interior_1794761661143.jpg',
    center: 'KSC',
    dateCreated: '2017-08-08',
    photographer: 'NASA/Cory Huston',
    keywords: ['ISS', 'Greenhouse', 'Space farming', 'Veggie'],
    nasaPageUrl: 'https://images.nasa.gov/details/KSC-20170808-PH_CSH01_0092',
    sourceLabel: 'NASA MEDIA SOURCE',
    credit: 'NASA/Cory Huston (Kennedy Space Center)',
    restrictionsNote: 'NASA educational imagery.',
  },
  {
    nasaId: 'PIA21836',
    title: 'Bastille Day Solar Flare and a Coronal Mass Ejection',
    description:
      'Extreme ultraviolet imagery from NASA’s Solar Dynamics Observatory capturing an M2-class solar flare and coronal mass ejection.',
    mediaType: 'image',
    thumbnailUrl: 'https://images-assets.nasa.gov/image/PIA21836/PIA21836~medium.jpg',
    fallbackImageUrl: '/src/assets/images/solar_flare_magnetosphere_1794761660865.jpg',
    center: 'JPL',
    dateCreated: '2017-07-18',
    photographer: 'NASA/SDO',
    keywords: ['Solar storm', 'Radiation', 'Sun', 'SDO'],
    nasaPageUrl: 'https://images.nasa.gov/details/PIA21836',
    sourceLabel: 'NASA MEDIA SOURCE',
    credit: 'NASA / Solar Dynamics Observatory (SDO)',
    restrictionsNote: 'NASA educational imagery.',
  },
  {
    nasaId: 'Artemis I Launches to the Moon (Official NASA Recap)',
    title: 'Artemis I Launches to the Moon (Official NASA Recap)',
    description:
      'Highlights from NASA’s Artemis I launch on Nov. 16, 2022 from Kennedy Space Center Launch Complex 39B, testing systems for sustained lunar exploration.',
    mediaType: 'video',
    thumbnailUrl: 'https://images-assets.nasa.gov/video/Artemis%20I%20Launches%20to%20the%20Moon%20(Official%20NASA%20Recap)/Artemis%20I%20Launches%20to%20the%20Moon%20(Official%20NASA%20Recap)~large.jpg',
    fallbackImageUrl: '/src/assets/images/hero_lunar_outpost_1794761660112.jpg',
    center: 'HQ',
    dateCreated: '2022-11-16',
    keywords: ['Moon', 'Artemis', 'Lunar exploration'],
    nasaPageUrl: 'https://images.nasa.gov/details/Artemis%20I%20Launches%20to%20the%20Moon%20(Official%20NASA%20Recap)',
    sourceLabel: 'NASA MEDIA SOURCE',
    credit: 'NASA Headquarters / Kennedy Space Center',
    restrictionsNote: 'View original asset manifest on NASA Image & Video Library.',
  },
  {
    nasaId: 'JPL-20210305-M2020f-0001Perseverance Lands on Mars UHD Master',
    title: 'Perseverance Rover Lands on Mars, as the World Watches',
    description:
      'Engineering camera and mission highlights from NASA’s Mars 2020 Perseverance rover touchdown in Jezero Crater on Feb. 18, 2021.',
    mediaType: 'video',
    thumbnailUrl: 'https://images-assets.nasa.gov/video/JPL-20210305-M2020f-0001Perseverance%20Lands%20on%20Mars%20UHD%20Master/JPL-20210305-M2020f-0001Perseverance%20Lands%20on%20Mars%20UHD%20Master~large.jpg',
    fallbackImageUrl: '/src/assets/images/mars_outpost_horizon_1794761660330.jpg',
    center: 'JPL',
    dateCreated: '2021-03-05',
    keywords: ['Mars', 'Perseverance', 'Landing', 'Video'],
    nasaPageUrl: 'https://images.nasa.gov/details/JPL-20210305-M2020f-0001Perseverance%20Lands%20on%20Mars%20UHD%20Master',
    sourceLabel: 'NASA MEDIA SOURCE',
    credit: 'NASA / JPL-Caltech',
    restrictionsNote: 'View original asset manifest on NASA Image & Video Library.',
  },
];

export const LEARNING_TOPICS: LearningTopic[] = [
  {
    id: 'breathing-oxygen',
    title: 'How Astronauts Breathe in Space',
    category: 'Life Support & ECLSS',
    summary: 'Closed-loop oxygen generation through water electrolysis and CO₂ scrubbing.',
    explanation:
      'On Earth, plants and oceans constantly replenish oxygen and absorb carbon dioxide. Inside a sealed lunar or Martian habitat, exhaled CO₂ rapidly becomes toxic unless removed by chemical or regenerative scrubbers. Spacecraft like the International Space Station generate breathable oxygen by splitting purified water into hydrogen and oxygen using electrical energy (electrolysis).',
    keyFacts: [
      'Aboard the ISS, NASA’s Oxygen Generation System uses electrolysis to split H₂O into O₂ and H₂.',
      'Carbon dioxide removal assemblies prevent hypercapnia inside closed pressurized cabins.',
      'On Mars, NASA’s MOXIE experiment aboard Perseverance demonstrated producing oxygen directly from Martian atmospheric CO₂.',
    ],
    simulationConnection:
      'In ASTRAFORGE, your Oxygen Generation System draws both Electricity (kWh) and Water (L) every day to replenish habitat O₂ reserves.',
    imageUrl: '/src/assets/images/hero_lunar_outpost_1794761660112.jpg',
    imageCaption: 'Pressurized lunar outpost modules rely on closed-loop oxygen and CO₂ scrubbing.',
    nasaQuery: 'International Space Station oxygen life support',
    sourceTitle: 'NASA Space Place & ISS Life Support',
    sourceUrl: 'https://science.nasa.gov/planetary-science/programs/mars-exploration/',
    quiz: [
      {
        id: 'q1',
        question: 'Which two inputs does an Oxygen Generation System primarily require to produce O₂ via electrolysis?',
        options: [
          'Nitrogen gas and solar heat',
          'Purified water and electrical power',
          'Martian regolith and methane',
        ],
        correctIndex: 1,
        explanation:
          'Electrolysis passes electrical current through purified water (H₂O) to split it into breathable oxygen (O₂) and hydrogen (H₂).',
      },
      {
        id: 'q2',
        question: 'What did NASA’s MOXIE experiment demonstrate on Mars?',
        options: [
          'Producing oxygen from Mars’s CO₂-rich atmosphere',
          'Mining deep liquid oceans on Mars',
          'Growing wheat outdoors without a habitat',
        ],
        correctIndex: 0,
        explanation:
          'MOXIE successfully converted Martian carbon dioxide into pure oxygen on the surface of Jezero Crater.',
      },
    ],
  },
  {
    id: 'water-recycling',
    title: 'How Water Is Recycled Beyond Earth',
    category: 'Resource Recovery',
    summary: 'Recovering humidity, greywater, and wastewater so missions do not run dry.',
    explanation:
      'Water is heavy—every liter launched from Earth costs thousands of dollars in rocket propellant. Instead of hauling single-use water tanks, space habitats capture cabin humidity, crew sweat, wash water, and urine, then filter and distill them into clean drinking water. Higher recovery percentages drastically shrink resupply mass.',
    keyFacts: [
      'NASA’s Environmental Control and Life Support System (ECLSS) on the ISS achieves over 90% water recovery.',
      'Water is also required for electrolysis (oxygen production) and hydroponic greenhouse crops.',
      'Recycling units consume significant electrical energy for pumps, distillation, and catalytic oxidation.',
    ],
    simulationConnection:
      'Upgrading your Water Recycling Unit in ASTRAFORGE raises recovery efficiency from ~70% to over 92%, reducing net daily water loss at the cost of extra kWh.',
    imageUrl: '/src/assets/images/hydroponic_habitat_interior_1794761661143.jpg',
    imageCaption: 'Closed-loop stainless steel water loops supply both crew hydration and hydroponic plants.',
    nasaQuery: 'water recycling International Space Station',
    sourceTitle: 'NASA Moon & Exploration Resources',
    sourceUrl: 'https://science.nasa.gov/moon/exploration/',
    quiz: [
      {
        id: 'q1',
        question: 'Why is a high water-recycling percentage critical for a 60-day Moon or Mars outpost?',
        options: [
          'Because launching bulk water from Earth is extremely heavy and costly',
          'Because water freezes permanently above 20°C',
          'Because solar panels run on liquid water',
        ],
        correctIndex: 0,
        explanation:
          'Water is dense and expensive to launch. Closing the water loop reduces cargo mass and keeps electrolysis and farming supplied.',
      },
    ],
  },
  {
    id: 'space-farming',
    title: 'How Food Can Be Grown in Space',
    category: 'Bioregenerative Systems',
    summary: 'Hydroponics, LED spectrums, and why crops trade power for nutrition.',
    explanation:
      'Pre-packaged meals lose vitamins over multi-year missions and add launch weight. Controlled-environment greenhouses use hydroponics or aeroponics under tuned red and blue LEDs to grow leafy greens and dwarf crops with minimal soil. Plants also absorb CO₂ and release small amounts of oxygen via photosynthesis.',
    keyFacts: [
      'NASA astronauts have grown and eaten red romaine lettuce and radishes aboard the ISS Veggie facility.',
      'Hydroponic trays recirculate nutrient-rich water directly to roots without heavy Earth soil.',
      'Grow lights and climate pumps make greenhouses one of the largest electrical loads in an outpost.',
    ],
    simulationConnection:
      'Building Greenhouse modules boosts daily food rations and adds a modest oxygen bonus, while increasing electricity and water demand.',
    imageUrl: '/src/assets/images/hydroponic_habitat_interior_1794761661143.jpg',
    imageCaption: 'Calibrated LED arrays enable photosynthesis inside insulated habitat bays.',
    nasaQuery: 'Veggie space station lettuce plants',
    sourceTitle: 'NASA Space Place',
    sourceUrl: 'https://spaceplace.nasa.gov/',
    quiz: [
      {
        id: 'q1',
        question: 'What major engineering trade-off comes with expanding a space greenhouse?',
        options: [
          'It eliminates the need for radiation shielding',
          'It increases electrical power and water demand for LEDs and irrigation',
          'It turns oxygen into carbon monoxide',
        ],
        correctIndex: 1,
        explanation:
          'Artificial grow lighting and humidification require steady electrical power and water circulation.',
      },
    ],
  },
  {
    id: 'radiation-shielding',
    title: 'Why Radiation Shielding Matters',
    category: 'Crew Safety',
    summary: 'Defending astronauts against solar particle events and galactic cosmic rays.',
    explanation:
      'Earth’s thick atmosphere and global magnetic field deflect most dangerous space radiation. Neither the Moon nor Mars has a protective global magnetosphere. Astronauts face steady galactic cosmic rays (GCRs) and sudden spikes from solar coronal mass ejections. Dense hydrogen-rich materials—like water walls, polyethylene, or packed planetary regolith—help absorb incoming particles.',
    keyFacts: [
      'During solar storms, astronauts move to heavily shielded storm shelters at the core of a habitat.',
      'Hydrogen-rich materials such as polyethylene and water reduce secondary radiation scatter better than thin aluminum alone.',
      'Mars’s thin CO₂ atmosphere provides partial shielding compared to the airless Moon, but not enough for unshielded stays.',
    ],
    simulationConnection:
      'Radiation Shielding modules raise continuous protection, while an Emergency Shelter lets you ride out Solar Storm events without severe crew health loss.',
    imageUrl: '/src/assets/images/solar_flare_magnetosphere_1794761660865.jpg',
    imageCaption: 'Solar eruptions eject energetic particles across the inner solar system.',
    nasaQuery: 'solar flare coronal mass ejection SDO',
    sourceTitle: 'NASA Space Place — Space Weather',
    sourceUrl: 'https://spaceplace.nasa.gov/',
    quiz: [
      {
        id: 'q1',
        question: 'Why are astronauts on the Moon more exposed to solar storms than people on Earth?',
        options: [
          'The Moon has no global magnetic field or thick atmosphere to deflect energetic particles',
          'The Moon is closer to Jupiter',
          'Lunar dust creates nuclear fission',
        ],
        correctIndex: 0,
        explanation:
          'Earth’s magnetosphere and dense atmosphere shield our surface; the Moon lacks both.',
      },
    ],
  },
  {
    id: 'solar-power',
    title: 'How Solar Power Works on Moon vs. Mars',
    category: 'Power & Energy Storage',
    summary: 'Comparing sunlight intensity, dust attenuation, and day/night battery sizing.',
    explanation:
      'Sunlight intensity drops with the square of distance from the Sun. At Earth and the Moon (~1 AU), peak solar irradiance is ~1,361 W/m², while at Mars (~1.52 AU) it averages ~590 W/m². However, Mars has a ~24.6-hour day-night cycle like Earth, whereas equatorial lunar sites endure ~14 Earth days of continuous night unless located on illuminated South Pole crater rims—and Martian dust storms can dim sunlight for weeks.',
    keyFacts: [
      'Mars receives roughly 43% as much solar energy per square meter as the Moon.',
      'Martian dust accumulation and regional dust storms reduce photovoltaic array output.',
      'Battery storage is essential to bridge nighttime power demand without shutting down life support.',
    ],
    simulationConnection:
      'In ASTRAFORGE, Mars requires larger solar arrays per kW generated and loses efficiency during dust storms, while Moon missions face periodic lunar night cycles.',
    imageUrl: '/src/assets/images/mars_outpost_horizon_1794761660330.jpg',
    imageCaption: 'Photovoltaic arrays on Mars must be oversized to offset lower solar flux and atmospheric dust.',
    nasaQuery: 'Mars solar panel rover InSight',
    sourceTitle: 'NASA Mars Facts',
    sourceUrl: 'https://science.nasa.gov/mars/facts/',
    quiz: [
      {
        id: 'q1',
        question: 'Why does a solar panel of the same size generate less peak electricity on Mars than on the Moon?',
        options: [
          'Mars is farther from the Sun and has dust in its thin atmosphere',
          'Mars has stronger gravity that slows photons down',
          'The Moon reflects sunlight twice as fast',
        ],
        correctIndex: 0,
        explanation:
          'At ~1.52 AU from the Sun, Mars receives ~43% of Earth/Moon solar irradiance, and atmospheric dust further attenuates light.',
      },
    ],
  },
  {
    id: 'moon-vs-mars',
    title: 'Why Moon and Mars Environments Differ',
    category: 'Planetary Science',
    summary: 'Gravity, regolith, atmosphere, and communication lag shape every engineering choice.',
    explanation:
      'The Moon is ~384,400 km away—just a 3-day journey with a 1.3-second radio delay—making rapid Earth resupply and real-time flight-controller guidance possible. Mars averages 225 million km away, with light delays up to 24 minutes each way and months-long transit windows, demanding far greater outpost self-sufficiency.',
    keyFacts: [
      'Lunar gravity is ~1/6th of Earth’s; Martian gravity is ~3/8ths of Earth’s.',
      'Mars Trek and Moon Trek map craters, polar water-ice prospects, and landing terrain using NASA orbiter data.',
      'Lunar regolith is sharp and glassy, damaging seals; Martian soil contains reactive perchlorates.',
    ],
    simulationConnection:
      'Choosing Mars in Mission Briefing increases resupply latency and lowers solar yield, rewarding early investment in recycling and battery capacity.',
    imageUrl: '/src/assets/images/hero_lunar_outpost_1794761660112.jpg',
    imageCaption: 'Explore lunar and Martian topography via NASA Moon Trek and Mars Trek.',
    nasaQuery: 'Lunar Reconnaissance Orbiter Moon surface',
    sourceTitle: 'NASA Moon & Mars Trek',
    sourceUrl: 'https://trek.nasa.gov/moon/',
    quiz: [
      {
        id: 'q1',
        question: 'Which operational challenge affects Mars crews far more than Moon crews?',
        options: [
          'One-way communication delays of 4 to 24 minutes requiring autonomous emergency decisions',
          'Complete absence of gravity',
          '14-day continuous darkness every month',
        ],
        correctIndex: 0,
        explanation:
          'Mars’s orbital distance creates multi-minute signal delays, preventing real-time back-and-forth troubleshooting with Earth.',
      },
    ],
  },
  {
    id: 'thermal-control',
    title: 'How Habitats Maintain Safe Temperatures',
    category: 'Thermal Engineering',
    summary: 'Multi-layer insulation, active heat pumps, and radiator loops keep crews near 21°C.',
    explanation:
      'In space vacuum on the Moon, there is no air to carry heat away by convection—equipment in direct sunlight overheats to +127°C while shadowed surfaces plunge to -173°C. Habitats use reflective multi-layer insulation (MLI), internal fluid heat loops, electrical heaters, and external radiators to hold crew quarters around a comfortable 20–22°C.',
    keyFacts: [
      'Active Thermal Control Systems reject excess waste heat from electronics and human bodies via radiators.',
      'During cold nights or Martian winters, electrical heaters prevent water pipes from freezing.',
      'Power shortages directly threaten thermal stability because heaters and coolant pumps stop running.',
    ],
    simulationConnection:
      'If outpost energy drops to zero or your Thermal Control module is damaged, internal habitat temperature drifts toward extreme external cold.',
    imageUrl: '/src/assets/images/mars_outpost_horizon_1794761660330.jpg',
    imageCaption: 'Insulated pressurized domes protect astronauts from severe external temperature swings.',
    nasaQuery: 'spacecraft thermal insulation habitat',
    sourceTitle: 'NASA Moon Facts',
    sourceUrl: 'https://science.nasa.gov/moon/facts/',
    quiz: [
      {
        id: 'q1',
        question: 'What happens to a habitat’s internal temperature if electrical power fails during a cold Martian night?',
        options: [
          'Heaters and thermal loops lose power, causing cabin temperature to drop dangerously',
          'Temperature rises automatically to 50°C',
          'Nothing changes for 100 days',
        ],
        correctIndex: 0,
        explanation:
          'Active heating and thermal circulation pumps require steady power to counter radiative and conductive heat loss.',
      },
    ],
  },
  {
    id: 'engineering-tradeoffs',
    title: 'Why Mission Planning Requires Trade-Offs',
    category: 'Systems Engineering',
    summary: 'Balancing mass, power budgets, crew size, and safety margins.',
    explanation:
      'Every spacecraft or surface base operates within strict mass, volume, and power budgets. Adding two extra astronauts doubles daily food, water, and oxygen demand. Adding life-support recycling and greenhouses solves consumable shortages—but raises electrical load, which in turn demands larger solar arrays and heavier batteries. Great mission engineers optimize the whole interconnected system rather than any single part.',
    keyFacts: [
      'NASA systems engineers track SWaP: Size, Weight, and Power across every subsystem.',
      'Safety margins (reserves) absorb unexpected failures like dust storms or pump malfunctions.',
      'Sensitivity analysis ("What-If" modeling) reveals which bottleneck fails first under stress.',
    ],
    simulationConnection:
      'Use ASTRAFORGE’s What-If Lab to test how changing crew size or solar/recycling levels shifts your limiting bottleneck.',
    imageUrl: '/src/assets/images/hero_lunar_outpost_1794761660112.jpg',
    imageCaption: 'Every outpost module trades construction budget and electrical power for survival resilience.',
    nasaQuery: 'NASA mission control Artemis',
    sourceTitle: 'NASA Moon Exploration',
    sourceUrl: 'https://science.nasa.gov/moon/exploration/',
    quiz: [
      {
        id: 'q1',
        question: 'Why might upgrading a Greenhouse and Water Recycler simultaneously cause a mission crisis if Solar Power is ignored?',
        options: [
          'Both upgrades consume extra electricity, potentially draining batteries below thermal/O₂ thresholds',
          'Greenhouses block radio signals',
          'Water recyclers absorb solar panels',
        ],
        correctIndex: 0,
        explanation:
          'Life-support systems are coupled: adding powered equipment without expanding generation and storage creates an energy deficit.',
      },
    ],
  },
];
