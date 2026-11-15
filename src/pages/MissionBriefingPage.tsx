import React, { useState } from 'react';
import { ExternalLink, Loader2, Rocket, Shuffle } from 'lucide-react';
import { PlanetComparisonCard } from '../components/PlanetComparisonCard.tsx';
import { BudgetTier, Destination, Difficulty, MissionConfig } from '../shared/types.ts';

interface MissionBriefingPageProps {
  onLaunchMission: (config: MissionConfig) => Promise<void>;
  isLaunching: boolean;
}

export const MissionBriefingPage: React.FC<MissionBriefingPageProps> = ({
  onLaunchMission,
  isLaunching,
}) => {
  const [destination, setDestination] = useState<Destination>('moon');
  const [crewSize, setCrewSize] = useState<2 | 4 | 6>(4);
  const [durationDays, setDurationDays] = useState<10 | 30 | 60>(30);
  const [difficulty, setDifficulty] = useState<Difficulty>('specialist');
  const [budget, setBudget] = useState<BudgetTier>('standard');
  const [seed, setSeed] = useState<number>(2026);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLaunchMission({ destination, crewSize, durationDays, difficulty, budget, seed });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-mono uppercase tracking-wider text-sky-700 font-semibold">
          Phase 01 · Mission Briefing & Planetary Selection
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 text-balance">
          Configure Your Lunar or Martian Outpost
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Select destination, crew size, mission duration, and initial engineering budget. Review NASA planetary
          comparisons below before commissioning your habitat.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Configuration Controls */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
          {/* 1. Destination */}
          <div className="space-y-2.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-500">
              1. Destination
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  {
                    id: 'moon',
                    title: 'Moon · South Pole Rim',
                    sub: '1/6th Earth gravity · Strong solar peak · 1.3s comms delay · Extreme -173°C to +127°C swings',
                  },
                  {
                    id: 'mars',
                    title: 'Mars · Jezero Crater',
                    sub: '3/8th Earth gravity · ~43% solar flux · Dust storm risk · 4–24 min comms delay',
                  },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDestination(opt.id)}
                  className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                    destination === opt.id
                      ? 'border-sky-600 bg-sky-50/70 ring-1 ring-sky-600/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <p className="text-sm font-bold text-slate-900">{opt.title}</p>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">{opt.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Crew & 3. Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500">
                2. Crew Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([2, 4, 6] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setCrewSize(size)}
                    className={`py-2.5 px-3 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      crewSize === size
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {size} Crew
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500">
                3. Mission Duration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([10, 30, 60] as const).map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setDurationDays(days)}
                    className={`py-2.5 px-3 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      durationDays === days
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Difficulty */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-500">
              4. Difficulty Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(
                [
                  { id: 'explorer', label: 'Explorer', desc: 'Lower anomaly frequency & gentler wear' },
                  { id: 'specialist', label: 'Mission Specialist', desc: 'Balanced events & engineering margins' },
                  { id: 'commander', label: 'Commander', desc: 'Frequent severe anomalies & tight margins' },
                ] as const
              ).map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDifficulty(d.id)}
                  className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    difficulty === d.id
                      ? 'border-sky-600 bg-sky-50/70'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900">{d.label}</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">{d.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Initial Budget & Seed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500">
                5. Initial Resource Budget
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'limited', label: 'Limited', sub: '180 SU' },
                    { id: 'standard', label: 'Standard', sub: '310 SU' },
                    { id: 'advanced', label: 'Advanced', sub: '460 SU' },
                  ] as const
                ).map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBudget(b.id)}
                    className={`py-2 px-2.5 text-center rounded-lg border transition-colors cursor-pointer ${
                      budget === b.id
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-xs font-semibold">{b.label}</span>
                    <span className={`block text-[10px] font-mono ${budget === b.id ? 'text-amber-300' : 'text-slate-500'}`}>
                      {b.sub}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="scenario-seed" className="block text-xs font-mono uppercase tracking-wider text-slate-500">
                Scenario Seed (Reproducible Events)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="scenario-seed"
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(Number(e.target.value) || 2026)}
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg bg-white text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setSeed(Math.floor(1000 + Math.random() * 9000))}
                  title="Randomize seed"
                  className="p-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 cursor-pointer"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLaunching}
            className="w-full py-3.5 px-6 text-sm font-semibold rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {isLaunching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Commissioning Outpost...
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                Launch {destination === 'moon' ? 'Lunar' : 'Martian'} Mission
              </>
            )}
          </button>
        </div>

        {/* Right: Destination Environmental Preview */}
        <div className="lg:col-span-5 bg-slate-950 text-white border border-slate-800 rounded-2xl overflow-hidden">
          <div className="h-56 relative">
            <img
              src={
                destination === 'moon'
                  ? '/src/assets/images/hero_lunar_outpost_1794761660112.jpg'
                  : '/src/assets/images/mars_outpost_horizon_1794761660330.jpg'
              }
              alt={destination === 'moon' ? 'Lunar south pole outpost vista' : 'Martian outpost vista'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-4">
              <p className="text-xs font-mono text-sky-300">
                Target Environment · {destination === 'moon' ? 'Moon' : 'Mars'}
              </p>
              <h3 className="font-display text-lg font-bold">
                {destination === 'moon' ? 'Lunar South Pole Crater Rim' : 'Jezero Crater Delta Plain'}
              </h3>
            </div>
          </div>

          <div className="p-5 space-y-4 text-xs">
            {destination === 'moon' ? (
              <ul className="space-y-2 text-slate-300">
                <li>
                  <strong className="text-white">Solar Illumination:</strong> High peak irradiance (~1,361 W/m²), with
                  periodic crater-rim shadow dips modelled every ~14 days.
                </li>
                <li>
                  <strong className="text-white">Thermal Challenge:</strong> No atmosphere to buffer extreme -173°C to
                  +127°C radiative cycles.
                </li>
                <li>
                  <strong className="text-white">NASA Terrain Explorer:</strong>{' '}
                  <a
                    href="https://trek.nasa.gov/moon/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:underline inline-flex items-center gap-1"
                  >
                    Open NASA Moon Trek <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2 text-slate-300">
                <li>
                  <strong className="text-white">Solar Illumination:</strong> ~43% of Earth/Moon solar flux (~590 W/m²
                  peak) plus potential multi-day regional dust storms.
                </li>
                <li>
                  <strong className="text-white">Atmosphere & Cold:</strong> Thin 95% CO₂ atmosphere averaging roughly
                  -63°C requires continuous heating and airtight habitats.
                </li>
                <li>
                  <strong className="text-white">NASA Terrain Explorer:</strong>{' '}
                  <a
                    href="https://trek.nasa.gov/mars/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:underline inline-flex items-center gap-1"
                  >
                    Open NASA Mars Trek <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            )}

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              Note: Resource rates inside the simulator are documented illustrative educational coefficients inspired by
              NASA life-support concepts.
            </div>
          </div>
        </div>
      </form>

      <PlanetComparisonCard />
    </div>
  );
};
