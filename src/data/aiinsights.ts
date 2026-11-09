import type {
  DecisionRecord,
  MetricCardData,
  HeuristicItem,
  ConfidenceBar,
  GuardrailItem,
  ForensicAudit,
  EngineStatus,
  ReplayCache,
  FilterTab,
} from '../types/aiinsights';

// Filter Tabs
export const filterTabs: FilterTab[] = [
  { id: 'all', label: 'All', count: 1248 },
  { id: 'accepted', label: 'Accepted', count: 1176 },
  { id: 'overridden', label: 'Overridden', count: 72 },
  { id: 'escalated', label: 'Escalated', count: 14 },
];

// Decision Records
export const decisionRecords: DecisionRecord[] = [
  {
    id: '1',
    company: 'Apex Robotics Corp',
    amount: '49,965',
    currency: 'USD',
    status: 'accepted',
    description: 'P0802 code auto-assigned. Verified by R. Verma (Lead Compliance). Clean MSA milestone correlation confirmed against wire memo.',
    modelConfidence: '99.1%',
    timestamp: '24m ago',
    hash: '#88c1a',
  },
  {
    id: '2',
    company: 'Kyoto Digital KK',
    amount: '¥4.8M',
    currency: 'JPY',
    status: 'overridden',
    description: 'AI proposed P0802; Auditor switched to P1007 (Digital Media Content).',
    details: 'Deliverables include motion graphic renders; reclassified under P1007 to match Tokyo customs manifest.',
    modelConfidence: '99.1%',
    timestamp: '2h ago',
    hash: '#88c1a',
    auditor: 'S. Menon',
    proposedCode: 'P0802',
    actualCode: 'P1007',
  },
  {
    id: '3',
    company: 'Seoul BioTech Labs',
    amount: '14,200',
    currency: 'USD',
    status: 'accepted',
    description: 'P1006 Biotech Trial Remittance approved with automated ICEGATE cross-check against import/export permit.',
    modelConfidence: '96.8%',
    timestamp: '4h ago',
    hash: '#88c1a',
  },
  {
    id: '4',
    company: 'Al-Mansoor Trading',
    amount: '220,000',
    currency: 'USD',
    status: 'escalated',
    description: 'Dual-use HS Code check flag (Category 8 Marine navigation sensors). Requires Senior Statutory Auditor sign-off before AD Bank filing.',
    timestamp: '5h ago',
    caseNumber: 'ESC-402',
  },
];

// Metric Cards (Bento Grid)
export const metricCards: MetricCardData[] = [
  {
    id: '1',
    label: 'Overall Precision',
    value: '98.4%',
    subtitle: '1,248 remittance checks',
    icon: 'target',
    iconColor: 'text-primary',
  },
  {
    id: '2',
    label: 'Human Acceptance',
    value: '94.2%',
    subtitle: '1,176 accepted • 72 rev',
    icon: 'how_to_reg',
    iconColor: 'text-tertiary',
  },
  {
    id: '3',
    label: 'Avg Decision Time',
    value: '1.2s',
    subtitle: 'vs 45m legacy manual',
    icon: 'speed',
    iconColor: 'text-secondary',
  },
  {
    id: '4',
    label: 'FEMA Defensibility',
    value: '0 Fines',
    subtitle: '100% RBI inquiry defense',
    icon: 'format_image_left',
    iconColor: 'text-primary-container',
  },
];

// Heuristic Items (Automated Exception Remediation)
export const heuristicItems: HeuristicItem[] = [
  {
    id: '1',
    title: 'Correspondent Bank Haircut (-$35.00 USD)',
    description: 'Remittance shortfall on INV-2024-889. Auto-remediated under Section 6 FEMA Safe Harbor (0.07% variance < 2.0% statutory threshold). Ledger memo generated automatically.',
    status: 'SAFE HARBOR APPLIED',
    statusColor: 'bg-[#ECFDF5] text-[#065F46]',
    trace: 'Citi NY → HDFC IN',
    counterparty: 'Reconciled to EDPMS',
  },
  {
    id: '2',
    title: 'MT103 Nostro Orphan Discovery',
    description: 'Unpaired $118,500 wire resolved from Citi AD-Cat 1 API. Matched to ICEGATE Shipping Bill #SB-9921 via counterparty EU VAT ID and fuzzy reference hash.',
    status: 'SCORE 98.2%',
    statusColor: 'bg-surface-container-high text-on-surface',
    trace: 'Counterparty: Veltrix Tech SAS',
    counterparty: 'Audit Pack Generated',
  },
];

