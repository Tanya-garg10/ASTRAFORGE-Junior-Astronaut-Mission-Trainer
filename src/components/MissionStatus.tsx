import React from 'react';
import { FastForward, FileText, Pause, Play, SkipForward } from 'lucide-react';
import { MissionState } from '../shared/types.ts';

interface MissionStatusProps {
  mission: MissionState;
  isAutoPlaying: boolean;
  isAdvancing: boolean;
  onToggleAutoPlay: () => void;
  onAdvanceDays: (days: number) => void;
  onViewReport: () => void;
}

export const MissionStatus: React.FC<MissionStatusProps> = ({
  mission,
  isAutoPlaying,
  isAdvancing,
  onToggleAutoPlay,
  onAdvanceDays,
  onViewReport,
}) => {
  const progressPct = Math.min(100, Math.round((mission.currentDay / mission.config.durationDays) * 100));
  const destLabel = mission.config.destination === 'moon' ? 'Moon · South Pole' : 'Mars · Jezero Region';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Core Mission Telemetry */}
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-xs text-slate-400">{destLabel} · {mission.config.crewSize} Astronauts</p>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-white tabular-nums">
                Day {mission.currentDay}
              </span>
              <span className="text-xs font-mono text-slate-400">
                of {mission.config.durationDays} ({progressPct}%)
              </span>
            </div>
          </div>

          <div className="h-9 w-px bg-slate-800 hidden sm:block" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <span className="block text-[11px] uppercase tracking-wider text-slate-400">Crew Health</span>
              <span
                className={`text-lg font-mono font-semibold tabular-nums ${
                  mission.crewHealth >= 75
                    ? 'text-emerald-400'
                    : mission.crewHealth >= 45
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {mission.crewHealth}%
              </span>
            </div>
            <div>
              <span className="block text-[11px] uppercase tracking-wider text-slate-400">Outpost</span>
              <span className="text-lg font-mono font-semibold tabular-nums text-slate-100">
                {mission.outpostCondition}%
              </span>
            </div>
            <div>
              <span className="block text-[11px] uppercase tracking-wider text-slate-400">Stability</span>
              <span className="text-lg font-mono font-semibold tabular-nums text-sky-400">
                {mission.stabilityScore}%
              </span>
            </div>
            <div>
              <span className="block text-[11px] uppercase tracking-wider text-slate-400">Build Budget</span>
              <span className="text-lg font-mono font-semibold tabular-nums text-amber-400">
                {mission.buildCredits} SU
              </span>
            </div>
          </div>
        </div>

        {/* Right: Time Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {mission.status === 'active' ? (
            <>
              <button
                type="button"
                onClick={onToggleAutoPlay}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                  isAutoPlaying
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                    : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                }`}
              >
                {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isAutoPlaying ? 'Pause' : 'Resume'}
              </button>

              <button
                type="button"
                disabled={isAdvancing}
                onClick={() => onAdvanceDays(1)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white transition-colors whitespace-nowrap cursor-pointer"
              >
                <SkipForward className="w-3.5 h-3.5" />
                Advance 1 Day
              </button>

              <button
                type="button"
                disabled={isAdvancing}
                onClick={() => onAdvanceDays(3)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-50 text-slate-200 transition-colors whitespace-nowrap cursor-pointer"
              >
                <FastForward className="w-3.5 h-3.5" />
                +3 Days
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onViewReport}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors whitespace-nowrap cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              View Mission Report
            </button>
          )}
        </div>
      </div>

      {/* Mission Progress Bar */}
      <div className="mt-4 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-sky-500 transition-all duration-300" style={{ width: `${progressPct}%` }} />
      </div>
    </div>
  );
};
