import React from 'react';
import type { MetricCardData } from '../../types/aiinsights';

interface MetricCardProps {
  data: MetricCardData;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ data, className = '' }) => {
  return (
    <div className={`p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-1 ${className}`}>
      <div className="flex items-center justify-between text-on-surface-variant">
        <span className="font-label-sm text-label-sm uppercase font-semibold">
          {data.label}
        </span>
        <span className={`material-symbols-outlined text-[16px] ${data.iconColor || 'text-primary'}`}>
          {data.icon}
        </span>
      </div>
      <span className="font-headline-md text-headline-md text-on-surface font-bold">
        {data.value}
      </span>
      <span className="font-code-sm text-code-sm text-on-surface-variant">
        {data.subtitle}
      </span>
    </div>
  );
};

export default MetricCard;
