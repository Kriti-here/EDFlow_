import React from 'react';

interface ConfidenceIndicatorProps {
  value: number;
  size?: 'sm' | 'md';
  className?: string;
}

const getTone = (value: number) => {
  if (value >= 95) {
    return { bar: 'bg-emerald-500', text: 'text-emerald-700' };
  }
  if (value >= 80) {
    return { bar: 'bg-primary', text: 'text-primary' };
  }
  return { bar: 'bg-amber-500', text: 'text-amber-700' };
};

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  value,
  size = 'sm',
  className = '',
}) => {
  const tone = getTone(value);
  const trackHeight = size === 'md' ? 'h-2' : 'h-1.5';
  const textClass = size === 'md' ? 'text-sm' : 'text-xs';

  return (
    <div className={`flex items-center gap-space-xs ${className}`}>
      <div className={`w-16 ${trackHeight} bg-surface-container rounded-full overflow-hidden`}>
        <div
          className={`h-full ${tone.bar} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      <span className={`font-mono font-bold ${textClass} ${tone.text}`}>
        {value.toFixed(1)}%
      </span>
    </div>
  );
};

export default ConfidenceIndicator;
