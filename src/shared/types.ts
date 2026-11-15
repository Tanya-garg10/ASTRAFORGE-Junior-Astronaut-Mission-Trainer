export type Destination = 'moon' | 'mars';
export type Difficulty = 'explorer' | 'specialist' | 'commander';
export type BudgetTier = 'limited' | 'standard' | 'advanced';
export type MissionOutcome =
  | 'Mission Accomplished'
  | 'Mission Accomplished with Challenges'
  | 'Mission Requires Improvement'
  | 'Mission Failed';

export type ModuleId =
  | 'habitat'
  | 'solar_array'
  | 'battery'
  | 'greenhouse'
  | 'water_recycler'
  | 'oxygen_gen'
  | 'radiation_shield'
  | 'thermal_control'
  | 'emergency_shelter'
  | 'comms_antenna';

export interface OutpostModuleDefinition {
  id: ModuleId;
  name: string;
  category: 'Core' | 'Power' | 'Life Support' | 'Protection' | 'Operations';
  baseCost: number;
  upgradeCostMultiplier: number;
  maxLevel: number;
  powerPerLevelKw: number; // positive = generates, negative = consumes
  description: string;
  resourceImpactSummary: string;
  capacityEffect: string;
  maintenancePerDay: number; // outpost condition wear or SU upkeep equivalent
  scienceExplanation: string;
  gridSlot: { col: number; row: number };
}

export interface InstalledModule {
  id: ModuleId;
  level: number;
  efficiency: number; // 0.3 to 1.0 (can drop during malfunctions)
  damaged: boolean;
}

export interface ResourceMetric {
  id: 'oxygen' | 'water' | 'food' | 'energy' | 'radiation' | 'temperature';
  label: string;
  unit: string;
  current: number;
  max: number;
  minSafe: number;
  maxSafe: number;
  dailyConsumption: number;
  dailyProduction: number;
  netDaily: number;
  estimatedDaysRemaining: number | null; // null if net >= 0 or non-depleting index
  status: 'Nominal' | 'Caution' | 'Critical';
  reason: string;
}

export interface DailyHistoryPoint {
  day: number;
  oxygen: number;
  water: number;
  food: number;
  energy: number;
  radiationProtection: number;
  temperatureC: number;
  crewHealth: number;
  outpostCondition: number;
  stabilityScore: number;
  solarGenerationKwh: number;
  energyDemandKwh: number;
}

export interface EventChoice {
  id: string;
  label: string;
  summary: string;
  scienceReasoning: string;
  buildCreditCost: number;
  effectsDescription: string;
  // Deterministic deltas applied when selected
  deltas: {
    oxygen?: number;
    water?: number;
    food?: number;
    energy?: number;
    radiationProtection?: number;
    temperatureC?: number;
    crewHealth?: number;
    outpostCondition?: number;
    repairModuleId?: ModuleId;
    efficiencyBoostModuleId?: ModuleId;
    temporaryShieldBoostDays?: number;
    temporaryPowerPenaltyDays?: number;
  };
}

export interface MissionEvent {
  id: string;
  type:
    | 'solar_storm'
    | 'dust_storm'
    | 'solar_efficiency_drop'
    | 'water_recycling_failure'
    | 'greenhouse_crop_failure'
    | 'oxygen_malfunction'
    | 'battery_failure'
    | 'temperature_emergency'
    | 'comms_interruption'
    | 'supply_delay';
  title: string;
  severity: 'Moderate' | 'High' | 'Severe';
  triggeredDay: number;
  daysRemainingToRespond: number;
  description: string;
  scientificContext: string;
  affectedSystems: string[];
  choices: EventChoice[];
  isResolved: boolean;
  selectedChoiceId?: string;
  outcomeExplanation?: string;
}

export interface DecisionRecord {
  day: number;
  type: 'build' | 'upgrade' | 'event_response' | 'advance';
  title: string;
  detail: string;
  impact: string;
}

