import React from 'react';
import { Award, CheckCircle2, RotateCcw, Wrench } from 'lucide-react';
import { MissionReport } from '../shared/types.ts';

interface MissionReportCardProps {
  report: MissionReport;
  onRestart: () => void;
  onExploreScience: () => void;
}

export const MissionReportCard: React.FC<MissionReportCardProps> = ({
  report,
  onRestart,
  onExploreScience,
}) => {
  const outcomeColor =
    report.outcome === 'Mission Accomplished'
      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
      : report.outcome === 'Mission Accomplished with Challenges'
      ? 'text-sky-700 bg-sky-50 border-sky-200'
      : report.outcome === 'Mission Requires Improvement'
      ? 'text-amber-700 bg-amber-50 border-amber-200'
      : 'text-rose-700 bg-rose-50 border-rose-200';

  const heroImage =
    report.destination === 'moon'
      ? '/src/assets/images/hero_lunar_outpost_1794761660112.jpg'
      : '/src/assets/images/mars_outpost_horizon_1794761660330.jpg';

  return (
    <div className="space-y-6">
      {/* Header Summary Card */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500">
            <span>{report.destination === 'moon' ? 'Moon South Pole' : 'Mars Jezero Crater'}</span>
            <span>·</span>
            <span>{report.crewSize} Astronauts</span>
            <span>·</span>
            <span>
              Day {report.daysSurvived} / {report.durationDays}
            </span>
          </div>

          <div className={`inline-block px-3 py-1 rounded-md border text-xs font-semibold ${outcomeColor}`}>
            {report.outcome}
          </div>

          <h2 className="font-display text-3xl font-bold text-slate-900">
            Final Mission Score: <span className="font-mono tabular-nums text-sky-700">{report.missionScore}/100</span>
          </h2>

          <p className="text-sm text-slate-700 leading-relaxed max-w-2xl">{report.outcomeExplanation}</p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-slate-900 hover:bg-sky-700 text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Restart Mission
            </button>
            <button
              type="button"
              onClick={onExploreScience}
              className="px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Review Space Science Modules
            </button>
          </div>
        </div>

        <div className="min-h-56 bg-slate-900">
          <img
            src={heroImage}
            alt={`${report.destination} outpost mission report visual`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Final Resource Status */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h3 className="font-display text-lg font-bold text-slate-900">Final Survival System Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {report.finalMetrics.map((m) => (
            <div key={m.id} className="border border-slate-200 rounded-xl p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{m.label}</span>
                <span
                  className={`text-xs font-mono font-semibold ${
                    m.status === 'Nominal'
                      ? 'text-emerald-700'
                      : m.status === 'Caution'
                      ? 'text-amber-700'
                      : 'text-rose-700'
                  }`}
                >
                  {m.status}
                </span>
              </div>
              <p className="text-xl font-mono font-bold tabular-nums text-slate-900">
                {m.current} <span className="text-xs font-normal text-slate-500">{m.unit}</span>
              </p>
              <p className="text-xs text-slate-600">{m.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
          <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-sky-600" />
            Learning Achievements
          </h3>
          <ul className="space-y-2">
            {report.learningAchievements.map((ach, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>{ach}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
          <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-600" />
            Engineering Recommendations
          </h3>
          <ul className="space-y-2 list-disc list-inside text-sm text-slate-700">
            {report.recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Events & Decisions Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
          <h3 className="font-display text-lg font-bold text-slate-900">Major Events Faced</h3>
          {report.majorEvents.length === 0 ? (
            <p className="text-sm text-slate-500">No major anomaly events occurred during this run.</p>
          ) : (
            <div className="space-y-3">
              {report.majorEvents.map((evt) => (
                <div key={evt.id} className="border border-slate-200 rounded-lg p-3 space-y-1">
                  <p className="text-xs font-mono text-slate-500">
                    Day {evt.triggeredDay} · {evt.severity}
                  </p>
                  <p className="text-sm font-semibold text-slate-900">{evt.title}</p>
                  <p className="text-xs text-slate-600">{evt.outcomeExplanation}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
          <h3 className="font-display text-lg font-bold text-slate-900">Commander Decision Log</h3>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {report.decisions.map((dec, idx) => (
              <div key={idx} className="border-b border-slate-100 pb-2 text-xs">
                <span className="font-mono text-slate-500">Day {dec.day} · </span>
                <span className="font-semibold text-slate-900">{dec.title}</span>
                <p className="text-slate-600 mt-0.5">{dec.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
