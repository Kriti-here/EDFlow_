// FIRA Document types
export type FiraStatus = 'fully-linked' | 'tolerated-discrepancy' | 'pending-purpose' | 'unlinked';

export type FiraStatusBadgeProps = {
  status: FiraStatus;
  label: string;
};

export type FiraDocument = {
  id: string;
  ref: string;
  bank: string;
  swiftRef: string;
  remittanceValue: string;
  currency: string;
  remitter: string;
  purposeCode: string;
  linkedInvoice?: string;
  invoiceAmount?: string;
  status: FiraStatus;
  discrepancy?: string;
  aiSuggestion?: string;
  timestamp: string;
  hash: string;
  bankStamp: string;
};

export type FiraMetricsProps = {
  label: string;
  value: string;
  icon: string;
  subtitle: string;
  delta?: string;
  progress?: number;
};

export type BankNode = {
  name: string;
  status: 'active' | 'inactive';
};

export type BankNodeProps = BankNode;

export type FilterTab = {
  label: string;
  count: number;
  active?: boolean;
  variant?: 'default' | 'error' | 'primary';
};
