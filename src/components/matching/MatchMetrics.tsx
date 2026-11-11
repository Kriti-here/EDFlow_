import React from 'react';
import MatchSummaryCard from './MatchSummaryCard';
import type { MatchSummaryCardData } from '../../types/matching';

interface MatchMetricsProps {
  cards: MatchSummaryCardData[];
  className?: string;
}

export const MatchMetrics: React.FC<MatchMetricsProps> = ({ cards, className = '' }) => {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-sm sm:gap-space-base ${className}`}
    >
      {cards.map((card) => (
        <MatchSummaryCard key={card.id} data={card} />
      ))}
    </div>
  );
};

export default MatchMetrics;
