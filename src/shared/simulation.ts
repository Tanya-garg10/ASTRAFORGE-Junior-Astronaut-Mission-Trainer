import {
  BudgetTier,
  DailyHistoryPoint,
  Destination,
  Difficulty,
  InstalledModule,
  MissionConfig,
  MissionEvent,
  MissionOutcome,
  MissionReport,
  MissionState,
  ModuleId,
  OutpostModuleDefinition,
  ResourceMetric,
  WhatIfComparisonResult,
  WhatIfInput,
  WhatIfScenarioProjection,
} from './types.ts';

/**
 * ILLUSTRATIVE EDUCATIONAL SIMULATION COEFFICIENTS
 * Note: These constants are simplified educational parameters inspired by NASA ECLSS
 * and planetary surface mission concepts. They are NOT certified aerospace engineering constants.
 */
export const SIMULATION_COEFFICIENTS = {
  // Crew daily baseline demand (illustrative educational rates)
  oxygenKgPerPersonPerDay: 0.84, // ~0.84 kg O2/day human metabolic baseline
  waterLitersPerPersonPerDay: 3.6, // Drinking, food rehydration, hygiene baseline
  foodRationsPerPersonPerDay: 1.0, // 1 crew-day ration (~2,800 kcal equivalent)

  // Production / Capacity per module level (illustrative)
  oxygenGenKgPerLevelPerDay: 2.35, // Electrolysis O2 output per level
  oxygenGenWaterCostPerKgO2: 1.12, // Stoichiometric water input ~1.12 L per kg O2
  greenhouseFoodPerLevelPerDay: 1.85, // Rations/day per greenhouse level
  greenhouseO2BonusPerLevelPerDay: 0.35, // Supplemental photosynthetic O2
  greenhouseWaterLossPerLevelPerDay: 1.4, // Transpiration/loop loss

  // Power generation (kWh/day per solar array level)
  moonSolarKwhPerLevelBase: 46, // Higher solar irradiance (~1,361 W/m²)
  marsSolarKwhPerLevelBase: 26, // ~43% irradiance at 1.52 AU + atmospheric dust factor
  batteryKwhCapacityPerLevel: 55, // Energy storage bank per level

  // Water recycling efficiency by module level (fraction recovered)
  waterRecoveryByLevel: [0, 0.72, 0.82, 0.89, 0.93, 0.95],

  // Thermal targets
  idealHabitatTempC: 21.0,
};

export const OUTPOST_MODULES: Record<ModuleId, OutpostModuleDefinition> = {
  habitat: {
    id: 'habitat',
    name: 'Habitat Module',
    category: 'Core',
    baseCost: 90,
    upgradeCostMultiplier: 1.5,
    maxLevel: 4,
    powerPerLevelKw: -6,
    description: 'Pressurized living and laboratory volume housing crew quarters, airlocks, and ECLSS racks.',
    resourceImpactSummary: '+20% O₂/Water/Food storage cap per level · -6 kWh/day power',
    capacityEffect: 'Expands pressurized storage buffers and improves crew recovery.',
    maintenancePerDay: 0.3,
    scienceExplanation:
      'Pressurized habitats maintain Earth-like ~101.3 kPa or exploration ~56 kPa nitrogen-oxygen atmospheres against near-vacuum conditions.',
    gridSlot: { col: 1, row: 1 },
  },
  solar_array: {
    id: 'solar_array',
    name: 'Solar Power Array',
    category: 'Power',
    baseCost: 70,
    upgradeCostMultiplier: 1.4,
    maxLevel: 5,
    powerPerLevelKw: 34, // display reference; actual depends on Moon/Mars irradiance
    description: 'Tracking photovoltaic wing arrays converting sunlight into outpost electrical power.',
    resourceImpactSummary: '+46 kWh/day (Moon) or +26 kWh/day (Mars) per level',
    capacityEffect: 'Increases primary daytime energy generation.',
    maintenancePerDay: 0.35,
    scienceExplanation:
      'Because Mars orbits at ~1.52 AU, solar arrays receive roughly 43% of the sunlight intensity available on the Moon.',
    gridSlot: { col: 0, row: 0 },
  },
  battery: {
    id: 'battery',
    name: 'Battery Storage',
    category: 'Power',
    baseCost: 65,
    upgradeCostMultiplier: 1.35,
    maxLevel: 5,
    powerPerLevelKw: -1,
    description: 'High-density lithium-ion and regenerative fuel cell banks bridging nights and storms.',
    resourceImpactSummary: '+55 kWh energy storage capacity per level · -1 kWh/day thermal upkeep',
    capacityEffect: 'Prevents blackouts during lunar twilight cycles or Martian dust storms.',
    maintenancePerDay: 0.2,
    scienceExplanation:
      'Energy storage decouples continuous life-support demand from intermittent solar illumination.',
    gridSlot: { col: 1, row: 0 },
  },
  greenhouse: {
    id: 'greenhouse',
    name: 'Hydroponic Greenhouse',
    category: 'Life Support',
    baseCost: 85,
    upgradeCostMultiplier: 1.45,
    maxLevel: 5,
    powerPerLevelKw: -11,
    description: 'Closed-loop LED hydroponic bay cultivating leafy greens, dwarf wheat, and radishes.',
    resourceImpactSummary: '+1.85 food rations/day · +0.35 kg O₂/day · -11 kWh/day · -1.4 L water/day',
    capacityEffect: 'Offsets crew food depletion and supplements oxygen scrubbing.',
    maintenancePerDay: 0.4,
    scienceExplanation:
      'Calibrated red/blue LEDs drive photosynthesis while nutrient-film water recirculation minimizes mass.',
    gridSlot: { col: 2, row: 1 },
  },
  water_recycler: {
    id: 'water_recycler',
    name: 'Water Recycling Unit',
    category: 'Life Support',
    baseCost: 80,
    upgradeCostMultiplier: 1.45,
    maxLevel: 5,
    powerPerLevelKw: -7,
    description: 'Vapor-compression distillation and catalytic filtration loop recovering cabin humidity and wastewater.',
    resourceImpactSummary: 'Boosts water recovery up to 95% · -7 kWh/day per level',
    capacityEffect: 'Dramatically reduces net daily water consumption.',
    maintenancePerDay: 0.35,
    scienceExplanation:
      'Inspired by ISS ECLSS recovery hardware that reclaims over 90% of urine, sweat, and cabin condensate.',
    gridSlot: { col: 0, row: 1 },
  },
  oxygen_gen: {
    id: 'oxygen_gen',
    name: 'Oxygen Generation System',
    category: 'Life Support',
    baseCost: 75,
    upgradeCostMultiplier: 1.4,
    maxLevel: 5,
    powerPerLevelKw: -8,
    description: 'Proton-exchange membrane electrolyzer splitting purified water into breathable O₂.',
    resourceImpactSummary: '+2.35 kg O₂/day · -2.63 L H₂O/day · -8 kWh/day per level',
    capacityEffect: 'Scales active breathable oxygen production for larger crews.',
    maintenancePerDay: 0.35,
    scienceExplanation:
      'Water electrolysis (2H₂O → 2H₂ + O₂) links oxygen survival directly to water and electrical budgets.',
    gridSlot: { col: 2, row: 0 },
  },
  radiation_shield: {
    id: 'radiation_shield',
    name: 'Radiation Shielding',
    category: 'Protection',
    baseCost: 80,
    upgradeCostMultiplier: 1.45,
    maxLevel: 4,
    powerPerLevelKw: 0,
    description: 'Hydrogen-rich polyethylene blankets and sintered regolith berms absorbing cosmic rays.',
    resourceImpactSummary: '+15% modeled radiation protection per level · 0 kWh/day',
    capacityEffect: 'Lowers daily crew radiation dose and protects electronics.',
    maintenancePerDay: 0.15,
    scienceExplanation:
      'Low-atomic-number materials like hydrogen-rich polymers and water walls attenuate incoming protons with less secondary scatter.',
    gridSlot: { col: 0, row: 2 },
  },
  thermal_control: {
    id: 'thermal_control',
    name: 'Thermal Control System',
    category: 'Protection',
    baseCost: 70,
    upgradeCostMultiplier: 1.4,
    maxLevel: 4,
    powerPerLevelKw: -6,
    description: 'Ammonia/glycol coolant loops, external radiator panels, and internal resistance heaters.',
    resourceImpactSummary: 'Stabilizes cabin near 21°C · -6 kWh/day per level',
    capacityEffect: 'Prevents freezing during cold nights and overheating in direct sunlight.',
    maintenancePerDay: 0.3,
    scienceExplanation:
      'Without thick convective air, habitats must actively pump heat to radiators or warm fluid loops against -173°C to -63°C exteriors.',
    gridSlot: { col: 1, row: 2 },
  },
  emergency_shelter: {
    id: 'emergency_shelter',
    name: 'Emergency Storm Shelter',
    category: 'Protection',
    baseCost: 95,
    upgradeCostMultiplier: 1.5,
    maxLevel: 3,
    powerPerLevelKw: -2,
    description: 'Reinforced inner-core safe haven surrounded by water tanks for acute solar particle events.',
    resourceImpactSummary: 'Reduces Solar Storm health/radiation impact by 65% · -2 kWh/day',
    capacityEffect: 'Unlocks safe sheltering actions during solar storms.',
    maintenancePerDay: 0.15,
    scienceExplanation:
      'Surrounding a central crew bay with stored potable water provides dense emergency mass during coronal mass ejections.',
    gridSlot: { col: 2, row: 2 },
  },
  comms_antenna: {
    id: 'comms_antenna',
    name: 'Deep Space Comms Antenna',
    category: 'Operations',
    baseCost: 60,
    upgradeCostMultiplier: 1.35,
    maxLevel: 3,
    powerPerLevelKw: -3,
    description: 'High-gain Ka-band dish for telemetry, space-weather warnings, and automated resupply guidance.',
    resourceImpactSummary: 'Reduces Supply Delay impact · +5% event mitigation efficiency · -3 kWh/day',
    capacityEffect: 'Improves early warning and prevents communication blackouts.',
    maintenancePerDay: 0.25,
    scienceExplanation:
      'High-gain directional antennas maintain link margin across 384,400 km (Moon) to 225+ million km (Mars).',
    gridSlot: { col: 3, row: 1 },
  },
};

