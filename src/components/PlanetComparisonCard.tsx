import React from 'react';
import { ExternalLink } from 'lucide-react';
import { PLANETARY_COMPARISON } from '../shared/nasaData.ts';

export const PlanetComparisonCard: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900">
            Moon vs. Mars Environmental Comparison
          </h3>
          <p className="text-xs text-slate-600">
            Grounded in official NASA planetary reference facts—explaining why outpost designs differ.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <a
            href="https://science.nasa.gov/moon/facts/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sky-700 hover:underline"
          >
            NASA Moon Facts <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://science.nasa.gov/mars/facts/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sky-700 hover:underline"
          >
            NASA Mars Facts <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-mono uppercase text-slate-500">
              <th className="py-3 px-4">Parameter</th>
              <th className="py-3 px-4">Moon</th>
              <th className="py-3 px-4">Mars</th>
              <th className="py-3 px-4">Outpost Engineering Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {PLANETARY_COMPARISON.map((row) => (
              <tr key={row.parameter} className="align-top">
                <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                  {row.parameter}
                </td>
                <td className="py-3.5 px-4 text-slate-700 text-xs leading-relaxed">{row.moon}</td>
                <td className="py-3.5 px-4 text-slate-700 text-xs leading-relaxed">{row.mars}</td>
                <td className="py-3.5 px-4 text-slate-600 text-xs leading-relaxed">
                  <p>{row.engineeringImpact}</p>
                  <a
                    href={row.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-1 text-[11px] font-mono text-sky-700 hover:underline"
                  >
                    {row.sourceLabel} <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
