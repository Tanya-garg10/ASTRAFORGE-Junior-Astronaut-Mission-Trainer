import { describe, expect, it } from 'vitest';
import {
  advanceMissionDay,
  constructOrUpgradeModule,
  createInitialMission,
  evaluateDailyRates,
  generateMissionReport,
  getModuleBuildCost,
  resolveEventChoice,
  runWhatIfComparison,
} from './simulation.ts';

describe('ASTRAFORGE Deterministic Simulation Engine', () => {
  it('creates an initial Moon mission with valid capacities and metrics', () => {
    const mission = createInitialMission({
      destination: 'moon',
      crewSize: 4,
      durationDays: 30,
      difficulty: 'specialist',
      budget: 'standard',
      seed: 42,
    });

    expect(mission.currentDay).toBe(1);
    expect(mission.status).toBe('active');
    expect(mission.buildCredits).toBe(310);
    expect(mission.metrics).toHaveLength(6);
    expect(mission.history).toHaveLength(1);
    expect(mission.oxygenKg).toBeGreaterThan(0);
    expect(mission.waterL).toBeGreaterThan(0);
  });

  it('deducts build credits and upgrades module level + updates simulation rates', () => {
    const mission = createInitialMission({
      destination: 'mars',
      crewSize: 4,
      durationDays: 30,
      difficulty: 'specialist',
      budget: 'standard',
      seed: 42,
    });

    const cost = getModuleBuildCost('greenhouse', 0);
    const { state: updated, error } = constructOrUpgradeModule(mission, 'greenhouse');

    expect(error).toBeUndefined();
    expect(updated.modules.greenhouse.level).toBe(1);
    expect(updated.buildCredits).toBe(mission.buildCredits - cost);

    const foodMetric = updated.metrics.find((m) => m.id === 'food');
    expect(foodMetric?.dailyProduction).toBeGreaterThan(0);
    expect(updated.decisions.length).toBe(2);
  });

  it('rejects construction when build credits are insufficient', () => {
    const mission = createInitialMission({
      destination: 'moon',
      crewSize: 2,
      durationDays: 10,
      difficulty: 'commander',
      budget: 'limited',
      seed: 7,
    });
    mission.buildCredits = 10;

    const { error } = constructOrUpgradeModule(mission, 'emergency_shelter');
    expect(error).toContain('Insufficient construction credits');
  });

  it('models Moon vs Mars solar flux difference accurately in daily rates', () => {
    const moon = createInitialMission({
      destination: 'moon',
      crewSize: 4,
      durationDays: 30,
      difficulty: 'explorer',
      budget: 'standard',
      seed: 100,
    });
    moon.modules.solar_array.level = 2;

    const mars = createInitialMission({
      destination: 'mars',
      crewSize: 4,
      durationDays: 30,
      difficulty: 'explorer',
      budget: 'standard',
      seed: 100,
    });
    mars.modules.solar_array.level = 2;

    const moonRates = evaluateDailyRates(moon);
    const marsRates = evaluateDailyRates(mars);

    expect(moonRates.solarGenerationKwh).toBeGreaterThan(marsRates.solarGenerationKwh);
  });

  it('advances days deterministically and completes a 10-day mission with healthy setup', () => {
    let mission = createInitialMission({
      destination: 'moon',
      crewSize: 2,
      durationDays: 10,
      difficulty: 'explorer',
      budget: 'advanced',
      seed: 123,
    });

    for (let i = 0; i < 10; i++) {
      if (mission.activeEvent) {
        const res = resolveEventChoice(mission, mission.activeEvent.id, mission.activeEvent.choices[0].id);
        mission = res.state;
      }
      mission = advanceMissionDay(mission, 1);
    }

    expect(mission.currentDay).toBe(10);
    expect(mission.status).toBe('completed');

    const report = generateMissionReport(mission);
    expect(report.outcome).toMatch(/Mission Accomplished/);
    expect(report.missionScore).toBeGreaterThan(60);
  });

  it('triggers mission failure if crew health drops to zero from severe depletion', () => {
    let mission = createInitialMission({
      destination: 'mars',
      crewSize: 6,
      durationDays: 30,
      difficulty: 'commander',
      budget: 'limited',
      seed: 99,
    });
    mission.oxygenKg = 0;
    mission.waterL = 0;
    mission.foodRations = 0;
    mission.modules.oxygen_gen.level = 0;
    mission.modules.water_recycler.level = 0;

    mission = advanceMissionDay(mission, 3);
    expect(mission.status).toBe('failed');
    expect(mission.crewHealth).toBe(0);

    const report = generateMissionReport(mission);
    expect(report.outcome).toBe('Mission Failed');
  });

  it('runs What-If comparison showing coupled trade-offs', () => {
    const result = runWhatIfComparison(
      {
        destination: 'mars',
        crewSize: 4,
        durationDays: 30,
        solarLevel: 2,
        greenhouseLevel: 0,
        waterRecyclerLevel: 1,
        radiationShieldLevel: 1,
        batteryLevel: 1,
      },
      {
        destination: 'mars',
        crewSize: 4,
        durationDays: 30,
        solarLevel: 4,
        greenhouseLevel: 2,
        waterRecyclerLevel: 3,
        radiationShieldLevel: 2,
        batteryLevel: 2,
      }
    );

    expect(result.modified.foodBalanceDailyRations).toBeGreaterThan(result.baseline.foodBalanceDailyRations);
    expect(result.modified.radiationProtectionPct).toBeGreaterThan(result.baseline.radiationProtectionPct);
    expect(result.tradeOffs.length).toBeGreaterThan(0);
  });
});
