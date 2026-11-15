import React, { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { SlidersHorizontal } from 'lucide-react';
import { runWhatIfComparison } from '../shared/simulation.ts';
import { WhatIfComparisonResult, WhatIfInput } from '../shared/types.ts';

const DEFAULT_BASELINE: WhatIfInput = {
  destination: 'mars',
  crewSize: 4,
  durationDays: 30,
  solarLevel: 2,
  greenhouseLevel: 0,
  waterRecyclerLevel: 1,
  radiationShieldLevel: 1,
  batteryLevel: 1,
};

const DEFAULT_MODIFIED: WhatIfInput = {
  destination: 'mars',
  crewSize: 4,
  durationDays: 30,
  solarLevel: 4,
  greenhouseLevel: 2,
  waterRecyclerLevel: 3,
  radiationShieldLevel: 2,
  batteryLevel: 2,
};

export const WhatIfLabPage: React.FC = () => {
  const [baseline, setBaseline] = useState<WhatIfInput>(DEFAULT_BASELINE);
  const [modified, setModified] = useState<WhatIfInput>(DEFAULT_MODIFIED);
  const [comparison, setComparison] = useState<WhatIfComparisonResult>(() =>
    runWhatIfComparison(DEFAULT_BASELINE, DEFAULT_MODIFIED)
  );
  const [chartMetric, setChartMetric] = useState<'stabilityScore' | 'water' | 'energy' | 'food'>('stabilityScore');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/simulation/what-if', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ baseline, modified }),
    })
      .then((res) => res.json())
      .then((data: WhatIfComparisonResult) => {
        if (!cancelled && data?.baseline && data?.modified) {
          setComparison(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setComparison(runWhatIfComparison(baseline, modified));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [baseline, modified]);

  const combinedChartData = comparison.baseline.history.map((bPoint, idx) => {
    const mPoint = comparison.modified.history[idx];
    return {
      day: bPoint.day,
      baselineVal: bPoint[chartMetric],
      modifiedVal: mPoint ? mPoint[chartMetric] : bPoint[chartMetric],
    };
  });

  const sliderConfigs: Array<{
    key: keyof WhatIfInput;
    label: string;
    min: number;
    max: number;
    step: number;
    unit: string;
  }> = [
    { key: 'crewSize', label: 'Crew Size', min: 2, max: 6, step: 2, unit: 'astronauts' },
    { key: 'solarLevel', label: 'Solar Power Array', min: 1, max: 5, step: 1, unit: 'Lv' },
    { key: 'batteryLevel', label: 'Battery Storage', min: 1, max: 5, step: 1, unit: 'Lv' },
    { key: 'greenhouseLevel', label: 'Greenhouse Size', min: 0, max: 5, step: 1, unit: 'Lv' },
    { key: 'waterRecyclerLevel', label: 'Water Recycling Unit', min: 0, max: 5, step: 1, unit: 'Lv' },
    { key: 'radiationShieldLevel', label: 'Radiation Shielding', min: 0, max: 4, step: 1, unit: 'Lv' },
  ];

  const riskBadgeClass = (risk: string) =>
    risk === 'Low'
      ? 'text-emerald-700'
      : risk === 'Moderate'
      ? 'text-amber-700'
      : 'text-rose-700';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-mono uppercase tracking-wider text-sky-700 font-semibold">
          Systems Engineering Experiment · What-If Lab
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
          Test Outpost Trade-Offs Side by Side
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Modify crew size, mission length, solar generation, recycling, and shielding to see how coupled engineering
          decisions change stability and survival bottlenecks.
        </p>
      </div>

      {/* Global Planet & Duration Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {(['moon', 'mars'] as const).map((dest) => (
              <button
                key={dest}
                type="button"
                onClick={() => {
                  setBaseline((b) => ({ ...b, destination: dest }));
                  setModified((m) => ({ ...m, destination: dest }));
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  modified.destination === dest ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {dest === 'moon' ? 'Moon Environment' : 'Mars Environment'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {([10, 30, 60] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setBaseline((b) => ({ ...b, durationDays: d }));
                  setModified((m) => ({ ...m, durationDays: d }));
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  modified.durationDays === d ? 'bg-sky-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {d} Days
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setBaseline(DEFAULT_BASELINE);
            setModified(DEFAULT_MODIFIED);
          }}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline cursor-pointer"
        >
          Reset Experiment Defaults
        </button>
      </div>

      {/* Controls + Side-by-Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sliders Column */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-sky-700" />
            <h2 className="font-display text-lg font-bold text-slate-900">Modified Scenario Controls</h2>
          </div>

          <div className="space-y-4">
            {sliderConfigs.map((cfg) => {
              const val = Number(modified[cfg.key]);
              const baseVal = Number(baseline[cfg.key]);
              return (
                <div key={cfg.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor={`slider-${cfg.key}`} className="font-semibold text-slate-800">
                      {cfg.label}
                    </label>
                    <span className="font-mono tabular-nums text-slate-600">
                      Baseline: {baseVal} → <strong className="text-sky-700">{val} {cfg.unit}</strong>
                    </span>
                  </div>
                  <input
                    id={`slider-${cfg.key}`}
                    type="range"
                    min={cfg.min}
                    max={cfg.max}
                    step={cfg.step}
                    value={val}
                    onChange={(e) =>
                      setModified((prev) => ({ ...prev, [cfg.key]: Number(e.target.value) }))
                    }
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-2">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-500">
              Calculated Engineering Trade-Offs
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
              {comparison.tradeOffs.map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Comparison Results & Dual Chart */}
        <div className="lg:col-span-7 space-y-6">
          {/* Two Scenario Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[comparison.baseline, comparison.modified].map((scen, idx) => (
              <div
                key={scen.label}
                className={`rounded-2xl p-5 border space-y-3 ${
                  idx === 1 ? 'bg-slate-950 text-white border-slate-800' : 'bg-white text-slate-900 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold">{scen.label}</h3>
                  <span className={`text-xs font-mono font-semibold ${riskBadgeClass(scen.survivalRisk)}`}>
                    {scen.survivalRisk} Risk
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono tabular-nums">
                  <div>
                    <span className={idx === 1 ? 'text-slate-400 block' : 'text-slate-500 block'}>Final Stability</span>
                    <span className="text-lg font-bold">{scen.finalStability}%</span>
                  </div>
                  <div>
                    <span className={idx === 1 ? 'text-slate-400 block' : 'text-slate-500 block'}>Crew Health</span>
                    <span className="text-lg font-bold">{scen.finalCrewHealth}%</span>
                  </div>
                  <div>
                    <span className={idx === 1 ? 'text-slate-400 block' : 'text-slate-500 block'}>Energy Net/d</span>
                    <span>
                      {scen.energyBalanceDailyKwh >= 0 ? '+' : ''}
                      {scen.energyBalanceDailyKwh} kWh
                    </span>
                  </div>
                  <div>
                    <span className={idx === 1 ? 'text-slate-400 block' : 'text-slate-500 block'}>Water Net/d</span>
                    <span>
                      {scen.waterBalanceDailyL >= 0 ? '+' : ''}
                      {scen.waterBalanceDailyL} L
                    </span>
                  </div>
                </div>

                <p className={`text-xs pt-2 border-t ${idx === 1 ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-600'}`}>
                  <strong>Limiting Bottleneck:</strong> {scen.bottleneck}
                </p>
              </div>
            ))}
          </div>

          {/* Dual-Scenario Projection Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900">
                  Projected Trajectory Comparison
                </h3>
                <p className="text-xs text-slate-500">
                  Solid line: Modified Scenario · Dashed line: Baseline Scenario
                </p>
              </div>

              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                {(
                  [
                    { id: 'stabilityScore', label: 'Stability %' },
                    { id: 'energy', label: 'Energy (kWh)' },
                    { id: 'water', label: 'Water (L)' },
                    { id: 'food', label: 'Food' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setChartMetric(m.id)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer ${
                      chartMetric === m.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={combinedChartData} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} tickFormatter={(d) => `D${d}`} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line
                    type="monotone"
                    dataKey="baselineVal"
                    name="Baseline Scenario"
                    stroke="#64748b"
                    strokeDasharray="5 4"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="modifiedVal"
                    name="Modified Scenario"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
