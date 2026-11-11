import React from 'react';
import type {
  MatchAmountRange,
  MatchDateRange,
  MatchFilterId,
  MatchFilterTab,
} from '../../types/matching';

interface MatchFiltersProps {
  tabs: MatchFilterTab[];
  activeTab: MatchFilterId;
  onTabChange: (id: MatchFilterId) => void;
  search: string;
  onSearchChange: (value: string) => void;
  bank: string;
  onBankChange: (value: string) => void;
  dateRange: MatchDateRange;
  onDateRangeChange: (value: MatchDateRange) => void;
  amountRange: MatchAmountRange;
  onAmountRangeChange: (value: MatchAmountRange) => void;
  bankOptions: string[];
  onReset: () => void;
  className?: string;
}

const selectClass =
  'w-full appearance-none pl-2.5 pr-7 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-xs font-medium text-on-surface focus:outline-none focus:border-primary cursor-pointer truncate';

export const MatchFilters: React.FC<MatchFiltersProps> = ({
  tabs,
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  bank,
  onBankChange,
  dateRange,
  onDateRangeChange,
  amountRange,
  onAmountRangeChange,
  bankOptions,
  onReset,
  className = '',
}) => {
  return (
    <div
      className={`bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-space-base sm:p-space-lg shadow-sm space-y-3 ${className}`}
    >
      <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar pb-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs flex-shrink-0 transition-all ${
                isActive
                  ? 'font-bold bg-primary text-white shadow-sm'
                  : 'font-semibold bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm pt-1">
        <div className="md:col-span-6 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by FIRA Ref, UTR, Remitter, or Invoice..."
            className="w-full pl-9 pr-9 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
              title="Clear search"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        <div className="md:col-span-6 grid grid-cols-3 gap-space-xs">
          <div className="relative">
            <select
              value={bank}
              onChange={(event) => onBankChange(event.target.value)}
              className={selectClass}
              title="Filter by bank"
            >
              <option value="">All Banks</option>
              {bankOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
              expand_more
            </span>
          </div>

          <div className="relative">
            <select
              value={dateRange}
              onChange={(event) => onDateRangeChange(event.target.value as MatchDateRange)}
              className={selectClass}
              title="Filter by date range"
            >
              <option value="30d">Last 30 Days</option>
              <option value="7d">Last 7 Days</option>
              <option value="today">Today</option>
              <option value="cycle84">Cycle #84</option>
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
              calendar_today
            </span>
          </div>

          <div className="relative">
            <select
              value={amountRange}
              onChange={(event) => onAmountRangeChange(event.target.value as MatchAmountRange)}
              className={selectClass}
              title="Filter by amount range"
            >
              <option value="">All Amounts</option>
              <option value="under10k">&lt; $10,000</option>
              <option value="10k-50k">$10k - $50k</option>
              <option value="over50k">&gt; $50,000</option>
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
              tune
            </span>
          </div>
        </div>
      </div>

      {(activeTab !== 'all' || search || bank || amountRange || dateRange !== '30d') && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            <span className="material-symbols-outlined text-sm">restart_alt</span>
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default MatchFilters;
