import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppView, TopNav } from './components/TopNav.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { MissionBriefingPage } from './pages/MissionBriefingPage.tsx';
import { MissionControlPage } from './pages/MissionControlPage.tsx';
import { MissionReportPage } from './pages/MissionReportPage.tsx';
import { SourcesPage } from './pages/SourcesPage.tsx';
import { SpaceSciencePage } from './pages/SpaceSciencePage.tsx';
import { WhatIfLabPage } from './pages/WhatIfLabPage.tsx';
import { MissionConfig, MissionState, ModuleId } from './shared/types.ts';

const SAVED_MISSION_ID_KEY = 'astraforge_active_mission_id';

export function App() {
  const [activeView, setActiveView] = useState<AppView>('landing');
  const [mission, setMission] = useState<MissionState | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Restore saved mission on page load if available in SQLite
  useEffect(() => {
    const savedId = localStorage.getItem(SAVED_MISSION_ID_KEY);
    if (!savedId) return;
    fetch(`/api/mission/${encodeURIComponent(savedId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: MissionState | null) => {
        if (data?.id) setMission(data);
      })
      .catch(() => {});
  }, []);

  const handleLaunchMission = async (config: MissionConfig) => {
    setIsBusy(true);
    setErrorBanner(null);
    setIsAutoPlaying(false);
    try {
      const res = await fetch('/api/mission/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to launch mission');
      setMission(data);
      localStorage.setItem(SAVED_MISSION_ID_KEY, data.id);
      setActiveView('mission');
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : 'Unable to start mission');
    } finally {
      setIsBusy(false);
    }
  };

  const handleAdvanceDays = useCallback(
    async (days: number) => {
      if (!mission || mission.status !== 'active' || isBusy) return;
      setIsBusy(true);
      setErrorBanner(null);
      try {
        const res = await fetch(`/api/mission/${encodeURIComponent(mission.id)}/advance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ days }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to advance simulation');
        setMission(data);
        if (data.status !== 'active') {
          setIsAutoPlaying(false);
          setActiveView('report');
        } else if (data.activeEvent) {
          setIsAutoPlaying(false);
        }
      } catch (err) {
        setErrorBanner(err instanceof Error ? err.message : 'Simulation step failed');
        setIsAutoPlaying(false);
      } finally {
        setIsBusy(false);
      }
    },
    [mission, isBusy]
  );

  // Auto-advance timer when user toggles Resume
  useEffect(() => {
    if (!isAutoPlaying || !mission || mission.status !== 'active' || mission.activeEvent) {
      return;
    }
    const timer = window.setInterval(() => {
      handleAdvanceDays(1);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [isAutoPlaying, mission, handleAdvanceDays]);

  const handleBuildModule = async (moduleId: ModuleId) => {
    if (!mission || isBusy) return;
    setIsBusy(true);
    setErrorBanner(null);
    try {
      const res = await fetch(`/api/mission/${encodeURIComponent(mission.id)}/build`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Construction failed');
      setMission(data);
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : 'Construction error');
    } finally {
      setIsBusy(false);
    }
  };

  const handleRespondEvent = async (eventId: string, choiceId: string) => {
    if (!mission || isBusy) return;
    setIsBusy(true);
    setErrorBanner(null);
    try {
      const res = await fetch(`/api/mission/${encodeURIComponent(mission.id)}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, choiceId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Response failed');
      setMission(data);
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : 'Emergency response error');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopNav
        activeView={activeView}
        onNavigate={setActiveView}
        hasActiveMission={Boolean(mission)}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
          >
            {activeView === 'landing' && (
              <LandingPage
                onNavigate={setActiveView}
                hasSavedMission={Boolean(mission && mission.status === 'active')}
              />
            )}

            {activeView === 'briefing' && (
              <MissionBriefingPage
                onLaunchMission={handleLaunchMission}
                isLaunching={isBusy}
              />
            )}

            {activeView === 'mission' && (
              <MissionControlPage
                mission={mission}
                isAutoPlaying={isAutoPlaying}
                isBusy={isBusy}
                errorBanner={errorBanner}
                onToggleAutoPlay={() => setIsAutoPlaying((p) => !p)}
                onAdvanceDays={handleAdvanceDays}
                onBuildModule={handleBuildModule}
                onRespondEvent={handleRespondEvent}
                onStartBriefing={() => setActiveView('briefing')}
                onViewReport={() => setActiveView('report')}
              />
            )}

            {activeView === 'what-if' && <WhatIfLabPage />}

            {activeView === 'science' && <SpaceSciencePage />}

            {activeView === 'report' && (
              <MissionReportPage
                mission={mission}
                onRestart={() => setActiveView('briefing')}
                onExploreScience={() => setActiveView('science')}
                onBackToControl={() => setActiveView('mission')}
              />
            )}

            {activeView === 'sources' && <SourcesPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-slate-600">
          <div className="space-y-1 max-w-2xl">
            <p className="font-semibold text-slate-900">
              ASTRAFORGE — Junior Astronaut Mission Trainer · NASA Space Apps Challenge 2026
            </p>
            <p>
              ASTRAFORGE is an independent educational project created for the NASA Space Apps Challenge. It is not an
              official NASA product and is not endorsed by NASA. NASA resources are credited to their respective sources.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0 font-medium">
            <button type="button" onClick={() => setActiveView('sources')} className="hover:text-sky-700 cursor-pointer">
              Data & Media Sources
            </button>
            <button type="button" onClick={() => setActiveView('science')} className="hover:text-sky-700 cursor-pointer">
              NASA Media Library
            </button>
            <button type="button" onClick={() => setActiveView('what-if')} className="hover:text-sky-700 cursor-pointer">
              What-If Lab
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
