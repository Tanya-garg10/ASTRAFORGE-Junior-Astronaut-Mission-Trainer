import React from 'react';
import { ArrowUpCircle, PlusCircle } from 'lucide-react';
import { OUTPOST_MODULES, getModuleBuildCost } from '../shared/simulation.ts';
import { Destination, InstalledModule, ModuleId, OutpostModuleDefinition } from '../shared/types.ts';

interface ConstructionCardProps {
  definition: OutpostModuleDefinition;
  installed: InstalledModule;
  buildCredits: number;
  isSelected: boolean;
  isBusy: boolean;
  missionActive: boolean;
  onSelect: (id: ModuleId) => void;
  onBuildOrUpgrade: (id: ModuleId) => void;
}

export const ConstructionCard: React.FC<ConstructionCardProps> = ({
  definition,
  installed,
  buildCredits,
  isSelected,
  isBusy,
  missionActive,
  onSelect,
  onBuildOrUpgrade,
}) => {
  const isMaxed = installed.level >= definition.maxLevel;
  const cost = getModuleBuildCost(definition.id, installed.level);
  const canAfford = buildCredits >= cost;

  return (
    <div
      onClick={() => onSelect(definition.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(definition.id);
        }
      }}
      className={`text-left rounded-xl p-4 border transition-colors cursor-pointer flex flex-col justify-between gap-3 ${
        isSelected
          ? 'bg-slate-800/90 border-sky-500'
          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              {definition.category} · Lv {installed.level}/{definition.maxLevel}
            </p>
            <h4 className="text-sm font-semibold text-white">{definition.name}</h4>
          </div>
          {installed.damaged && (
            <span className="text-[11px] font-mono text-amber-400 shrink-0">Degraded</span>
          )}
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">{definition.description}</p>
        <p className="text-xs font-mono text-sky-300">{definition.resourceImpactSummary}</p>
      </div>

      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
        <div className="text-xs font-mono text-slate-400">
          {isMaxed ? (
            <span className="text-emerald-400">Max Level</span>
          ) : (
            <span>Cost: <strong className="text-amber-300">{cost} SU</strong></span>
          )}
        </div>

        <button
          type="button"
          disabled={!missionActive || isMaxed || !canAfford || isBusy}
          onClick={(e) => {
            e.stopPropagation();
            onBuildOrUpgrade(definition.id);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 text-white transition-colors whitespace-nowrap cursor-pointer"
        >
          {installed.level === 0 ? (
            <>
              <PlusCircle className="w-3.5 h-3.5" />
              Build
            </>
          ) : (
            <>
              <ArrowUpCircle className="w-3.5 h-3.5" />
              {isMaxed ? 'Maxed' : 'Upgrade'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

interface OutpostGridVisualProps {
  destination: Destination;
  modules: Record<ModuleId, InstalledModule>;
  selectedModuleId: ModuleId;
  onSelectModule: (id: ModuleId) => void;
}

export const OutpostGridVisual: React.FC<OutpostGridVisualProps> = ({
  destination,
  modules,
  selectedModuleId,
  onSelectModule,
}) => {
  const orderedIds = Object.keys(OUTPOST_MODULES) as ModuleId[];
  const selectedDef = OUTPOST_MODULES[selectedModuleId];
  const selectedInst = modules[selectedModuleId];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-white">
            {destination === 'moon' ? 'Lunar South Pole Outpost Layout' : 'Jezero Crater Martian Outpost Layout'}
          </h3>
          <p className="text-xs text-slate-400">
            Select any module pad to inspect scientific operation, maintenance load, and upgrade effects.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Active Modules: {orderedIds.filter((id) => modules[id].level > 0).length} / {orderedIds.length}
        </span>
      </div>

      {/* Isometric-style engineering pad blueprint */}
      <div
        className={`relative rounded-xl border p-4 sm:p-6 overflow-hidden ${
          destination === 'moon'
            ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-slate-800'
            : 'bg-gradient-to-br from-stone-950 via-slate-900 to-amber-950/30 border-amber-900/40'
        }`}
      >
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 relative z-10">
          {orderedIds.map((id) => {
            const def = OUTPOST_MODULES[id];
            const inst = modules[id];
            const active = inst.level > 0;
            const isSel = selectedModuleId === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelectModule(id)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  isSel
                    ? 'border-sky-400 bg-sky-500/15 ring-1 ring-sky-400/40'
                    : active
                    ? 'border-slate-700 bg-slate-900/90 hover:border-slate-500'
                    : 'border-dashed border-slate-800 bg-slate-950/60 hover:border-slate-700 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400">{def.category}</span>
                  <span
                    className={`text-[11px] font-mono font-semibold ${
                      active ? 'text-sky-400' : 'text-slate-500'
                    }`}
                  >
                    {active ? `Lv ${inst.level}` : 'Empty'}
                  </span>
                </div>
                <p className="mt-1.5 text-xs font-semibold text-white truncate">{def.name}</p>
                <p className="mt-1 text-[11px] font-mono text-slate-400">
                  {def.powerPerLevelKw > 0
                    ? `+${destination === 'moon' ? 46 * inst.level : 26 * inst.level} kWh`
                    : `${def.powerPerLevelKw * Math.max(1, inst.level)} kWh`}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Module Engineering Inspector */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-1">
          <p className="text-xs font-mono text-sky-400">
            Selected Module · {selectedDef.name} (Level {selectedInst.level}/{selectedDef.maxLevel})
          </p>
          <p className="text-sm text-slate-200">{selectedDef.scienceExplanation}</p>
        </div>
        <div className="text-xs font-mono space-y-1 text-slate-300 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
          <p>Capacity: {selectedDef.capacityEffect}</p>
          <p>Efficiency: {Math.round(selectedInst.efficiency * 100)}%</p>
          <p>Wear/Day: -{selectedDef.maintenancePerDay} pts</p>
        </div>
      </div>
    </div>
  );
};
