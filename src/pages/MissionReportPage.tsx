import React, { useMemo } from 'react';
import { MissionReportCard } from '../components/MissionReportCard.tsx';
import { generateMissionReport } from '../shared/simulation.ts';
import { MissionState } from '../shared/types.ts';

interface MissionReportPageProps {
  mission: MissionState | null;
  onRestart: () => void;
  onExploreScience: () => void;
  onBackToControl: () => void;
}

export const MissionReportPage: React.FC<MissionReportPageProps> = ({
  mission,
  onRestart,
  onExploreScience,
  onBackToControl,
}) => {
  const report = useMemo(() => {
    if (!mission) return null;
    return generateMissionReport(mission);
  }, [mission]);

  if (!mission || !report) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <h1 className="font-display text-3xl font-bold text-slate-900">No Mission Report Available</h1>
        <p className="text-sm text-slate-600">Launch and run a Moon or Mars mission to generate an evaluation report.</p>
        <button
          type="button"
          onClick={onRestart}
          className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-slate-900 text-white cursor-pointer"
        >
          Start a Mission
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-sky-700 font-semibold">
            Post-Mission Debrief & Engineering Evaluation
          </p>
          <h1 className="font-display text-3xl font-bold text-slate-900">Mission Report</h1>
        </div>
        {mission.status === 'active' && (
          <button
            type="button"
            onClick={onBackToControl}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Return to Mission Control
          </button>
        )}
      </div>

      <MissionReportCard
        report={report}
        onRestart={onRestart}
        onExploreScience={onExploreScience}
      />
    </div>
  );
};