// Confidence Bars (Inference Distribution)
export const confidenceBars: ConfidenceBar[] = [
  {
    id: '1',
    label: 'High Confidence (>95%) • 1-Tap Clearance',
    percentage: 88.5,
    color: 'bg-primary',
    description: '88.5%',
  },
  {
    id: '2',
    label: 'Moderate (80–95%) • Secondary Auditor Check',
    percentage: 9.2,
    color: 'bg-secondary-container',
    description: '9.2%',
  },
  {
    id: '3',
    label: 'Low / Ambiguous (<80%) • Mandatory CA & Legal',
    percentage: 2.3,
    color: 'bg-error',
    description: '2.3%',
  },
];

// Guardrail Items
export const guardrailItems: GuardrailItem[] = [
  {
    id: '1',
    title: 'Confidence Threshold Lock',
    description: 'Minimum 90.0% required for instant auto-filing',
    status: '90.0% ENFORCED',
    statusColor: 'bg-[#ECFDF5] text-[#065F46]',
  },
  {
    id: '2',
    title: 'Dual Sign-off on Divergent Codes',
    description: 'Mandatory CA validation if model ≠ bank tag',
    status: 'ACTIVE',
    statusColor: 'bg-[#ECFDF5] text-[#065F46]',
  },
  {
    id: '3',
    title: 'Immutable Dossier Archiving',
    description: 'Chain-of-custody snapshots preserved for 7 years',
    status: 'COMPLIANT',
    statusColor: 'bg-[#ECFDF5] text-[#065F46]',
  },
];

// Forensic Audit Data
export const forensicAudit: ForensicAudit = {
  invoiceNumber: 'INV-2024-912',
  company: 'Valence Cloud GmbH',
  confidence: '98.2%',
  aiProposedCode: 'P0802',
  bankTag: 'P0803',
  bankTagCorrect: false,
  codeDescription: 'Software Consultancy & Custom Dev',
  amount: '€38,400.00 EUR',
  rationale: 'Bank counterparty initially tagged as P0803 (Data Hosting); AI auto-corrected based on deep MSA contract parsing.',
  shaHash: '4ce7..9a11',
  authorityAlignment: 'Cross-checked against RBI Master Direction No. 5/2016-17; DGFT Foreign Trade Policy (FTP) Para 2.05 compliance rulebook.',
  confidenceFactors: [
    { label: 'MSA Terms', value: '0.98' },
    { label: 'Customs History', value: '0.97' },
    { label: 'Entity VAT', value: '0.95' },
  ],
};

// Engine Status
export const engineStatus: EngineStatus = {
  title: 'Active Ensemble Core',
  icon: 'neurology',
  uptime: '99.98% UPTIME',
  uptimeColor: 'bg-[#ECFDF5] text-[#065F46]',
  description: 'Claude 3.5 Sonnet (B8 Extraction) + GPT-4o (Regulatory Legal) • Round-Trip: 420ms',
};

// Replay Cache
export const replayCache: ReplayCache = {
  title: 'Deterministic Replay Cache',
  icon: 'verified_user',
  status: '100% SYNCED',
  description: '1,842 decisions cryptographically sealed with SHA-256 seed for statutory EDPMS & DGFT audits. Zero speculative hallucination tolerance.',
  merkleSeed: '0x9f4a...d87e2b10',
  blockNumber: 'Block #209841',
};

// Drift Info
export const driftInfo = {
  title: 'Zero Regulatory Drift Detected',
  description: 'Validated against latest DGFT Circular 34/2024 & RBI October Master Updates.',
  icon: 'published_with_changes',
};

// Toast message
export const toastMessage = 'Package signed and downloaded with Merkle Seed SHA-256 certificate.';
