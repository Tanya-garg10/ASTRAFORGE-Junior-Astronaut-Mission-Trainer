import React from 'react';
import { ArrowRight, BookOpen, Compass, Layers, ShieldCheck } from 'lucide-react';
import { AppView } from '../components/TopNav.tsx';

interface LandingPageProps {
  onNavigate: (view: AppView) => void;
  hasSavedMission: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, hasSavedMission }) => {
  return (
    <div className="bg-slate-50 text-slate-900">
      {/* Hero Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-12 lg:pt-14 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between gap-6 py-2">
            <div className="space-y-4">
              <p className="text-xs font-mono uppercase tracking-wider text-sky-700 font-semibold">
                ASTRAFORGE · Junior Astronaut Mission Trainer · NASA Space Apps Challenge 2026
              </p>
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 text-balance leading-[1.08]">
                Your Mission. Your Decisions. Their Survival.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Think Like an Engineer. Train Like an Astronaut. Build Beyond Earth. Command a lunar or
                Martian outpost, balance coupled life-support systems, and explore real NASA planetary science.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate(hasSavedMission ? 'mission' : 'briefing')}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg bg-slate-900 hover:bg-sky-700 text-white transition-colors cursor-pointer"
              >
                {hasSavedMission ? 'Resume Active Mission' : 'Start Your Mission'}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('science')}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-sky-700" />
                Explore Space Science
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Independent educational simulator · Clearly separates real NASA planetary facts from illustrative simulation assumptions.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 h-72 sm:h-96 lg:h-full">
              <img
                src="/src/assets/images/hero_lunar_outpost_1794761660112.jpg"
                alt="Modular lunar research outpost near the Moon south pole with Earth rising above"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-transparent p-5">
                <p className="text-xs font-mono text-sky-300">Lunar South Pole & Jezero Crater Scenarios</p>
                <p className="text-sm font-medium text-white mt-0.5">
                  Manage oxygen, water recycling, hydroponics, solar power, radiation shielding, and thermal stability.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width 4-Column Mission KPI Strip */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 border-t border-b border-slate-200 py-6">
          <div>
            <p className="text-2xl font-mono font-bold tabular-nums text-slate-900">6 Systems</p>
            <p className="text-xs text-slate-600 mt-1">Coupled O₂, Water, Food, Energy, Radiation & Thermal math</p>
          </div>
          <div>
            <p className="text-2xl font-mono font-bold tabular-nums text-slate-900">10 Modules</p>
            <p className="text-xs text-slate-600 mt-1">Constructible & upgradeable outpost infrastructure</p>
          </div>
          <div>
            <p className="text-2xl font-mono font-bold tabular-nums text-slate-900">10 Anomalies</p>
            <p className="text-xs text-slate-600 mt-1">Seeded crisis scenarios with scientific trade-offs</p>
          </div>
          <div>
            <p className="text-2xl font-mono font-bold tabular-nums text-slate-900">NASA API</p>
            <p className="text-xs text-slate-600 mt-1">Live Moon & Mars imagery, manifests, and learning modules</p>
          </div>
        </div>
      </section>

      {/* Mission Control Preview & Engineering Loop */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 text-white space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <p className="text-xs font-mono text-sky-400">Mission Control Preview · Mars Jezero Outpost</p>
                <h2 className="font-display text-xl font-bold mt-0.5">Interconnected Survival Telemetry</h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('briefing')}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 text-white cursor-pointer"
              >
                Configure Mission
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                <p className="text-[11px] font-mono uppercase text-slate-400">Oxygen Loop</p>
                <p className="text-xl font-mono font-semibold tabular-nums text-white mt-1">57.6 kg</p>
                <p className="text-[11px] text-emerald-400 mt-1">● Nominal · Electrolysis active</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                <p className="text-[11px] font-mono uppercase text-slate-400">Solar Flux (Mars)</p>
                <p className="text-xl font-mono font-semibold tabular-nums text-white mt-1">52.0 kWh/d</p>
                <p className="text-[11px] text-amber-400 mt-1">▲ ~43% of Lunar irradiance</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                <p className="text-[11px] font-mono uppercase text-slate-400">Water Recovery</p>
                <p className="text-xl font-mono font-semibold tabular-nums text-white mt-1">72% → 95%</p>
                <p className="text-[11px] text-sky-400 mt-1">● Upgradeable ECLSS loop</p>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-800 h-48">
              <img
                src="/src/assets/images/mars_outpost_horizon_1794761660330.jpg"
                alt="Martian surface outpost dome and photovoltaic array field"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
                Why Systems Thinking Matters Beyond Earth
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Every upgrade changes another system. Growing food inside a hydroponic greenhouse adds nutrition and
                supplemental oxygen—but raises electrical and water demand. ASTRAFORGE teaches students to trace
                cause and effect before emergencies strike.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Layers className="w-5 h-5 text-sky-700 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Deterministic Resource Engine</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Every number updates from transparent daily equations and displays why it changed.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Compass className="w-5 h-5 text-sky-700 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">What-If Strategy Lab & AI Mentor</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Test alternative crew sizes or solar arrays side by side, and ask the AI Mission Mentor to explain the science.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-sky-700 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Grounded in Official NASA Resources</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Integrates NASA Moon/Mars Facts, Moon & Mars Trek context, Space Place concepts, and the NASA Image & Video API.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('what-if')}
                className="text-sm font-semibold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1.5 cursor-pointer"
              >
                Open the What-If Experiment Lab
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
