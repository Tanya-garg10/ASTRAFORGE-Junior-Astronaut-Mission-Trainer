import React, { useState } from 'react';
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
import { DailyHistoryPoint } from '../shared/types.ts';

interface ResourceTrendChartProps {
  history: DailyHistoryPoint[];
}

export const ResourceTrendChart: React.FC<ResourceTrendChartProps> = ({ history }) => {
  const [chartMode, setChartMode] = useState<'consumables' | 'power' | 'health'>('consumables');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-semibold text-white">Simulation Telemetry History</h3>
          <p className="text-xs text-slate-400">
            Real-time deterministic resource curves recorded across each mission day.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => setChartMode('consumables')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              chartMode === 'consumables' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            O₂ / Water / Food
          </button>
          <button
            type="button"
            onClick={() => setChartMode('power')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              chartMode === 'power' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Energy Balance
          </button>
          <button
            type="button"
            onClick={() => setChartMode('health')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              chartMode === 'health' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Crew & Stability
          </button>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === 'consumables' ? (
            <LineChart data={history} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(d) => `D${d}`} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="oxygen" name="Oxygen (kg)" stroke="#38bdf8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="water" name="Water (L)" stroke="#22d3ee" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="food" name="Food (rations)" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          ) : chartMode === 'power' ? (
            <LineChart data={history} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(d) => `D${d}`} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="energy" name="Battery Reserve (kWh)" stroke="#38bdf8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="solarGenerationKwh" name="Solar Gen (kWh/d)" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="energyDemandKwh" name="Demand (kWh/d)" stroke="#f97316" strokeDasharray="4 3" strokeWidth={2} dot={false} />
            </LineChart>
          ) : (
            <LineChart data={history} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(d) => `D${d}`} />
              <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="stabilityScore" name="Stability (%)" stroke="#38bdf8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="crewHealth" name="Crew Health (%)" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="radiationProtection" name="Shielding (%)" stroke="#a78bfa" strokeWidth={2} dot={false} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