// Deterministic PRNG (Mulberry32) so missions are 100% reproducible from seed
export function createSeededRng(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function getModuleBuildCost(moduleId: ModuleId, currentLevel: number): number {
  const def = OUTPOST_MODULES[moduleId];
  return Math.round(def.baseCost * Math.pow(def.upgradeCostMultiplier, currentLevel));
}

export function computeCapacities(modules: Record<ModuleId, InstalledModule>, crewSize: number) {
  const habLevel = modules.habitat.level;
  const habMultiplier = 1 + (habLevel - 1) * 0.22;
  const batteryLevel = Math.max(1, modules.battery.level);

  return {
    maxOxygenKg: Math.round(crewSize * 18 * habMultiplier),
    maxWaterL: Math.round(crewSize * 65 * habMultiplier),
    maxFoodRations: Math.round(crewSize * 22 * habMultiplier),
    maxEnergyKwh: batteryLevel * SIMULATION_COEFFICIENTS.batteryKwhCapacityPerLevel,
  };
}

function getBudgetCredits(budget: BudgetTier): number {
  if (budget === 'limited') return 180;
  if (budget === 'standard') return 310;
  return 460;
}

function getDifficultyScale(difficulty: Difficulty) {
  if (difficulty === 'explorer') {
    return { eventProbability: 0.22, severityMultiplier: 0.75, wearMultiplier: 0.7 };
  }
  if (difficulty === 'specialist') {
    return { eventProbability: 0.34, severityMultiplier: 1.0, wearMultiplier: 1.0 };
  }
  return { eventProbability: 0.45, severityMultiplier: 1.3, wearMultiplier: 1.3 };
}

export function createInitialMission(config: MissionConfig, id?: string): MissionState {
  const missionId = id || `msn-${Date.now().toString(36)}-${Math.abs(config.seed).toString(36).slice(0, 4)}`;

  const startingSolarLevel =
    config.destination === 'mars'
      ? config.budget === 'advanced'
        ? 3
        : 2
      : config.budget === 'advanced'
      ? 2
      : 1;
  const modules: Record<ModuleId, InstalledModule> = {
    habitat: { id: 'habitat', level: 1, efficiency: 1.0, damaged: false },
    solar_array: { id: 'solar_array', level: startingSolarLevel, efficiency: 1.0, damaged: false },
    battery: { id: 'battery', level: 1, efficiency: 1.0, damaged: false },
    greenhouse: { id: 'greenhouse', level: config.budget === 'advanced' ? 1 : 0, efficiency: 1.0, damaged: false },
    water_recycler: { id: 'water_recycler', level: 1, efficiency: 1.0, damaged: false },
    oxygen_gen: { id: 'oxygen_gen', level: 1, efficiency: 1.0, damaged: false },
    radiation_shield: { id: 'radiation_shield', level: 1, efficiency: 1.0, damaged: false },
    thermal_control: { id: 'thermal_control', level: 1, efficiency: 1.0, damaged: false },
    emergency_shelter: { id: 'emergency_shelter', level: config.budget === 'advanced' ? 1 : 0, efficiency: 1.0, damaged: false },
    comms_antenna: { id: 'comms_antenna', level: 1, efficiency: 1.0, damaged: false },
  };

  const caps = computeCapacities(modules, config.crewSize);
  const startFactor = config.budget === 'limited' ? 0.65 : config.budget === 'standard' ? 0.8 : 0.92;

  const oxygenKg = Number((caps.maxOxygenKg * startFactor).toFixed(1));
  const waterL = Number((caps.maxWaterL * startFactor).toFixed(1));
  const foodRations = Number((caps.maxFoodRations * startFactor).toFixed(1));
  const energyKwh = Number((caps.maxEnergyKwh * 0.85).toFixed(1));
  const radiationProtectionPct = computeBaseRadiationProtection(config.destination, modules);
  const temperatureC = SIMULATION_COEFFICIENTS.idealHabitatTempC;

  const state: MissionState = {
    id: missionId,
    config,
    currentDay: 1,
    status: 'active',
    buildCredits: getBudgetCredits(config.budget),
    crewHealth: 100,
    outpostCondition: 100,
    stabilityScore: 92,
    modules,
    oxygenKg,
    waterL,
    foodRations,
    energyKwh,
    radiationProtectionPct,
    cumulativeRadiationMsv: 0,
    temperatureC,
    activeModifiers: {
      solarMultiplier: 1.0,
      solarPenaltyDaysLeft: 0,
      dustStormDaysLeft: 0,
      solarStormDaysLeft: 0,
      shelterActiveDaysLeft: 0,
      commsDownDaysLeft: 0,
    },
    metrics: [],
    activeEvent: null,
    eventLog: [],
    decisions: [
      {
        day: 1,
        type: 'advance',
        title: 'Outpost Commissioned',
        detail: `${config.destination === 'moon' ? 'Lunar' : 'Martian'} outpost initialized for ${config.crewSize} astronauts (${config.durationDays}-day mission).`,
        impact: 'Initial reserves and baseline ECLSS subsystems online.',
      },
    ],
    history: [],
    alerts: [],
    lastUpdated: new Date().toISOString(),
  };

  // Compute initial daily projections (day 1 baseline)
  const preview = evaluateDailyRates(state);
  state.metrics = preview.metrics;
  state.stabilityScore = computeStabilityScore(state);
  state.history.push({
    day: 1,
    oxygen: state.oxygenKg,
    water: state.waterL,
    food: state.foodRations,
    energy: state.energyKwh,
    radiationProtection: state.radiationProtectionPct,
    temperatureC: state.temperatureC,
    crewHealth: state.crewHealth,
    outpostCondition: state.outpostCondition,
    stabilityScore: state.stabilityScore,
    solarGenerationKwh: preview.solarGenerationKwh,
    energyDemandKwh: preview.energyDemandKwh,
  });

  return state;
}

export function computeBaseRadiationProtection(
  destination: Destination,
  modules: Record<ModuleId, InstalledModule>,
  shelterActive = false
): number {
  const destBaseline = destination === 'mars' ? 38 : 30; // Mars thin CO2 atmosphere adds slight attenuation over lunar vacuum
  const shieldLevel = modules.radiation_shield.level * modules.radiation_shield.efficiency;
  const shelterPassive = modules.emergency_shelter.level * 6;
  const shelterBoost = shelterActive ? 22 : 0;
  return Math.min(98, Math.round(destBaseline + shieldLevel * 14 + shelterPassive + shelterBoost));
}

// 1. Solar Power Generation & Energy Demand Calculation
export function calculateSolarAndBatteryTick(state: MissionState) {
  const { destination } = state.config;
  const solarMod = state.modules.solar_array;
  const basePerLevel =
    destination === 'moon'
      ? SIMULATION_COEFFICIENTS.moonSolarKwhPerLevelBase
      : SIMULATION_COEFFICIENTS.marsSolarKwhPerLevelBase;

  // Lunar day/night cycle simulation (simplified 14-day sunlit / twilight dip near south pole)
  // On Moon south pole sites, sun clips crater rims periodically (~20% dip every 10-14 days)
  let environmentalSolarFactor = 1.0;
  let envNote = destination === 'moon' ? 'Lunar South Pole illumination' : 'Martian sol solar flux (~43% Earth)';

  if (destination === 'moon') {
    const cyclePos = (state.currentDay - 1) % 14;
    if (cyclePos >= 11) {
      environmentalSolarFactor = 0.55; // Crater rim partial shadowing
      envNote = 'Lunar crater-rim partial shadow window (-45% solar)';
    }
  }

  if (state.activeModifiers.dustStormDaysLeft > 0) {
    environmentalSolarFactor *= 0.45;
    envNote = 'Martian dust storm attenuation (-55% solar)';
  }
  if (state.activeModifiers.solarPenaltyDaysLeft > 0) {
    environmentalSolarFactor *= state.activeModifiers.solarMultiplier;
    envNote = 'Degraded solar array output';
  }

  const solarGenerationKwh = Number(
    (solarMod.level * solarMod.efficiency * basePerLevel * environmentalSolarFactor).toFixed(1)
  );

  // Sum electrical demand from all active modules + crew baseline
  let moduleDemandKwh = state.config.crewSize * 2.5; // Crew workstations, lighting, suits
  (Object.keys(state.modules) as ModuleId[]).forEach((modId) => {
    const inst = state.modules[modId];
    const def = OUTPOST_MODULES[modId];
    if (inst.level > 0 && def.powerPerLevelKw < 0) {
      moduleDemandKwh += Math.abs(def.powerPerLevelKw) * inst.level;
    }
  });

  const energyDemandKwh = Number(moduleDemandKwh.toFixed(1));
  return { solarGenerationKwh, energyDemandKwh, envNote };
}

// 2. Water Consumption, Storage, and Recycling Calculation
export function calculateWaterTick(state: MissionState, powerFactor: number) {
  const crewDemandL = state.config.crewSize * SIMULATION_COEFFICIENTS.waterLitersPerPersonPerDay;
  const recycler = state.modules.water_recycler;
  const lvl = Math.min(5, Math.max(0, recycler.level));
  const baseRecovery = SIMULATION_COEFFICIENTS.waterRecoveryByLevel[lvl] ?? 0;
  const effectiveRecovery = baseRecovery * recycler.efficiency * powerFactor;

  const recycledL = Number((crewDemandL * effectiveRecovery).toFixed(2));
  const oxyMod = state.modules.oxygen_gen;
  const oxygenProducedIfPowered =
    oxyMod.level * oxyMod.efficiency * SIMULATION_COEFFICIENTS.oxygenGenKgPerLevelPerDay * powerFactor;
  const electrolysisWaterCostL = Number(
    (oxygenProducedIfPowered * SIMULATION_COEFFICIENTS.oxygenGenWaterCostPerKgO2).toFixed(2)
  );
  const greenhouseWaterCostL = Number(
    (state.modules.greenhouse.level * SIMULATION_COEFFICIENTS.greenhouseWaterLossPerLevelPerDay * powerFactor).toFixed(2)
  );

  const grossConsumptionL = Number((crewDemandL + electrolysisWaterCostL + greenhouseWaterCostL).toFixed(2));
  const netDeltaL = Number((recycledL - grossConsumptionL).toFixed(2));

  return {
    dailyConsumption: grossConsumptionL,
    dailyProduction: recycledL,
    netDeltaL,
    effectiveRecoveryPct: Math.round(effectiveRecovery * 100),
    electrolysisWaterCostL,
  };
}

// 3. Oxygen Consumption & Generation Calculation
export function calculateOxygenTick(state: MissionState, powerFactor: number, waterAvailable: boolean) {
  const crewConsumptionKg = Number(
    (state.config.crewSize * SIMULATION_COEFFICIENTS.oxygenKgPerPersonPerDay).toFixed(2)
  );
  const oxyMod = state.modules.oxygen_gen;
  const ghMod = state.modules.greenhouse;

  const electrolysisOutputKg = waterAvailable
    ? oxyMod.level * oxyMod.efficiency * SIMULATION_COEFFICIENTS.oxygenGenKgPerLevelPerDay * powerFactor
    : 0;
  const greenhouseO2Kg =
    ghMod.level * ghMod.efficiency * SIMULATION_COEFFICIENTS.greenhouseO2BonusPerLevelPerDay * powerFactor;

  const dailyProductionKg = Number((electrolysisOutputKg + greenhouseO2Kg).toFixed(2));
  const netDeltaKg = Number((dailyProductionKg - crewConsumptionKg).toFixed(2));

  return {
    dailyConsumption: crewConsumptionKg,
    dailyProduction: dailyProductionKg,
    netDeltaKg,
    waterLimited: !waterAvailable,
  };
}

// 4. Food Consumption & Greenhouse Production Calculation
export function calculateFoodTick(state: MissionState, powerFactor: number, waterAvailable: boolean) {
  const crewDemand = Number((state.config.crewSize * SIMULATION_COEFFICIENTS.foodRationsPerPersonPerDay).toFixed(2));
  const gh = state.modules.greenhouse;
  const production =
    gh.level > 0 && waterAvailable
      ? Number((gh.level * gh.efficiency * SIMULATION_COEFFICIENTS.greenhouseFoodPerLevelPerDay * powerFactor).toFixed(2))
      : 0;

  return {
    dailyConsumption: crewDemand,
    dailyProduction: production,
    netDeltaRations: Number((production - crewDemand).toFixed(2)),
  };
}

// 5. Radiation Protection & Dose Calculation
export function calculateRadiationTick(state: MissionState) {
  const shelterActive = state.activeModifiers.shelterActiveDaysLeft > 0;
  const protectionPct = computeBaseRadiationProtection(state.config.destination, state.modules, shelterActive);
  const stormMultiplier = state.activeModifiers.solarStormDaysLeft > 0 ? 4.5 : 1.0;
  // Illustrative daily unshielded GCR/SPE dose (~1.8 mSv/day unshielded baseline)
  const unshieldedMsv = 1.8 * stormMultiplier;
  const absorbedMsv = Number((unshieldedMsv * (1 - protectionPct / 100)).toFixed(2));

  return {
    protectionPct,
    absorbedMsv,
    stormActive: state.activeModifiers.solarStormDaysLeft > 0,
    shelterActive,
  };
}

// 6. Thermal Control & Habitat Temperature Calculation
export function calculateThermalTick(state: MissionState, powerFactor: number) {
  const thermalMod = state.modules.thermal_control;
  const externalTemp = state.config.destination === 'moon' ? -95 : -63;
  const thermalAuthority =
    thermalMod.level > 0
      ? Math.min(1, (0.65 + thermalMod.level * 0.35) * thermalMod.efficiency * powerFactor)
      : 0;

  // Target is 21°C; if thermalAuthority < 0.85, cabin drifts toward external temperature
  const targetTemp =
    thermalAuthority >= 0.85
      ? SIMULATION_COEFFICIENTS.idealHabitatTempC
      : SIMULATION_COEFFICIENTS.idealHabitatTempC * thermalAuthority + externalTemp * (1 - thermalAuthority) * 0.28;

  const nextTemp = Number((state.temperatureC + (targetTemp - state.temperatureC) * 0.45).toFixed(1));
  return {
    nextTemp,
    deltaTemp: Number((nextTemp - state.temperatureC).toFixed(1)),
    thermalAuthorityPct: Math.round(thermalAuthority * 100),
  };
}

function getMetricStatus(
  id: ResourceMetric['id'],
  current: number,
  max: number
): 'Nominal' | 'Caution' | 'Critical' {
  if (id === 'temperature') {
    if (current >= 18 && current <= 25) return 'Nominal';
    if (current >= 14 && current <= 28) return 'Caution';
    return 'Critical';
  }
  if (id === 'radiation') {
    if (current >= 60) return 'Nominal';
    if (current >= 42) return 'Caution';
    return 'Critical';
  }
  const ratio = max > 0 ? current / max : 0;
  if (ratio >= 0.4) return 'Nominal';
  if (ratio >= 0.18) return 'Caution';
  return 'Critical';
}

export function evaluateDailyRates(state: MissionState) {
  const caps = computeCapacities(state.modules, state.config.crewSize);
  const power = calculateSolarAndBatteryTick(state);
  const netEnergyPotential = state.energyKwh + power.solarGenerationKwh - power.energyDemandKwh;
  const powerFactor =
    netEnergyPotential >= 0
      ? 1.0
      : Math.max(0.25, (state.energyKwh + power.solarGenerationKwh) / Math.max(1, power.energyDemandKwh));

  const water = calculateWaterTick(state, powerFactor);
  const waterAvailable = state.waterL + water.dailyProduction > 1.5;
  const oxygen = calculateOxygenTick(state, powerFactor, waterAvailable);
  const food = calculateFoodTick(state, powerFactor, waterAvailable);
  const radiation = calculateRadiationTick(state);
  const thermal = calculateThermalTick(state, powerFactor);

  const calcDays = (current: number, net: number) => {
    if (net >= -0.01) return null;
    return Math.max(0, Number((current / Math.abs(net)).toFixed(1)));
  };

  const metrics: ResourceMetric[] = [
    {
      id: 'oxygen',
      label: 'Oxygen',
      unit: 'kg O₂',
      current: Number(state.oxygenKg.toFixed(1)),
      max: caps.maxOxygenKg,
      minSafe: Number((caps.maxOxygenKg * 0.2).toFixed(1)),
      maxSafe: caps.maxOxygenKg,
      dailyConsumption: oxygen.dailyConsumption,
      dailyProduction: oxygen.dailyProduction,
      netDaily: oxygen.netDeltaKg,
      estimatedDaysRemaining: calcDays(state.oxygenKg, oxygen.netDeltaKg),
      status: getMetricStatus('oxygen', state.oxygenKg, caps.maxOxygenKg),
      reason: oxygen.waterLimited
        ? 'Oxygen Generator stalled: insufficient water reserve for electrolysis.'
        : `Crew consumes ${oxygen.dailyConsumption} kg/day; Oxygen Gen + Greenhouse supply ${oxygen.dailyProduction} kg/day.`,
    },
    {
      id: 'water',
      label: 'Water',
      unit: 'L H₂O',
      current: Number(state.waterL.toFixed(1)),
      max: caps.maxWaterL,
      minSafe: Number((caps.maxWaterL * 0.2).toFixed(1)),
      maxSafe: caps.maxWaterL,
      dailyConsumption: water.dailyConsumption,
      dailyProduction: water.dailyProduction,
      netDaily: water.netDeltaL,
      estimatedDaysRemaining: calcDays(state.waterL, water.netDeltaL),
      status: getMetricStatus('water', state.waterL, caps.maxWaterL),
      reason: `Recycler recovers ${water.effectiveRecoveryPct}% of crew usage (${water.dailyProduction} L/day); electrolysis & greenhouse draw ${water.electrolysisWaterCostL} L/day.`,
    },
    {
      id: 'food',
      label: 'Food',
      unit: 'rations',
      current: Number(state.foodRations.toFixed(1)),
      max: caps.maxFoodRations,
      minSafe: Number((caps.maxFoodRations * 0.2).toFixed(1)),
      maxSafe: caps.maxFoodRations,
      dailyConsumption: food.dailyConsumption,
      dailyProduction: food.dailyProduction,
      netDaily: food.netDeltaRations,
      estimatedDaysRemaining: calcDays(state.foodRations, food.netDeltaRations),
      status: getMetricStatus('food', state.foodRations, caps.maxFoodRations),
      reason:
        state.modules.greenhouse.level > 0
          ? `Crew consumes ${food.dailyConsumption} rations/day; Greenhouse Level ${state.modules.greenhouse.level} produces ${food.dailyProduction}/day.`
          : `Crew consumes ${food.dailyConsumption} rations/day with no active Greenhouse module.`,
    },
    {
      id: 'energy',
      label: 'Energy',
      unit: 'kWh',
      current: Number(state.energyKwh.toFixed(1)),
      max: caps.maxEnergyKwh,
      minSafe: Number((caps.maxEnergyKwh * 0.2).toFixed(1)),
      maxSafe: caps.maxEnergyKwh,
      dailyConsumption: power.energyDemandKwh,
      dailyProduction: power.solarGenerationKwh,
      netDaily: Number((power.solarGenerationKwh - power.energyDemandKwh).toFixed(1)),
      estimatedDaysRemaining: calcDays(state.energyKwh, power.solarGenerationKwh - power.energyDemandKwh),
      status: getMetricStatus('energy', state.energyKwh, caps.maxEnergyKwh),
      reason: `${power.envNote}. Solar yields ${power.solarGenerationKwh} kWh/day vs. ${power.energyDemandKwh} kWh/day demand.`,
    },
    {
      id: 'radiation',
      label: 'Radiation Protection',
      unit: '% shield',
      current: radiation.protectionPct,
      max: 100,
      minSafe: 55,
      maxSafe: 100,
      dailyConsumption: radiation.absorbedMsv,
      dailyProduction: 0,
      netDaily: 0,
      estimatedDaysRemaining: null,
      status: getMetricStatus('radiation', radiation.protectionPct, 100),
      reason: radiation.stormActive
        ? `Solar storm active! Modeled dose ${radiation.absorbedMsv} mSv/day with ${radiation.protectionPct}% shielding.`
        : `Shielding blocks ${radiation.protectionPct}% of baseline cosmic radiation (${radiation.absorbedMsv} mSv/day modeled dose).`,
    },
    {
      id: 'temperature',
      label: 'Temperature',
      unit: '°C',
      current: state.temperatureC,
      max: 30,
      minSafe: 18,
      maxSafe: 25,
      dailyConsumption: 0,
      dailyProduction: 0,
      netDaily: thermal.deltaTemp,
      estimatedDaysRemaining: null,
      status: getMetricStatus('temperature', state.temperatureC, 30),
      reason: `Thermal authority at ${thermal.thermalAuthorityPct}% holding cabin at ${state.temperatureC}°C against ${state.config.destination === 'moon' ? 'lunar' : 'Martian'} extremes.`,
    },
  ];

  return {
    metrics,
    powerFactor,
    solarGenerationKwh: power.solarGenerationKwh,
    energyDemandKwh: power.energyDemandKwh,
    water,
    oxygen,
    food,
    radiation,
    thermal,
    caps,
  };
}

export function computeStabilityScore(state: MissionState): number {
  const caps = computeCapacities(state.modules, state.config.crewSize);
  const o2Pct = Math.min(1, state.oxygenKg / Math.max(1, caps.maxOxygenKg));
  const h2oPct = Math.min(1, state.waterL / Math.max(1, caps.maxWaterL));
  const foodPct = Math.min(1, state.foodRations / Math.max(1, caps.maxFoodRations));
  const energyPct = Math.min(1, state.energyKwh / Math.max(1, caps.maxEnergyKwh));
  const radPct = Math.min(1, state.radiationProtectionPct / 100);
  const tempPenalty = Math.abs(state.temperatureC - SIMULATION_COEFFICIENTS.idealHabitatTempC) * 2.5;

  const resourceComposite = (o2Pct * 0.22 + h2oPct * 0.22 + foodPct * 0.18 + energyPct * 0.2 + radPct * 0.18) * 100;
  const raw = resourceComposite * 0.55 + state.crewHealth * 0.3 + state.outpostCondition * 0.15 - tempPenalty;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

function generateSeededEvent(state: MissionState): MissionEvent | null {
  const { destination, seed, difficulty } = state.config;
  const diff = getDifficultyScale(difficulty);
  const rng = createSeededRng(seed + state.currentDay * 997);

  // Never trigger on Day 1 or if an event is already active
  if (state.currentDay <= 2 || state.activeEvent) return null;

  // Enforce spacing between events
  const lastEventDay = state.eventLog.length > 0 ? state.eventLog[state.eventLog.length - 1].triggeredDay : 0;
  if (state.currentDay - lastEventDay < 3) return null;

  if (rng() > diff.eventProbability) return null;

  const candidates: MissionEvent['type'][] = [
    'solar_storm',
    'solar_efficiency_drop',
    'water_recycling_failure',
    'greenhouse_crop_failure',
    'oxygen_malfunction',
    'battery_failure',
    'temperature_emergency',
    'comms_interruption',
    'supply_delay',
    ...(destination === 'mars' ? (['dust_storm'] as const) : []),
  ];

  const chosenType = candidates[Math.floor(rng() * candidates.length)];
  const sev: MissionEvent['severity'] =
    difficulty === 'commander' ? 'Severe' : rng() > 0.55 ? 'High' : 'Moderate';
  const mult = diff.severityMultiplier;
  const evtId = `evt-d${state.currentDay}-${chosenType}`;

  switch (chosenType) {
    case 'solar_storm':
      return {
        id: evtId,
        type: 'solar_storm',
        title: 'Solar Particle Storm Warning',
        severity: 'Severe',
        triggeredDay: state.currentDay,
        daysRemainingToRespond: 2,
        description:
          'A simulated coronal mass ejection is heading toward the outpost, elevating energetic proton flux for 48 hours.',
        scientificContext:
          'Because the Moon and Mars lack Earth’s global magnetosphere, crews must shelter inside hydrogen-rich water/polyethylene bays during solar particle events.',
        affectedSystems: ['Radiation Protection', 'Crew Health', 'Energy'],
        isResolved: false,
        choices: [
          {
            id: 'shelter_crew',
            label: 'Activate Storm Shelter Protocol',
            summary: 'Move crew into inner shielded core and power down non-essential science racks.',
            scienceReasoning: 'Mass between the crew and incoming protons reduces absorbed radiation dose.',
            buildCreditCost: 0,
            effectsDescription: '+22% temporary shielding for 2 days · -12 kWh reserve · minimal crew impact',
            deltas: { temporaryShieldBoostDays: 2, energy: -12, crewHealth: -2 },
          },
          {
            id: 'boost_field_water',
            label: 'Pump Potable Water into Shield Jackets',
            summary: 'Divert stored water into habitat wall bladders for extra hydrogen shielding.',
            scienceReasoning: 'Water (H₂O) is rich in hydrogen atoms that slow high-energy protons effectively.',
            buildCreditCost: 15,
            effectsDescription: '-15 SU · -15 L water · +4% permanent shielding',
            deltas: { water: -15, radiationProtection: 4, temporaryShieldBoostDays: 2 },
          },
          {
            id: 'continue_ops',
            label: 'Maintain Normal Surface Operations',
            summary: 'Keep full power on labs and greenhouse without sheltering.',
            scienceReasoning: 'Unmitigated solar particle exposure damages tissue and increases cumulative dose.',
            buildCreditCost: 0,
            effectsDescription: 'No power spent · -16% Crew Health · +6 mSv radiation exposure',
            deltas: { crewHealth: Math.round(-16 * mult) },
          },
        ],
      };

    case 'dust_storm':
      return {
        id: 'evtId-' + evtId,
        type: 'dust_storm',
        title: 'Regional Martian Dust Storm',
        severity: sev,
        triggeredDay: state.currentDay,
        daysRemainingToRespond: 2,
        description:
          'Suspended iron-oxide dust has darkened the Martian sky, cutting photovoltaic sunlight by 55% for 3 days.',
        scientificContext:
          'Martian dust storms scatter sunlight across the atmosphere and coat horizontal solar arrays, straining battery reserves.',
        affectedSystems: ['Energy', 'Solar Power Array', 'Temperature'],
        isResolved: false,
        choices: [
          {
            id: 'clean_arrays',
            label: 'Deploy Electrostatic Dust Sweep & Ration Power',
            summary: 'Spend maintenance supplies to clear panels and throttle greenhouse lights.',
            scienceReasoning: 'Clearing surface dust restores cell photon absorption while load shedding preserves batteries.',
            buildCreditCost: 20,
            effectsDescription: '-20 SU · +20 kWh recovery · -1 ration output today',
            deltas: { energy: 20, food: -2 },
          },
          {
            id: 'battery_reserve',
            label: 'Draw Deep Battery Reserves',
            summary: 'Rely solely on stored battery charge to keep all life support at 100%.',
            scienceReasoning: 'Deep cycling batteries preserves food and oxygen output at the cost of energy margin.',
            buildCreditCost: 0,
            effectsDescription: '-24 kWh · -4% Outpost Condition from deep discharge',
            deltas: { energy: -24, outpostCondition: -4 },
          },
        ],
      };

    case 'solar_efficiency_drop':
      return {
        id: evtId,
        type: 'solar_efficiency_drop',
        title: 'Solar Array Actuator & Dust Degradation',
        severity: sev,
        triggeredDay: state.currentDay,
        daysRemainingToRespond: 2,
        description:
          'Tracking gimbals on Solar Wing B are misaligned and electrostatic dust has lowered panel efficiency to 65%.',
        scientificContext:
          'Off-axis solar panels receive cosine-reduced irradiance; abrasive regolith dust further lowers cell output.',
        affectedSystems: ['Energy', 'Solar Power Array'],
        isResolved: false,
        choices: [
          {
            id: 'eva_realign',
            label: 'Conduct EVA Array Realignment',
            summary: 'Dispatch crew to manually clean and lock solar gimbal at optimal sun angle.',
            scienceReasoning: 'Restoring normal incidence maximizes photon flux onto photovoltaic cells.',
            buildCreditCost: 15,
            effectsDescription: '-15 SU · Restores 100% Solar Array efficiency',
            deltas: { repairModuleId: 'solar_array', efficiencyBoostModuleId: 'solar_array' },
          },
          {
            id: 'run_degraded',
            label: 'Operate at Reduced Output',
            summary: 'Avoid EVA expenditure and accept reduced array output for 3 days.',
            scienceReasoning: 'Conserves build credits while demanding strict energy monitoring.',
            buildCreditCost: 0,
            effectsDescription: '-15 kWh immediate · 3-day reduced solar margin',
            deltas: { energy: -15, temporaryPowerPenaltyDays: 3 },
          },
        ],
      };

    case 'water_recycling_failure':
      return {
        id: evtId,
        type: 'water_recycling_failure',
        title: 'Water Recycling Distillation Pump Fault',
        severity: 'High',
        triggeredDay: state.currentDay,
        daysRemainingToRespond: 2,
        description:
          'Mineral scaling in the vapor-compression distiller has reduced water recovery efficiency by 40%.',
        scientificContext:
          'Calcium sulfate precipitation is a real engineering hazard in closed-loop spacecraft urine/greywater processors.',
        affectedSystems: ['Water', 'Oxygen Generation'],
        isResolved: false,
        choices: [
          {
            id: 'replace_filter',
            label: 'Install Spare Distillation Cartridge',
            summary: 'Swap out the fouled brine filter assembly using spare parts.',
            scienceReasoning: 'Replacing clogged membranes restores closed-loop recovery above 80% immediately.',
            buildCreditCost: 25,
            effectsDescription: '-25 SU · Restores Water Recycler to 100% efficiency · +15 L recovered',
            deltas: { repairModuleId: 'water_recycler', water: 15 },
          },
          {
            id: 'chemical_flush',
            label: 'Run Low-Power Chemical Acid Flush',
            summary: 'Partially clear scaling using reserve energy and crew maintenance time.',
            scienceReasoning: 'Acid pre-treatment dissolves mineral deposits partially without consuming spare cartridges.',
            buildCreditCost: 0,
            effectsDescription: '-14 kWh · -10 L flush water · Partial recovery',
            deltas: { energy: -14, water: -10, efficiencyBoostModuleId: 'water_recycler' },
          },
        ],
      };

    case 'greenhouse_crop_failure':
      return {
        id: evtId,
        type: 'greenhouse_crop_failure',
        title: 'Hydroponic Nutrient Loop Imbalance',
        severity: sev,
        triggeredDay: state.currentDay,
        daysRemainingToRespond: 2,
        description:
          'Root-zone pH drift and fungal stress have stunted crop yield in Hydroponic Bay 1.',
        scientificContext:
          'Closed hydroponic loops lack soil buffering, so pH and dissolved oxygen shifts quickly stress plant roots.',
        affectedSystems: ['Food', 'Water'],
        isResolved: false,
        choices: [
          {
            id: 'reseed_bay',
            label: 'Sanitize & Re-seed Hydroponic Trays',
            summary: 'Flush the manifold with clean water and re-balance nutrient solution.',
            scienceReasoning: 'Re-establishing sterile root conditions prevents crop pathogen spread.',
            buildCreditCost: 20,
            effectsDescription: '-20 SU · -12 L water · Restores Greenhouse + +6 rations',
            deltas: { water: -12, food: 6, repairModuleId: 'greenhouse' },
          },
          {
            id: 'salvage_harvest',
            label: 'Harvest Early & Rely on Stored Rations',
            summary: 'Collect edible biomass now and reduce grow-light duty cycle.',
            scienceReasoning: 'Saves water and energy immediately at the cost of reduced food inventory.',
            buildCreditCost: 0,
            effectsDescription: '-6 rations · +8 kWh saved',
            deltas: { food: -6, energy: 8 },
          },
        ],
      };

    case 'oxygen_malfunction':
      return {
        id: evtId,
        type: 'oxygen_malfunction',
        title: 'Oxygen Electrolyzer Cell Malfunction',
        severity: 'Severe',
        triggeredDay: state.currentDay,
        daysRemainingToRespond: 1,
        description:
          'A pressure valve seal leak in the Oxygen Generation System has dropped O₂ output by 45%.',
        scientificContext:
          'Fine lunar/Martian dust or thermal cycling can degrade elastomer seals in high-pressure O₂ manifolds.',
        affectedSystems: ['Oxygen', 'Crew Health'],
        isResolved: false,
        choices: [
          {
            id: 'rebuild_valve',
            label: 'Rebuild Pressure Manifold Immediately',
            summary: 'Use precision spare seals to restore full electrolysis output.',
            scienceReasoning: 'Restoring cell pressure prevents hypoxic drift in cabin atmosphere.',
            buildCreditCost: 25,
            effectsDescription: '-25 SU · Restores Oxygen Gen · +5 kg emergency O₂',
            deltas: { repairModuleId: 'oxygen_gen', oxygen: 5 },
          },
          {
            id: 'purge_reserves',
            label: 'Crack High-Pressure O₂ Reserve Tanks',
            summary: 'Supplement cabin air from emergency tanks while patching temporarily.',
            scienceReasoning: 'Buys time for repairs while draining stored oxygen and electrical power.',
            buildCreditCost: 0,
            effectsDescription: '-4 kg O₂ reserve · -10 kWh · -5% Outpost Condition',
            deltas: { oxygen: -4, energy: -10, outpostCondition: -5 },
          },
        ],
      };

    case 'battery_failure':
      return {
        id: evtId,
        type: 'battery_failure',
        title: 'Battery Bank Thermal Runaway Warning',
        severity: sev,
        triggeredDay: state.currentDay,
        daysRemainingToRespond: 2,
        description:
          'Sensors detected a hot cell module in Battery Bus A; automatic isolation dropped available reserve.',
        scientificContext:
          'Spacecraft lithium-ion packs require strict thermal balance to prevent cell degradation during charge/discharge.',
        affectedSystems: ['Energy', 'Temperature'],
        isResolved: false,
        choices: [
          {
            id: 'swap_cell_pack',
            label: 'Isolate & Replace Faulty Cell Pack',
            summary: 'Swap the degraded module using engineering spares.',
            scienceReasoning: 'Eliminates internal short risk and restores full storage capacity.',
            buildCreditCost: 22,
            effectsDescription: '-22 SU · +25 kWh restored · Battery healthy',
            deltas: { repairModuleId: 'battery', energy: 25 },
          },
          {
            id: 'derate_bus',
            label: 'Derate Battery Bus & Shed Load',
            summary: 'Operate at lower charge ceiling to keep temperatures safe.',
            scienceReasoning: 'Reducing charge current limits Joule heating in aging cells.',
            buildCreditCost: 0,
            effectsDescription: '-18 kWh available · -4% Outpost Condition',
            deltas: { energy: -18, outpostCondition: -4 },
          },
        ],
      };

    case 'temperature_emergency':
      return {
        id: evtId,
        type: 'temperature_emergency',
        title: 'Habitat Thermal Loop Coolant Drop',
        severity: sev,
        triggeredDay: state.currentDay,
        daysRemainingToRespond: 2,
        description:
          'Cabin temperatures are falling rapidly after micrometeoroid pitting slowed external thermal radiator flow.',
        scientificContext:
          'Without active coolant circulation and electric heaters, habitat walls radiate heat rapidly to space.',
        affectedSystems: ['Temperature', 'Crew Health', 'Energy'],
        isResolved: false,
        choices: [
          {
            id: 'patch_loop',
            label: 'Seal Thermal Loop & Boost Heaters',
            summary: 'Apply composite patch and run electric resistance heaters.',
            scienceReasoning: 'Prevents cabin condensation and pipe freezing.',
            buildCreditCost: 18,
            effectsDescription: '-18 SU · -12 kWh · +5°C cabin recovery',
            deltas: { repairModuleId: 'thermal_control', energy: -12, temperatureC: 5 },
          },
          {
            id: 'insulate_bays',
            label: 'Close Bulkhead Hatches & Thermal Suits',
            summary: 'Consolidate crew in core habitat module to retain body and equipment heat.',
            scienceReasoning: 'Reducing heated volume slows conductive and radiative heat loss.',
            buildCreditCost: 0,
            effectsDescription: '-3°C temperature dip · -5% Crew Health discomfort',
            deltas: { temperatureC: -3, crewHealth: -5 },
          },
        ],
      };

    case 'comms_interruption':
      return {
        id: evtId,
        type: 'comms_interruption',
        title: 'High-Gain Communication Blackout',
        severity: 'Moderate',
        triggeredDay: state.currentDay,
        daysRemainingToRespond: 2,
        description:
          'Solar radio interference and antenna gimbal drift have interrupted high-bandwidth telemetry with Earth.',
        scientificContext:
          'Solar conjunctions and antenna pointing errors require autonomous onboard diagnostics until link lock returns.',
        affectedSystems: ['Comms Antenna', 'Energy'],
        isResolved: false,
        choices: [
          {
            id: 'recalibrate_dish',
            label: 'Run Autonomous Star-Tracker Recalibration',
            summary: 'Use onboard power and gyros to re-lock the Ka-band antenna.',
            scienceReasoning: 'Precision pointing restores signal-to-noise ratio across planetary distances.',
            buildCreditCost: 10,
            effectsDescription: '-10 SU · -8 kWh · Link restored & +15 SU telemetry bonus',
            deltas: { repairModuleId: 'comms_antenna', energy: -8 },
          },
          {
            id: 'wait_conjunction',
            label: 'Operate Autonomously on Low-Gain Beacon',
            summary: 'Wait out interference with minimal power draw.',
            scienceReasoning: 'Low-gain omni antennas preserve power while sustaining emergency carrier beacons.',
            buildCreditCost: 0,
            effectsDescription: '0 SU spent · -4% Outpost Condition coordination drag',
            deltas: { outpostCondition: -4 },
          },
        ],
      };

    case 'supply_delay':
    default:
      return {
        id: evtId,
        type: 'supply_delay',
        title: 'Cargo Lander Resupply Delay',
        severity: 'Moderate',
        triggeredDay: state.currentDay,
        daysRemainingToRespond: 2,
        description:
          'Orbital trajectory correction delayed the scheduled automated cargo drop by several days.',
        scientificContext:
          'Launch windows and orbital mechanics constrain when resupply landers can safely descend.',
        affectedSystems: ['Food', 'Water', 'Oxygen'],
        isResolved: false,
        choices: [
          {
            id: 'ration_consumables',
            label: 'Implement Strict Consumable Rationing',
            summary: 'Trim non-essential EVA water and ration reserve packs.',
            scienceReasoning: 'Extending reserve runway prevents sudden stockouts before resupply arrives.',
            buildCreditCost: 0,
            effectsDescription: '+8 rations · +12 L water · -4% Crew Health fatigue',
            deltas: { food: 8, water: 12, crewHealth: -4 },
          },
          {
            id: 'fabricate_spares',
            label: '3D-Print Emergency Filters & Boost Output',
            summary: 'Spend engineering credits to maintain full crew nutrition and output.',
            scienceReasoning: 'In-situ additive manufacturing bridges supply chain gaps.',
            buildCreditCost: 22,
            effectsDescription: '-22 SU · +10 rations · +15 L water · 0% Health penalty',
            deltas: { food: 10, water: 15 },
          },
        ],
      };
  }
}

export function advanceMissionDay(state: MissionState, days = 1): MissionState {
  let current = structuredClone(state) as MissionState;
  const steps = Math.max(1, Math.min(10, days));

  for (let s = 0; s < steps; s++) {
    if (current.status !== 'active') break;

    // Check if an unresolved event expired without response
    if (current.activeEvent && !current.activeEvent.isResolved) {
      current.activeEvent.daysRemainingToRespond -= 1;
      if (current.activeEvent.daysRemainingToRespond <= 0) {
        // Auto-apply unmitigated penalty
        const expired = current.activeEvent;
        expired.isResolved = true;
        expired.selectedChoiceId = 'unanswered';
        expired.outcomeExplanation = 'No response selected before deadline; emergency caused unmitigated system stress.';
        current.crewHealth = Math.max(0, current.crewHealth - 10);
        current.outpostCondition = Math.max(0, current.outpostCondition - 8);
        current.eventLog.push(expired);
        current.activeEvent = null;
        current.alerts.push(`Day ${current.currentDay}: ${expired.title} expired unmitigated (-10% Crew Health).`);
      }
    }

    const rates = evaluateDailyRates(current);
    const { caps } = rates;

    // Apply energy update
    current.energyKwh = Math.max(
      0,
      Math.min(caps.maxEnergyKwh, Number((current.energyKwh + rates.solarGenerationKwh - rates.energyDemandKwh).toFixed(1)))
    );

    // Apply water update
    current.waterL = Math.max(
      0,
      Math.min(caps.maxWaterL, Number((current.waterL + rates.water.netDeltaL).toFixed(1)))
    );

    // Apply oxygen update
    current.oxygenKg = Math.max(
      0,
      Math.min(caps.maxOxygenKg, Number((current.oxygenKg + rates.oxygen.netDeltaKg).toFixed(1)))
    );

    // Apply food update
    current.foodRations = Math.max(
      0,
      Math.min(caps.maxFoodRations, Number((current.foodRations + rates.food.netDeltaRations).toFixed(1)))
    );

    // Apply radiation & temperature
    current.radiationProtectionPct = rates.radiation.protectionPct;
    current.cumulativeRadiationMsv = Number((current.cumulativeRadiationMsv + rates.radiation.absorbedMsv).toFixed(2));
    current.temperatureC = rates.thermal.nextTemp;

    // Outpost wear & passive engineering stipend (daily telemetry research credits)
    const diffScale = getDifficultyScale(current.config.difficulty);
    let totalWear = 0;
    (Object.keys(current.modules) as ModuleId[]).forEach((id) => {
      if (current.modules[id].level > 0) {
        totalWear += OUTPOST_MODULES[id].maintenancePerDay * 0.65 * diffScale.wearMultiplier;
      }
    });
    current.outpostCondition = Math.max(10, Number((current.outpostCondition - totalWear).toFixed(1)));
    current.buildCredits += current.config.difficulty === 'explorer' ? 16 : current.config.difficulty === 'specialist' ? 12 : 9;

    // Health consequences if any survival resource hits critical or zero
    const dayAlerts: string[] = [];
    let healthDelta = 0;

    if (current.oxygenKg <= 0.1) {
      healthDelta -= 28;
      dayAlerts.push('CRITICAL: Oxygen depleted! Crew hypoxia risk.');
    } else if (current.oxygenKg < caps.maxOxygenKg * 0.15) {
      healthDelta -= 5;
      dayAlerts.push('Low oxygen reserve (<15%). Upgrade Oxygen Gen or check Water.');
    }

    if (current.waterL <= 0.1) {
      healthDelta -= 22;
      dayAlerts.push('CRITICAL: Potable water depleted!');
    } else if (current.waterL < caps.maxWaterL * 0.15) {
      healthDelta -= 4;
      dayAlerts.push('Low water reserve (<15%). Upgrade Water Recycler.');
    }

    if (current.foodRations <= 0.1) {
      healthDelta -= 18;
      dayAlerts.push('CRITICAL: Food rations exhausted!');
    } else if (current.foodRations < caps.maxFoodRations * 0.15) {
      healthDelta -= 3;
      dayAlerts.push('Food supply low (<15%). Expand Greenhouse.');
    }

    if (current.energyKwh <= 0.1) {
      healthDelta -= 6;
      dayAlerts.push('Power brownout: Batteries depleted, life support running at reduced capacity.');
    }

    if (current.temperatureC < 15 || current.temperatureC > 28) {
      healthDelta -= 8;
      dayAlerts.push(`Thermal emergency: Habitat temperature at ${current.temperatureC}°C.`);
    }

    if (rates.radiation.absorbedMsv > 2.5) {
      healthDelta -= 7;
      dayAlerts.push(`Elevated radiation dose (${rates.radiation.absorbedMsv} mSv/day).`);
    }

    // Gentle recovery if everything is nominal
    if (healthDelta === 0 && current.crewHealth < 100 && current.oxygenKg > 2 && current.waterL > 5 && current.foodRations > 2) {
      healthDelta += 1.5;
    }

    current.crewHealth = Math.max(0, Math.min(100, Number((current.crewHealth + healthDelta).toFixed(1))));

    // Decrement temporary modifiers
    if (current.activeModifiers.solarPenaltyDaysLeft > 0) {
      current.activeModifiers.solarPenaltyDaysLeft -= 1;
      if (current.activeModifiers.solarPenaltyDaysLeft === 0) current.activeModifiers.solarMultiplier = 1.0;
    }
    if (current.activeModifiers.dustStormDaysLeft > 0) current.activeModifiers.dustStormDaysLeft -= 1;
    if (current.activeModifiers.solarStormDaysLeft > 0) current.activeModifiers.solarStormDaysLeft -= 1;
    if (current.activeModifiers.shelterActiveDaysLeft > 0) current.activeModifiers.shelterActiveDaysLeft -= 1;

    current.currentDay += 1;

    // Check failure conditions
    if (current.crewHealth <= 0) {
      current.status = 'failed';
      current.failureReason =
        dayAlerts[0] || 'Crew health fell to critical levels due to sustained life-support shortages.';
    } else if (current.currentDay > current.config.durationDays) {
      current.currentDay = current.config.durationDays;
      current.status = 'completed';
    }

    // Refresh metrics & stability after day advance
    const postRates = evaluateDailyRates(current);
    current.metrics = postRates.metrics;
    current.stabilityScore = computeStabilityScore(current);
    current.alerts = dayAlerts;

    // Trigger next seeded event if still active
    if (current.status === 'active' && !current.activeEvent) {
      const nextEvent = generateSeededEvent(current);
      if (nextEvent) {
        current.activeEvent = nextEvent;
        if (nextEvent.type === 'dust_storm') current.activeModifiers.dustStormDaysLeft = 3;
        if (nextEvent.type === 'solar_storm') current.activeModifiers.solarStormDaysLeft = 2;
        current.alerts.unshift(`ALERT: ${nextEvent.title} requires commander response.`);
      }
    }

    current.history.push({
      day: current.currentDay,
      oxygen: current.oxygenKg,
      water: current.waterL,
      food: current.foodRations,
      energy: current.energyKwh,
      radiationProtection: current.radiationProtectionPct,
      temperatureC: current.temperatureC,
      crewHealth: current.crewHealth,
      outpostCondition: current.outpostCondition,
      stabilityScore: current.stabilityScore,
      solarGenerationKwh: postRates.solarGenerationKwh,
      energyDemandKwh: postRates.energyDemandKwh,
    });

    current.lastUpdated = new Date().toISOString();
    if (current.status !== 'active') break;
  }

  return current;
}

export function constructOrUpgradeModule(
  state: MissionState,
  moduleId: ModuleId
): { state: MissionState; error?: string } {
  const next = structuredClone(state) as MissionState;
  const inst = next.modules[moduleId];
  const def = OUTPOST_MODULES[moduleId];

  if (!inst || !def) {
    return { state, error: 'Unknown outpost module.' };
  }
  if (next.status !== 'active') {
    return { state, error: 'Cannot modify outpost after mission end.' };
  }
  if (inst.level >= def.maxLevel) {
    return { state, error: `${def.name} is already at maximum Level ${def.maxLevel}.` };
  }

  const cost = getModuleBuildCost(moduleId, inst.level);
  if (next.buildCredits < cost) {
    return {
      state,
      error: `Insufficient construction credits (${cost} SU needed, ${next.buildCredits} SU available).`,
    };
  }

  const wasZero = inst.level === 0;
  next.buildCredits -= cost;
  inst.level += 1;
  inst.efficiency = 1.0;
  inst.damaged = false;

  // Upgrading radiation shield or battery/habitat immediately updates protective/storage state
  next.radiationProtectionPct = computeBaseRadiationProtection(
    next.config.destination,
    next.modules,
    next.activeModifiers.shelterActiveDaysLeft > 0
  );
  next.outpostCondition = Math.min(100, Number((next.outpostCondition + 3).toFixed(1)));

  const updatedRates = evaluateDailyRates(next);
  next.metrics = updatedRates.metrics;
  next.stabilityScore = computeStabilityScore(next);

  next.decisions.push({
    day: next.currentDay,
    type: wasZero ? 'build' : 'upgrade',
    title: `${wasZero ? 'Constructed' : 'Upgraded'} ${def.name} (Lv ${inst.level})`,
    detail: `Spent ${cost} SU. ${def.resourceImpactSummary}`,
    impact: `New stability score: ${next.stabilityScore}%.`,
  });

  next.lastUpdated = new Date().toISOString();
  return { state: next };
}

export function resolveEventChoice(
  state: MissionState,
  eventId: string,
  choiceId: string
): { state: MissionState; error?: string } {
  const next = structuredClone(state) as MissionState;
  if (!next.activeEvent || next.activeEvent.id !== eventId) {
    return { state, error: 'No matching active event found.' };
  }

  const choice = next.activeEvent.choices.find((c) => c.id === choiceId);
  if (!choice) {
    return { state, error: 'Invalid event response option.' };
  }

  if (next.buildCredits < choice.buildCreditCost) {
    return {
      state,
      error: `Not enough build credits (${choice.buildCreditCost} SU required, ${next.buildCredits} SU available).`,
    };
  }

  next.buildCredits -= choice.buildCreditCost;
  const caps = computeCapacities(next.modules, next.config.crewSize);
  const d = choice.deltas;

  if (d.oxygen) next.oxygenKg = Math.max(0, Math.min(caps.maxOxygenKg, Number((next.oxygenKg + d.oxygen).toFixed(1))));
  if (d.water) next.waterL = Math.max(0, Math.min(caps.maxWaterL, Number((next.waterL + d.water).toFixed(1))));
  if (d.food) next.foodRations = Math.max(0, Math.min(caps.maxFoodRations, Number((next.foodRations + d.food).toFixed(1))));
  if (d.energy) next.energyKwh = Math.max(0, Math.min(caps.maxEnergyKwh, Number((next.energyKwh + d.energy).toFixed(1))));
  if (d.temperatureC) next.temperatureC = Number((next.temperatureC + d.temperatureC).toFixed(1));
  if (d.crewHealth) next.crewHealth = Math.max(0, Math.min(100, Number((next.crewHealth + d.crewHealth).toFixed(1))));
  if (d.outpostCondition) {
    next.outpostCondition = Math.max(10, Math.min(100, Number((next.outpostCondition + d.outpostCondition).toFixed(1))));
  }
  if (d.repairModuleId && next.modules[d.repairModuleId]) {
    next.modules[d.repairModuleId].efficiency = 1.0;
    next.modules[d.repairModuleId].damaged = false;
  }
  if (d.efficiencyBoostModuleId && next.modules[d.efficiencyBoostModuleId]) {
    next.modules[d.efficiencyBoostModuleId].efficiency = Math.min(
      1.0,
      next.modules[d.efficiencyBoostModuleId].efficiency + 0.15
    );
  }
  if (d.temporaryShieldBoostDays) {
    next.activeModifiers.shelterActiveDaysLeft = Math.max(
      next.activeModifiers.shelterActiveDaysLeft,
      d.temporaryShieldBoostDays
    );
  }
  if (d.temporaryPowerPenaltyDays) {
    next.activeModifiers.solarPenaltyDaysLeft = d.temporaryPowerPenaltyDays;
    next.activeModifiers.solarMultiplier = 0.7;
  }
  if (d.radiationProtection) {
    next.radiationProtectionPct = Math.min(98, next.radiationProtectionPct + d.radiationProtection);
  } else {
    next.radiationProtectionPct = computeBaseRadiationProtection(
      next.config.destination,
      next.modules,
      next.activeModifiers.shelterActiveDaysLeft > 0
    );
  }

  const resolvedEvent = {
    ...next.activeEvent,
    isResolved: true,
    selectedChoiceId: choice.id,
    outcomeExplanation: `${choice.label}: ${choice.scienceReasoning} (${choice.effectsDescription})`,
  };
  next.eventLog.push(resolvedEvent);
  next.activeEvent = null;

  next.decisions.push({
    day: next.currentDay,
    type: 'event_response',
    title: `Responded to ${resolvedEvent.title}`,
    detail: choice.label,
    impact: choice.effectsDescription,
  });

  const rates = evaluateDailyRates(next);
  next.metrics = rates.metrics;
  next.stabilityScore = computeStabilityScore(next);
  next.alerts = next.alerts.filter((a) => !a.startsWith('ALERT:'));
  next.lastUpdated = new Date().toISOString();

  return { state: next };
}

// Deterministic What-If Scenario Simulator
function runSingleWhatIfProjection(label: string, input: WhatIfInput): WhatIfScenarioProjection {
  const crewSize = Math.max(2, Math.min(8, input.crewSize)) as 2 | 4 | 6;
  const sim = createInitialMission({
    destination: input.destination,
    crewSize: crewSize === 2 || crewSize === 4 || crewSize === 6 ? crewSize : 4,
    durationDays: (input.durationDays === 10 || input.durationDays === 30 || input.durationDays === 60
      ? input.durationDays
      : 30) as 10 | 30 | 60,
    difficulty: 'explorer', // disable random spikes so What-If isolates pure engineering parameters
    budget: 'standard',
    seed: 101,
  });

  // Override module levels cleanly
  sim.config.crewSize = input.crewSize as 2 | 4 | 6;
  sim.config.durationDays = input.durationDays as 10 | 30 | 60;
  sim.modules.solar_array.level = input.solarLevel;
  sim.modules.greenhouse.level = input.greenhouseLevel;
  sim.modules.water_recycler.level = input.waterRecyclerLevel;
  sim.modules.radiation_shield.level = input.radiationShieldLevel;
  sim.modules.battery.level = input.batteryLevel;

  const caps = computeCapacities(sim.modules, sim.config.crewSize);
  sim.oxygenKg = Number((caps.maxOxygenKg * 0.85).toFixed(1));
  sim.waterL = Number((caps.maxWaterL * 0.85).toFixed(1));
  sim.foodRations = Number((caps.maxFoodRations * 0.85).toFixed(1));
  sim.energyKwh = Number((caps.maxEnergyKwh * 0.85).toFixed(1));
  sim.radiationProtectionPct = computeBaseRadiationProtection(sim.config.destination, sim.modules);

  // Run deterministic loop without random event injection
  const history: DailyHistoryPoint[] = [];
  const startRates = evaluateDailyRates(sim);
  history.push({
    day: 1,
    oxygen: sim.oxygenKg,
    water: sim.waterL,
    food: sim.foodRations,
    energy: sim.energyKwh,
    radiationProtection: sim.radiationProtectionPct,
    temperatureC: sim.temperatureC,
    crewHealth: sim.crewHealth,
    outpostCondition: sim.outpostCondition,
    stabilityScore: computeStabilityScore(sim),
    solarGenerationKwh: startRates.solarGenerationKwh,
    energyDemandKwh: startRates.energyDemandKwh,
  });

  for (let d = 2; d <= input.durationDays; d++) {
    sim.currentDay = d;
    const r = evaluateDailyRates(sim);
    const c = r.caps;
    sim.energyKwh = Math.max(0, Math.min(c.maxEnergyKwh, Number((sim.energyKwh + r.solarGenerationKwh - r.energyDemandKwh).toFixed(1))));
    sim.waterL = Math.max(0, Math.min(c.maxWaterL, Number((sim.waterL + r.water.netDeltaL).toFixed(1))));
    sim.oxygenKg = Math.max(0, Math.min(c.maxOxygenKg, Number((sim.oxygenKg + r.oxygen.netDeltaKg).toFixed(1))));
    sim.foodRations = Math.max(0, Math.min(c.maxFoodRations, Number((sim.foodRations + r.food.netDeltaRations).toFixed(1))));
    sim.temperatureC = r.thermal.nextTemp;
    sim.radiationProtectionPct = r.radiation.protectionPct;

    let penalty = 0;
    if (sim.oxygenKg <= 0.1) penalty += 18;
    if (sim.waterL <= 0.1) penalty += 15;
    if (sim.foodRations <= 0.1) penalty += 12;
    if (sim.energyKwh <= 0.1) penalty += 5;
    sim.crewHealth = Math.max(0, Math.min(100, Number((sim.crewHealth - penalty).toFixed(1))));

    history.push({
      day: d,
      oxygen: sim.oxygenKg,
      water: sim.waterL,
      food: sim.foodRations,
      energy: sim.energyKwh,
      radiationProtection: sim.radiationProtectionPct,
      temperatureC: sim.temperatureC,
      crewHealth: sim.crewHealth,
      outpostCondition: sim.outpostCondition,
      stabilityScore: computeStabilityScore(sim),
      solarGenerationKwh: r.solarGenerationKwh,
      energyDemandKwh: r.energyDemandKwh,
    });
  }

  const endRates = evaluateDailyRates(sim);
  const finalStability = computeStabilityScore(sim);
  const energyBalance = Number((endRates.solarGenerationKwh - endRates.energyDemandKwh).toFixed(1));

  // Identify primary bottleneck
  let bottleneck = 'None — system is balanced';
  if (energyBalance < -3) bottleneck = `Energy deficit (${energyBalance} kWh/day)`;
  else if (endRates.oxygen.netDeltaKg < -0.5) bottleneck = `Oxygen depletion (${endRates.oxygen.netDeltaKg} kg/day)`;
  else if (endRates.water.netDeltaL < -1.5) bottleneck = `Water loss (${endRates.water.netDeltaL} L/day)`;
  else if (endRates.food.netDeltaRations < -1.5) bottleneck = `Food depletion (${endRates.food.netDeltaRations} rations/day)`;
  else if (sim.radiationProtectionPct < 55) bottleneck = `Low radiation shielding (${sim.radiationProtectionPct}%)`;

  const survivalRisk: WhatIfScenarioProjection['survivalRisk'] =
    sim.crewHealth < 40 || finalStability < 40
      ? 'Critical'
      : finalStability < 62
      ? 'High'
      : finalStability < 80
      ? 'Moderate'
      : 'Low';

  return {
    label,
    finalStability,
    finalCrewHealth: sim.crewHealth,
    energyBalanceDailyKwh: energyBalance,
    oxygenBalanceDailyKg: endRates.oxygen.netDeltaKg,
    waterBalanceDailyL: endRates.water.netDeltaL,
    foodBalanceDailyRations: endRates.food.netDeltaRations,
    radiationProtectionPct: sim.radiationProtectionPct,
    survivalRisk,
    bottleneck,
    history,
  };
}

export function runWhatIfComparison(baseline: WhatIfInput, modified: WhatIfInput): WhatIfComparisonResult {
  const baseProj = runSingleWhatIfProjection('Baseline Scenario', baseline);
  const modProj = runSingleWhatIfProjection('Modified Scenario', modified);

  const tradeOffs: string[] = [];
  if (modified.crewSize > baseline.crewSize) {
    tradeOffs.push(
      `Increasing crew from ${baseline.crewSize} to ${modified.crewSize} raises daily oxygen, water, and food demand proportionally.`
    );
  }
  if (modified.greenhouseLevel > baseline.greenhouseLevel) {
    tradeOffs.push(
      `Expanding Greenhouse to Lv ${modified.greenhouseLevel} improves food balance (${modProj.foodBalanceDailyRations}/day) while drawing +${(modified.greenhouseLevel - baseline.greenhouseLevel) * 11} kWh/day.`
    );
  }
  if (modified.waterRecyclerLevel > baseline.waterRecyclerLevel) {
    tradeOffs.push(
      `Higher Water Recycling (Lv ${modified.waterRecyclerLevel}) cuts daily water loss but adds electrical load.`
    );
  }
  if (modified.solarLevel !== baseline.solarLevel || modified.batteryLevel !== baseline.batteryLevel) {
    tradeOffs.push(
      `Energy balance shifted from ${baseProj.energyBalanceDailyKwh >= 0 ? '+' : ''}${baseProj.energyBalanceDailyKwh} to ${modProj.energyBalanceDailyKwh >= 0 ? '+' : ''}${modProj.energyBalanceDailyKwh} kWh/day.`
    );
  }
  if (modified.radiationShieldLevel > baseline.radiationShieldLevel) {
    tradeOffs.push(
      `Radiation shielding improved from ${baseProj.radiationProtectionPct}% to ${modProj.radiationProtectionPct}% with zero ongoing power cost.`
    );
  }
  if (tradeOffs.length === 0) {
    tradeOffs.push('Adjust any slider in the Modified Scenario to observe coupled resource trade-offs.');
  }

  return {
    baseline: baseProj,
    modified: modProj,
    tradeOffs,
  };
}

export function generateMissionReport(state: MissionState): MissionReport {
  const score = Math.round(
    state.crewHealth * 0.45 + state.stabilityScore * 0.35 + state.outpostCondition * 0.2
  );

  let outcome: MissionOutcome;
  let outcomeExplanation: string;

  if (state.status === 'failed' || state.crewHealth <= 0) {
    outcome = 'Mission Failed';
    outcomeExplanation =
      state.failureReason ||
      'Critical life-support depletion forced an emergency mission abort before completing the target duration.';
  } else if (score >= 80 && state.crewHealth >= 80) {
    outcome = 'Mission Accomplished';
    outcomeExplanation =
      'Outstanding systems engineering! Your outpost maintained healthy reserves, balanced electrical power, and protected the crew across the full mission.';
  } else if (score >= 60 && state.crewHealth >= 55) {
    outcome = 'Mission Accomplished with Challenges';
    outcomeExplanation =
      'Your crew survived the mission duration, though resource bottlenecks or emergency stress lowered final stability margins.';
  } else {
    outcome = 'Mission Requires Improvement';
    outcomeExplanation =
      'The outpost reached the final day, but severe reserve depletion left crew health and structural margins below target safety thresholds.';
  }

  const achievements: string[] = [];
  if (state.modules.water_recycler.level >= 2) achievements.push('Closed-Loop Hydrologist: Upgraded Water Recycling beyond baseline.');
  if (state.modules.greenhouse.level >= 1) achievements.push('Bioregenerative Pioneer: Cultivated fresh crops off-Earth.');
  if (state.modules.radiation_shield.level >= 2 || state.modules.emergency_shelter.level >= 1) {
    achievements.push('Radiation Architect: Strengthened crew protection against solar events.');
  }
  if (state.eventLog.length >= 2) achievements.push(`Crisis Commander: Navigated ${state.eventLog.length} simulated mission anomalies.`);
  if (achievements.length === 0) achievements.push('First-Step Explorer: Completed initial outpost operations.');

  const recommendations: string[] = [];
  const waterMetric = state.metrics.find((m) => m.id === 'water');
  const energyMetric = state.metrics.find((m) => m.id === 'energy');
  const foodMetric = state.metrics.find((m) => m.id === 'food');

  if (energyMetric && energyMetric.netDaily < 0) {
    recommendations.push('Expand Solar Power Arrays early—especially on Mars where solar irradiance is ~43% of Earth/Moon levels.');
  }
  if (waterMetric && waterMetric.netDaily < -2) {
    recommendations.push('Prioritize Water Recycling Unit Level 2+ early to preserve H₂O for both crew hydration and O₂ electrolysis.');
  }
  if (foodMetric && foodMetric.netDaily < -1.5) {
    recommendations.push('Pair a Hydroponic Greenhouse upgrade with sufficient Battery and Solar capacity to offset grow-light power draw.');
  }
  if (state.radiationProtectionPct < 60) {
    recommendations.push('Invest in Radiation Shielding or an Emergency Storm Shelter before solar particle events strike.');
  }
  if (recommendations.length === 0) {
    recommendations.push('Try a 60-day Commander mission on Mars with a 6-astronaut crew to test tighter engineering margins.');
  }

  return {
    missionId: state.id,
    destination: state.config.destination,
    crewSize: state.config.crewSize,
    durationDays: state.config.durationDays,
    daysSurvived: state.currentDay,
    outcome,
    missionScore: score,
    outcomeExplanation,
    finalMetrics: state.metrics,
    majorEvents: state.eventLog,
    decisions: state.decisions,
    learningAchievements: achievements,
    recommendations,
  };
}
