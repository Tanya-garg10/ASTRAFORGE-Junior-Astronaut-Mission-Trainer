import React, { useState } from 'react';
import { AlertTriangle, Building2, Gauge, ShieldAlert } from 'lucide-react';
import { ConstructionCard, OutpostGridVisual } from '../components/ConstructionCard.tsx';
import { EventAlert } from '../components/EventAlert.tsx';
import { MentorPanel } from '../components/MentorPanel.tsx';
import { MissionStatus } from '../components/MissionStatus.tsx';
import { ResourceCard } from '../components/ResourceCard.tsx';
import { ResourceTrendChart } from '../components/ResourceTrendChart.tsx';
import { OUTPOST_MODULES } from '../shared/simulation.ts';
import { MissionState, ModuleId } from '../shared/types.ts';

interface MissionControlPageProps {
  mission: MissionState | null;
  isAutoPlaying: boolean;
  isBusy: boolean;
  errorBanner: string | null;
  onToggleAutoPlay: () => void;
  onAdvanceDays: (days: number) => void;
  onBuildModule: (moduleId: ModuleId) => void;
  onRespondEvent: (eventId: string, choiceId: string) => void;
  onStartBriefing: () => void;
  onViewReport: () => void;
}

export const MissionControlPage: React.FC<MissionControlPageProps> = ({
  mission,
  isAutoPlaying,
  isBusy,
  errorBanner,
  onToggleAutoPlay,
  onAdvanceDays,
  onBuildModule,
  onRespondEvent,
  onStartBriefing,
  onViewReport,
}) => {
  const [activeTab, setActiveTab] = useState<'systems' | 'outpost' | 'emergency'>('systems');
  const [selectedModuleId, setSelectedModuleId] = useState<ModuleId>('habitat');

  if (!mission) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <h1 className="font-display text-3xl font-bold text-slate-900">No Active Mission Loaded</h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Configure your destination, crew size, and engineering budget in Mission Briefing to launch an active
          outpost simulation.
        </p>
        <button
          type="button"
          onClick={onStartBriefing}
          className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-sky-600 hover:bg-sky-700 text-white cursor-pointer"
        >
          Go to Mission Briefing
        </button>
      </div>
    );
  }

  const moduleIds = Object.keys(OUTPOST_MODULES) as ModuleId[];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Top Telemetry Ribbon */}
        <MissionStatus
          mission={mission}
          isAutoPlaying={isAutoPlaying}
          isAdvancing={isBusy}
          onToggleAutoPlay={onToggleAutoPlay}
          onAdvanceDays={onAdvanceDays}
          onViewReport={onViewReport}
        />

        {/* Error / Active Emergency Banner */}
        {errorBanner && (
          <div className="bg-rose-950/70 border border-rose-500/40 rounded-xl px-4 py-3 text-xs text-rose-200">
            {errorBanner}
          </div>
        )}

        {mission.activeEvent && activeTab !== 'emergency' && (
          <div className="bg-amber-950/60 border border-amber-500/50 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Active Emergency: {mission.activeEvent.title}
                </p>
                <p className="text-xs text-amber-200">
                  {mission.activeEvent.severity} · {mission.activeEvent.daysRemainingToRespond} day(s) remaining to respond
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('emergency')}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer"
            >
              Open Emergency Room
            </button>
          </div>
        )}

        {/* Workspace Tab Selector */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('systems')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'systems' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              Survival Systems
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('outpost')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'outpost' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Outpost Builder
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('emergency')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'emergency'
                  ? 'bg-amber-500 text-slate-950'
                  : mission.activeEvent
                  ? 'text-amber-300 hover:text-amber-200'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Emergency Room {mission.activeEvent ? '(1)' : ''}
            </button>
          </div>

          <p className="text-xs font-mono text-slate-400">
            Seed #{mission.config.seed} · {mission.config.difficulty} · Illustrative educational model
          </p>
        </div>

        {/* Main Asymmetric Split: Left Simulation Stage + Right AI Mentor */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-8 space-y-6">
            {activeTab === 'systems' && (
              <>
                {mission.alerts.length > 0 && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1.5">
                    <p className="text-xs font-mono uppercase text-amber-400">Active Telemetry Alerts</p>
                    {mission.alerts.map((al, i) => (
                      <p key={i} className="text-xs text-slate-200">
                        • {al}
                      </p>
                    ))}
                  </div>
                )}

                {/* 6 Interconnected Survival Systems */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mission.metrics.map((metric) => (
                    <ResourceCard key={metric.id} metric={metric} />
                  ))}
                </div>

                {/* Live Simulation History Chart */}
                <ResourceTrendChart history={mission.history} />

                {/* Recent Decision Ledger */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-white">Mission Decision & Event Log</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {[...mission.decisions].reverse().map((dec, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-slate-800 pb-2 text-xs">
                        <div>
                          <span className="font-mono text-sky-400 mr-2">Day {dec.day}</span>
                          <span className="font-semibold text-slate-100">{dec.title}</span>
                          <span className="text-slate-400 ml-2">{dec.detail}</span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-400 shrink-0">{dec.impact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'outpost' && (
              <div className="space-y-6">
                <OutpostGridVisual
                  destination={mission.config.destination}
                  modules={mission.modules}
                  selectedModuleId={selectedModuleId}
                  onSelectModule={setSelectedModuleId}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {moduleIds.map((id) => (
                    <ConstructionCard
                      key={id}
                      definition={OUTPOST_MODULES[id]}
                      installed={mission.modules[id]}
                      buildCredits={mission.buildCredits}
                      isSelected={selectedModuleId === id}
                      isBusy={isBusy}
                      missionActive={mission.status === 'active'}
                      onSelect={setSelectedModuleId}
                      onBuildOrUpgrade={onBuildModule}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'emergency' && (
              <div className="space-y-6">
                <EventAlert
                  event={mission.activeEvent}
                  buildCredits={mission.buildCredits}
                  isSubmitting={isBusy}
                  onRespond={onRespondEvent}
                />

                {mission.eventLog.length > 0 && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                    <h3 className="text-sm font-semibold text-white">Resolved Anomaly History</h3>
                    <div className="space-y-2.5">
                      {[...mission.eventLog].reverse().map((evt) => (
                        <div key={evt.id} className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white">{evt.title}</span>
                            <span className="font-mono text-slate-400">Day {evt.triggeredDay}</span>
                          </div>
                          <p className="text-slate-300">{evt.outcomeExplanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: AI Mission Mentor */}
          <div className="xl:col-span-4 xl:sticky xl:top-20">
            <MentorPanel mission={mission} />
          </div>
        </div>
      </div>
    </div>
  );
};
