import React from 'react';
import { ResourceMetric } from '../shared/types.ts';

interface ResourceCardProps {
  metric: ResourceMetric;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ metric }) => {
  const statusStyles = {
    Nominal: {
      text: 'text-emerald-400',
      bar: 'bg-emerald-500',
      prefix: '● Nominal',
    },
    Caution: {
      text: 'text-amber-400',
      bar: 'bg-amber-500',
      prefix: '▲ Caution',
    },
    Critical: {
      text: 'text-rose-400',
      bar: 'bg-rose-500',
      prefix: '✖ Critical',
    },
  }[metric.status];

  const fillPercent =
    metric.id === 'temperature'
      ? Math.max(5, Math.min(100, ((metric.current + 10) / 45) * 100))
      : Math.max(0, Math.min(100, (metric.current / Math.max(1, metric.max)) * 100));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{metric.label}</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-semibold tabular-nums text-white">{metric.current}</span>
            <span className="text-xs font-mono text-slate-400">
              {metric.unit}
              {metric.id !== 'temperature' && metric.id !== 'radiation' ? ` / ${metric.max}` : ''}
            </span>
          </div>
        </div>
        <span className={`text-xs font-mono font-medium whitespace-nowrap ${statusStyles.text}`}>
          {statusStyles.prefix}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${statusStyles.bar}`}
          style={{ width: `${fillPercent}%` }}
        />
      </div>

      {/* Daily Rates */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/80 text-xs font-mono tabular-nums">
        <div>
          <span className="block text-[11px] text-slate-500">Prod/d</span>
          <span className="text-slate-200">
            {metric.id === 'radiation' || metric.id === 'temperature' ? '—' : `+${metric.dailyProduction}`}
          </span>
        </div>
        <div>
          <span className="block text-[11px] text-slate-500">Use/d</span>
          <span className="text-slate-200">
            {metric.id === 'temperature'
              ? 'Active'
              : metric.id === 'radiation'
              ? `${metric.dailyConsumption} mSv`
              : `-${metric.dailyConsumption}`}
          </span>
        </div>
        <div>
          <span className="block text-[11px] text-slate-500">Runway</span>
          <span className="text-slate-200">
            {metric.estimatedDaysRemaining !== null
              ? `${metric.estimatedDaysRemaining}d`
              : metric.netDaily >= 0 && metric.id !== 'radiation' && metric.id !== 'temperature'
              ? 'Stable'
              : '—'}
          </span>
        </div>
      </div>

      {/* Transparent causal explanation */}
      <p className="text-xs text-slate-400 leading-relaxed">{metric.reason}</p>
    </div>
  );
};
