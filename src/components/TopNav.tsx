import React from 'react';

export type AppView =
  | 'landing'
  | 'briefing'
  | 'mission'
  | 'what-if'
  | 'science'
  | 'report'
  | 'sources';

interface TopNavProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  hasActiveMission: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({ activeView, onNavigate, hasActiveMission }) => {
  const navItems: Array<{ id: AppView; label: string }> = [
    { id: 'landing', label: 'Overview' },
    { id: 'mission', label: 'Mission Control' },
    { id: 'what-if', label: 'What-If Lab' },
    { id: 'science', label: 'Space Science' },
    { id: 'sources', label: 'Sources' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('landing')}
          className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600 cursor-pointer"
        >
          ASTRAFORGE
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-sky-600 text-slate-900'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => onNavigate(hasActiveMission && activeView !== 'briefing' ? 'briefing' : 'briefing')}
            className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {hasActiveMission ? 'New Mission' : 'Start Mission'}
          </button>
        </div>
      </div>

      {/* Mobile compact navigation */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden flex items-center gap-4 px-4 py-2 border-t border-slate-100 overflow-x-auto"
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`text-xs font-medium whitespace-nowrap shrink-0 py-1 ${
              activeView === item.id ? 'text-sky-700 underline underline-offset-4' : 'text-slate-600'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
};