export interface MissionConfig {
  destination: Destination;
  crewSize: 2 | 4 | 6;
  durationDays: 10 | 30 | 60;
  difficulty: Difficulty;
  budget: BudgetTier;
  seed: number;
}

export interface MissionState {
  id: string;
  config: MissionConfig;
  currentDay: number;
  status: 'active' | 'completed' | 'failed';
  failureReason?: string;
  buildCredits: number; // Supply Units (SU)
  crewHealth: number; // 0-100
  outpostCondition: number; // 0-100
  stabilityScore: number; // 0-100
  modules: Record<ModuleId, InstalledModule>;
  // Stored resource levels
  oxygenKg: number;
  waterL: number;
  foodRations: number;
  energyKwh: number;
  radiationProtectionPct: number; // 0-100 modeled shielding effectiveness
  cumulativeRadiationMsv: number;
  temperatureC: number;
  // Temporary modifiers from active events or mitigation choices
  activeModifiers: {
    solarMultiplier: number;
    solarPenaltyDaysLeft: number;
    dustStormDaysLeft: number;
    solarStormDaysLeft: number;
    shelterActiveDaysLeft: number;
    commsDownDaysLeft: number;
  };
  metrics: ResourceMetric[];
  activeEvent: MissionEvent | null;
  eventLog: MissionEvent[];
  decisions: DecisionRecord[];
  history: DailyHistoryPoint[];
  alerts: string[];
  lastUpdated: string;
}

export interface WhatIfInput {
  destination: Destination;
  crewSize: number;
  durationDays: number;
  solarLevel: number;
  greenhouseLevel: number;
  waterRecyclerLevel: number;
  radiationShieldLevel: number;
  batteryLevel: number;
}

export interface WhatIfScenarioProjection {
  label: string;
  finalStability: number;
  finalCrewHealth: number;
  energyBalanceDailyKwh: number;
  oxygenBalanceDailyKg: number;
  waterBalanceDailyL: number;
  foodBalanceDailyRations: number;
  radiationProtectionPct: number;
  survivalRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
  bottleneck: string;
  history: DailyHistoryPoint[];
}

export interface WhatIfComparisonResult {
  baseline: WhatIfScenarioProjection;
  modified: WhatIfScenarioProjection;
  tradeOffs: string[];
}

export interface MissionReport {
  missionId: string;
  destination: Destination;
  crewSize: number;
  durationDays: number;
  daysSurvived: number;
  outcome: MissionOutcome;
  missionScore: number;
  outcomeExplanation: string;
  finalMetrics: ResourceMetric[];
  majorEvents: MissionEvent[];
  decisions: DecisionRecord[];
  learningAchievements: string[];
  recommendations: string[];
}

export interface NASAMediaItem {
  nasaId: string;
  title: string;
  description: string;
  mediaType: 'image' | 'video';
  thumbnailUrl: string;
  fallbackImageUrl: string;
  center?: string;
  dateCreated?: string;
  photographer?: string;
  keywords: string[];
  nasaPageUrl: string;
  sourceLabel: 'NASA MEDIA SOURCE';
  credit: string;
  restrictionsNote: string;
}

export interface NASAAssetDetail {
  nasaId: string;
  mediaType: 'image' | 'video';
  title: string;
  description: string;
  playableVideoUrl: string | null;
  highResImageUrl: string | null;
  captionsUrl: string | null;
  nasaPageUrl: string;
  credit: string;
  restrictionsNote: string;
  manifestCount: number;
}

export interface LearningQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LearningTopic {
  id: string;
  title: string;
  category: string;
  summary: string;
  explanation: string;
  keyFacts: string[];
  simulationConnection: string;
  imageUrl: string;
  imageCaption: string;
  nasaQuery: string;
  sourceTitle: string;
  sourceUrl: string;
  quiz: LearningQuizQuestion[];
}
