import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { MissionEvent } from '../shared/types.ts';

interface EventAlertProps {
  event: MissionEvent | null;
  buildCredits: number;
  isSubmitting: boolean;
  onRespond: (eventId: string, choiceId: string) => void;
}

export const EventAlert: React.FC<EventAlertProps> = ({
  event,
  buildCredits,
  isSubmitting,
  onRespond,
}) => {
  if (!event) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
        <p className="text-sm font-medium text-slate-200">Emergency Room Clear</p>
        <p className="mt-1 text-xs text-slate-400">
          No active anomalies require immediate intervention. Advance mission days to monitor dynamic planetary events.
        </p>
      </div>
    );
  }

  const severityColor =
    event.severity === 'Severe'
      ? 'text-rose-400'
      : event.severity === 'High'
      ? 'text-amber-400'
      : 'text-sky-400';

  return (
    <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-5 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono">
            <ShieldAlert className={`w-4 h-4 ${severityColor}`} />
            <span className={severityColor}>{event.severity} Emergency</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">
              {event.daysRemainingToRespond} day(s) to respond
            </span>
          </div>
          <h3 className="font-display text-xl font-bold text-white">{event.title}</h3>
        </div>

        <div className="text-right text-xs font-mono text-slate-400">
          <span>Triggered Day {event.triggeredDay}</span>
          <span className="block text-amber-300">Available Budget: {buildCredits} SU</span>
        </div>
      </div>

      <p className="text-sm text-slate-200 leading-relaxed">{event.description}</p>

      <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 space-y-1.5">
        <p className="text-xs font-medium text-sky-300">
          Affected Systems: {event.affectedSystems.join(' · ')}
        </p>
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong className="text-slate-200">Scientific Context:</strong> {event.scientificContext}
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Select Commander Response
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {event.choices.map((choice) => {
            const canAfford = buildCredits >= choice.buildCreditCost;
            return (
              <div
                key={choice.id}
                className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col justify-between gap-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-white">{choice.label}</h4>
                    <span className="text-xs font-mono text-amber-400 shrink-0">
                      {choice.buildCreditCost > 0 ? `${choice.buildCreditCost} SU` : '0 SU'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{choice.summary}</p>
                  <p className="text-xs text-slate-400">
                    <span className="text-slate-300 font-medium">Why it works:</span> {choice.scienceReasoning}
                  </p>
                  <p className="text-xs font-mono text-sky-300 pt-1">{choice.effectsDescription}</p>
                </div>

                <button
                  type="button"
                  disabled={!canAfford || isSubmitting}
                  onClick={() => onRespond(event.id, choice.id)}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 text-white transition-colors cursor-pointer"
                >
                  {canAfford ? 'Execute Response' : `Needs ${choice.buildCreditCost} SU`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
        <AlertTriangle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        Simulated scenario event for educational decision training (not a live NASA alert).
      </p>
    </div>
  );
};
