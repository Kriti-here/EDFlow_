import React from 'react';
import type { MatchSummaryCardData } from '../../types/matching';

interface MatchSummaryCardProps {
  data: MatchSummaryCardData;
  className?: string;
}

export const MatchSummaryCard: React.FC<MatchSummaryCardProps> = ({
  data,
  className = '',
}) => {
  return (
    <div
      className={`bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-space-md shadow-sm ${data.hoverBorder} transition-all flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between text-on-surface-variant">
        <span className="text-[12px] font-semibold uppercase tracking-wider">
          {data.label}
        </span>
        <span className={`material-symbols-outlined text-lg ${data.iconColor}`}>
          {data.icon}
        </span>
      </div>
      <div className="mt-space-xs">
        <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${data.valueColor}`}>
          {data.value}
        </div>
        <div className={`flex items-center gap-1 text-[11px] font-medium mt-1 ${data.hintColor}`}>
          {data.hintIcon && (
            <span className="material-symbols-outlined text-sm">{data.hintIcon}</span>
          )}
          <span>{data.hint}</span>
        </div>
      </div>
    </div>
  );
};

export default MatchSummaryCard;
