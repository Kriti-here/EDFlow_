// Matching Center Types and Interfaces

export type MatchStatus = 'matched' | 'unmatched' | 'pending';

export type MatchFilterId = 'all' | 'matched' | 'unmatched' | 'high_conf' | 'pending';

export interface MatchRecord {
  id: string;
  status: MatchStatus;
  firaRef: string;
  utr: string;
  paymentTag: string;
  invoiceRef: string;
  remitter: string;
  location: string;
  amount: string;
  amountUsd: number;
  bank: string;
  confidence: number;
  aiRecommendation: string;
  recommendationDetail: string;
  daysAgo: number;
  cycle: number;
}

export interface MatchSummaryCardData {
  id: string;
  label: string;
  value: string;
  hint: string;
  hintIcon: string;
  icon: string;
  iconColor: string;
  valueColor: string;
  hintColor: string;
  hoverBorder: string;
}

export interface MatchFilterTab {
  id: MatchFilterId;
  label: string;
  count: number;
}

export interface MatchStage {
  id: string;
  label: string;
  icon: string;
  iconColor: string;
  valueColor: string;
  percent: number;
  detail: string;
}

export interface MatchPerformanceKpi {
  id: string;
  label: string;
  value: string;
  valueColor: string;
  suffix?: string;
  note: string;
  noteColor: string;
}

export interface DailyMatchRate {
  id: string;
  day: string;
  percent: number;
  height: number;
  active?: boolean;
}

export type MatchDateRange = '' | 'today' | '7d' | '30d' | 'cycle84';

export type MatchAmountRange = '' | 'under10k' | '10k-50k' | 'over50k';

export interface MatchToast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}
