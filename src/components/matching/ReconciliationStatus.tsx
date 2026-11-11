import React from 'react';
import type { DailyMatchRate, MatchPerformanceKpi, MatchStage } from '../../types/matching';

interface ReconciliationStatusProps {
  stageLabel: string;
  progressPercent: number;
  progressLabel: string;
  pendingDescription: string;
  targetNote: string;
  stages: MatchStage[];
  performanceKpis: MatchPerformanceKpi[];
  dailyRates: DailyMatchRate[];
  dailyAverage: string;
  running: boolean;
  onRunAutoMatch: () => void;
  className?: string;
}

export const ReconciliationStatus: React.FC<ReconciliationStatusProps> = ({
  stageLabel,
  progressPercent,
  progressLabel,
  pendingDescription,
  targetNote,
  stages,
  performanceKpis,
  dailyRates,
  dailyAverage,
  running,
  onRunAutoMatch,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-space-lg ${className}`}>
      <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-space-lg sm:p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-primary/5 rounded-full pointer-events-none blur-2xl"></div>
        <div>
          <div className="flex items-center justify-between flex-wrap gap-space-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">neurology</span>
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-on-surface">
                  Live Reconciliation Engine
                </h3>
                <p className="text-xs text-on-surface-variant">{pendingDescription}</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary-light text-primary font-mono">
              {stageLabel}
            </span>
          </div>

          <div className="mt-space-lg space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-on-surface">Overall Pipeline Progress</span>
              <span className="font-mono font-bold text-primary">{progressLabel}</span>
            </div>
            <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden p-0.5 border border-outline-variant/20">
              <div
                className="h-full bg-gradient-to-r from-primary to-indigo-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-space-lg">
            {stages.map((stage) => (
              <div
                key={stage.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs"
              >
                <div className="flex items-center gap-space-xs">
                  <span className={`material-symbols-outlined text-base ${stage.iconColor}`}>
                    {stage.icon}
                  </span>
                  <span className="font-medium text-on-surface">{stage.label}</span>
                </div>
                <span className={`font-mono font-bold ${stage.valueColor}`}>
                  {stage.percent}%{' '}
                  <span className="text-on-surface-variant font-normal">{stage.detail}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-space-lg pt-space-base border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[12px] text-on-surface-variant text-center sm:text-left">
            Target completion: <strong className="text-on-surface">{targetNote}</strong>
          </div>
          <button
            type="button"
            onClick={onRunAutoMatch}
            disabled={running}
            className="w-full sm:w-auto px-space-base py-2 rounded-xl bg-primary text-white text-xs font-bold tracking-wide uppercase hover:bg-primary-dark transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className={`material-symbols-outlined text-sm ${running ? 'animate-spin' : ''}`}>
              {running ? 'sync' : 'play_arrow'}
            </span>
            {running ? 'Matching…' : 'Run Auto-Match Now'}
          </button>
        </div>
      </div>

      <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-space-lg sm:p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-emerald-600">analytics</span>
              <h3 className="font-bold text-base sm:text-lg text-on-surface">
                Matching Performance
              </h3>
            </div>
            <span className="text-[11px] text-on-surface-variant font-mono">30-DAY STATS</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-space-base">
            {performanceKpis.map((kpi) => (
              <div key={kpi.id} className="bg-surface-container-low rounded-xl p-3">
                <span className="text-[11px] text-on-surface-variant uppercase font-semibold">
                  {kpi.label}
                </span>
                <div className={`text-xl font-extrabold mt-0.5 ${kpi.valueColor}`}>
                  {kpi.value}
                  {kpi.suffix && (
                    <span className="text-xs font-normal text-on-surface-variant">
                      {' '}
                      {kpi.suffix}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] ${kpi.noteColor}`}>{kpi.note}</span>
              </div>
            ))}
          </div>

          <div className="mt-space-base pt-3 border-t border-outline-variant/20">
            <div className="flex items-center justify-between text-xs mb-space-xs">
              <span className="text-on-surface-variant font-medium">
                Daily Match Rates (Past 7 Days)
              </span>
              <span className="text-on-surface font-mono font-bold text-[11px]">
                Avg: {dailyAverage}
              </span>
            </div>
            <div className="flex items-end justify-between h-14 gap-1.5 px-1">
              {dailyRates.map((rate) => (
                <div key={rate.id} className="flex-1 flex flex-col items-center gap-1 group">
                  <div
                    className={`w-full rounded-t transition-all ${
                      rate.active ? 'bg-primary shadow-sm' : 'bg-primary/20 group-hover:bg-primary'
                    }`}
                    style={{ height: `${rate.height}%` }}
                    title={`${rate.day}: ${rate.percent}%`}
                  />
                  <span
                    className={`text-[9px] font-mono ${
                      rate.active ? 'font-bold text-primary' : 'text-on-surface-variant'
                    }`}
                  >
                    {rate.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReconciliationStatus;
