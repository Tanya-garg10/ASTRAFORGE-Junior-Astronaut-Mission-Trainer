import React from 'react';
import { ExternalLink } from 'lucide-react';
import { CURATED_NASA_FALLBACK_MEDIA, NASA_OFFICIAL_REFERENCES } from '../shared/nasaData.ts';
import { SIMULATION_COEFFICIENTS } from '../shared/simulation.ts';

export const SourcesPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-mono uppercase tracking-wider text-sky-700 font-semibold">
          Transparency · Attribution · Scientific Grounding
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
          Data, Media Sources & Simulation Assumptions
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          ASTRAFORGE separates verified NASA planetary facts and multimedia archives from the illustrative educational
          coefficients used inside the mission simulator.
        </p>
      </div>

      {/* Required Independent Disclaimer */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 space-y-2">
        <h2 className="font-display text-lg font-bold text-white">Independent Project Disclaimer</h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          ASTRAFORGE is an independent educational project created for the NASA Space Apps Challenge. It is not an
          official NASA product and is not endorsed by NASA. NASA resources are credited to their respective sources.
        </p>
      </div>

      {/* Official NASA References */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h2 className="font-display text-xl font-bold text-slate-900">Official NASA Educational & API Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {NASA_OFFICIAL_REFERENCES.map((ref) => (
            <a
              key={ref.url}
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-slate-200 rounded-xl p-4 hover:border-sky-400 transition-colors block"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-900">{ref.title}</span>
                <ExternalLink className="w-3.5 h-3.5 text-sky-700 shrink-0" />
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ref.description}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Illustrative Simulation Assumptions */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h2 className="font-display text-xl font-bold text-slate-900">
          Documented Illustrative Simulation Coefficients
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          The numbers below govern gameplay balance and systems-thinking feedback inside ASTRAFORGE. They are simplified
          educational approximations—not certified aerospace engineering specifications.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-mono uppercase text-slate-500">
                <th className="py-2.5 px-3">Parameter</th>
                <th className="py-2.5 px-3">Illustrative Value</th>
                <th className="py-2.5 px-3">Educational Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-slate-900">Crew O₂ Demand</td>
                <td className="py-2.5 px-3">{SIMULATION_COEFFICIENTS.oxygenKgPerPersonPerDay} kg / person / day</td>
                <td className="py-2.5 px-3 font-sans text-slate-600">Standard human metabolic oxygen consumption reference.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-slate-900">Crew Water Demand</td>
                <td className="py-2.5 px-3">{SIMULATION_COEFFICIENTS.waterLitersPerPersonPerDay} L / person / day</td>
                <td className="py-2.5 px-3 font-sans text-slate-600">Drinking, food rehydration, and hygiene baseline before recycling.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-slate-900">Electrolysis Water Ratio</td>
                <td className="py-2.5 px-3">{SIMULATION_COEFFICIENTS.oxygenGenWaterCostPerKgO2} L H₂O / kg O₂</td>
                <td className="py-2.5 px-3 font-sans text-slate-600">Couples oxygen generation directly to water reserves.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-slate-900">Solar Base Output</td>
                <td className="py-2.5 px-3">
                  {SIMULATION_COEFFICIENTS.moonSolarKwhPerLevelBase} kWh (Moon) · {SIMULATION_COEFFICIENTS.marsSolarKwhPerLevelBase} kWh (Mars)
                </td>
                <td className="py-2.5 px-3 font-sans text-slate-600">Reflects Mars receiving ~43% of Earth/Moon solar irradiance at ~1.52 AU.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-slate-900">Water Recovery Curve</td>
                <td className="py-2.5 px-3">72% (Lv1) → 95% (Lv5)</td>
                <td className="py-2.5 px-3 font-sans text-slate-600">Demonstrates ISS-inspired closed-loop distillation gains vs. power cost.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Media Asset Attribution Log */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h2 className="font-display text-xl font-bold text-slate-900">Curated NASA Media Records</h2>
        <div className="space-y-3">
          {CURATED_NASA_FALLBACK_MEDIA.map((item) => (
            <div key={item.nasaId} className="border border-slate-200 rounded-xl p-4 text-xs space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-slate-900">{item.title}</span>
                <span className="font-mono text-sky-700">{item.nasaId} · {item.mediaType.toUpperCase()}</span>
              </div>
              <p className="text-slate-600">Credit: {item.credit}</p>
              <p className="text-slate-500">{item.restrictionsNote}</p>
              <a
                href={item.nasaPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sky-700 font-medium hover:underline"
              >
                {item.nasaPageUrl} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
