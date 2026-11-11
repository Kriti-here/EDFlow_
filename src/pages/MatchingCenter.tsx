import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ConfidenceIndicator,
  MatchFilters,
  MatchMetrics,
  MatchTable,
  ReconciliationStatus,
} from '../components/matching';
import {
  bankOptions,
  dailyMatchRates,
  matchPerformanceKpis,
  matchRecords,
  matchStages,
  matchSummaryCards,
} from '../data/matching';
import type {
  MatchAmountRange,
  MatchDateRange,
  MatchFilterId,
  MatchFilterTab,
  MatchRecord,
  MatchToast,
} from '../types/matching';

const detailRow =
  'flex justify-between text-on-surface-variant gap-space-md';

const MatchingCenter: React.FC = () => {
  const [records, setRecords] = useState<MatchRecord[]>(matchRecords);
  const [activeTab, setActiveTab] = useState<MatchFilterId>('all');
  const [search, setSearch] = useState('');
  const [bank, setBank] = useState('');
  const [dateRange, setDateRange] = useState<MatchDateRange>('30d');
  const [amountRange, setAmountRange] = useState<MatchAmountRange>('');
  const [progressPercent, setProgressPercent] = useState(88);
  const [running, setRunning] = useState(false);
  const [modalRecord, setModalRecord] = useState<MatchRecord | null>(null);
  const [toasts, setToasts] = useState<MatchToast[]>([]);
  const toastIdRef = useRef(0);

  const pushToast = useCallback((message: string, type: MatchToast['type'] = 'success') => {
    toastIdRef.current += 1;
    const id = toastIdRef.current;
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const tabs: MatchFilterTab[] = useMemo(() => {
    const countBy = (predicate: (record: MatchRecord) => boolean) =>
      records.filter(predicate).length;
    return [
      { id: 'all', label: 'All', count: records.length },
      { id: 'matched', label: 'Matched', count: countBy((r) => r.status === 'matched') },
      { id: 'unmatched', label: 'Unmatched', count: countBy((r) => r.status === 'unmatched') },
      {
        id: 'high_conf',
        label: 'High Confidence (>95%)',
        count: countBy((r) => r.confidence > 95),
      },
      { id: 'pending', label: 'Needs Review', count: countBy((r) => r.status === 'pending') },
    ];
  }, [records]);

  const filteredRecords = useMemo(() => {
    const term = search.trim().toLowerCase();
    return records.filter((record) => {
      if (activeTab === 'matched' && record.status !== 'matched') return false;
      if (activeTab === 'unmatched' && record.status !== 'unmatched') return false;
      if (activeTab === 'pending' && record.status !== 'pending') return false;
      if (activeTab === 'high_conf' && record.confidence <= 95) return false;

      if (bank && !record.bank.includes(bank)) return false;

      if (dateRange === 'today' && record.daysAgo > 0) return false;
      if (dateRange === '7d' && record.daysAgo > 7) return false;
      if (dateRange === '30d' && record.daysAgo > 30) return false;
      if (dateRange === 'cycle84' && record.cycle !== 84) return false;

      if (amountRange === 'under10k' && record.amountUsd >= 10000) return false;
      if (amountRange === '10k-50k' && (record.amountUsd < 10000 || record.amountUsd > 50000))
        return false;
      if (amountRange === 'over50k' && record.amountUsd <= 50000) return false;

      if (term) {
        const haystack = `${record.firaRef} ${record.utr} ${record.invoiceRef} ${record.remitter} ${record.bank}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }

      return true;
    });
  }, [records, activeTab, search, bank, dateRange, amountRange]);

  const resetFilters = useCallback(() => {
    setActiveTab('all');
    setSearch('');
    setBank('');
    setDateRange('30d');
    setAmountRange('');
  }, []);

  const handleForceMatch = useCallback(
    (record: MatchRecord) => {
      setRecords((current) =>
        current.map((item) =>
          item.id === record.id
            ? {
                ...item,
                status: 'matched',
                confidence: 99.8,
                aiRecommendation: 'Manually Affirmed & CA Sealed',
              }
            : item,
        ),
      );
      pushToast(
        `Remittance ${record.utr} successfully matched with ${record.invoiceRef}! Proof sealed to Merkle tree.`,
      );
      setModalRecord(null);
    },
    [pushToast],
  );

  const handleReject = useCallback(
    (record: MatchRecord) => {
      setRecords((current) =>
        current.map((item) =>
          item.id === record.id ? { ...item, status: 'unmatched' } : item,
        ),
      );
      pushToast(
        `Remittance ${record.utr} rejected and routed to Exceptions Hub (Alert created).`,
        'error',
      );
      setModalRecord(null);
    },
    [pushToast],
  );

  const handleRunAutoMatch = useCallback(() => {
    if (running) return;
    setRunning(true);
    pushToast(
      'Initiating AI reconciliation sweep across JPMorgan, MUFG, and HSBC Nostro pipelines...',
      'info',
    );
    window.setTimeout(() => {
      setProgressPercent(100);
      setRunning(false);
      pushToast(
        'Auto-Match completed! Remittances reconciled with 98.6% composite confidence.',
      );
    }, 1400);
  }, [running, pushToast]);

  const handleExportReport = useCallback(() => {
    pushToast('Exporting Reconciliation Dossier (EDFlow-Reconcile-Report.csv)...', 'info');
  }, [pushToast]);

  const handleRerunUnmatched = useCallback(() => {
    const unmatchedCount = records.filter((record) => record.status === 'unmatched').length;
    pushToast(`Re-evaluating ${unmatchedCount} unmatched records against updated FEDAI circular rules...`, 'info');
  }, [records, pushToast]);

  const handleViewAuditLog = useCallback(() => {
    pushToast('Opening FEDAI Compliance Immutable Audit Ledger (Block #209841)...', 'info');
  }, [pushToast]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModalRecord(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const modalStatusTone =
    modalRecord?.status === 'matched'
      ? 'bg-emerald-100 text-emerald-800'
      : modalRecord?.status === 'unmatched'
        ? 'bg-error-container text-error'
        : 'bg-amber-100 text-amber-800';

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans antialiased pb-24 sm:pb-28">
      <main className="max-w-7xl mx-auto px-space-base sm:px-6 pt-space-base space-y-6">
        <div className="space-y-space-xs">
          <div className="flex items-center justify-between flex-wrap gap-space-xs">
            <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm"></span>
              <span>Real-Time Reconciliation Active</span>
              <span className="text-emerald-400">•</span>
              <span className="text-emerald-700 font-mono text-[11px]">
                FEDAI &amp; EDPMS AUTO-SYNC
              </span>
            </div>
            <div className="flex items-center gap-space-xs text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span>
                Last polled: <strong className="text-on-surface">32s ago</strong> via Citi / HDFC
                APIs
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface">
                Matching Center
              </h1>
              <p className="text-sm text-on-surface-variant mt-0.5">
                Automatically match FIRA documents with Nostro remittances using AI-powered
                reconciliation
              </p>
            </div>
            <div className="flex items-center gap-space-xs flex-wrap">
              <button
                type="button"
                onClick={handleRunAutoMatch}
                disabled={running}
                className="inline-flex items-center gap-1.5 px-space-base py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all shadow-sm active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className={`material-symbols-outlined text-base ${running ? 'animate-spin' : ''}`}>
                  sync
                </span>
                <span>{running ? 'Matching…' : 'Run Auto-Match'}</span>
              </button>
              <button
                type="button"
                onClick={handleExportReport}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-on-surface text-sm font-semibold hover:bg-surface-container transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-base">download</span>
                <span className="hidden sm:inline">Export Report</span>
              </button>
            </div>
          </div>
        </div>

        <MatchMetrics cards={matchSummaryCards} />

        <ReconciliationStatus
          stageLabel="STAGE 4 / 4"
          progressPercent={progressPercent}
          progressLabel={`${progressPercent}% Assembled`}
          pendingDescription="Processing 3 pending remittances across AD-Cat 1 portals"
          targetNote="Today 17:00 IST to clear RBI 21-day lodging window."
          stages={matchStages}
          performanceKpis={matchPerformanceKpis}
          dailyRates={dailyMatchRates}
          dailyAverage="97.8%"
          running={running}
          onRunAutoMatch={handleRunAutoMatch}
        />

        <div className="bg-surface-container-low border border-outline-variant/40 rounded-2xl p-3.5 sm:p-space-base shadow-sm flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-xl">bolt</span>
            <span className="text-sm font-bold text-on-surface">Queue Operations:</span>
          </div>
          <div className="flex items-center gap-space-xs flex-wrap">
            <button
              type="button"
              onClick={handleRerunUnmatched}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-base text-primary">sync</span>
              Re-run All Unmatched (
              {records.filter((record) => record.status === 'unmatched').length})
            </button>
            <button
              type="button"
              onClick={handleExportReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-base text-emerald-600">download</span>
              Export Reconciliation Report
            </button>
            <button
              type="button"
              onClick={handleViewAuditLog}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-base text-on-surface-variant">
                history
              </span>
              View Audit Log
            </button>
          </div>
        </div>

        <MatchFilters
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          search={search}
          onSearchChange={setSearch}
          bank={bank}
          onBankChange={setBank}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          amountRange={amountRange}
          onAmountRangeChange={setAmountRange}
          bankOptions={bankOptions}
          onReset={resetFilters}
        />

        <MatchTable
          records={filteredRecords}
          totalCount={records.length}
          onDetails={setModalRecord}
          onForceMatch={handleForceMatch}
          onReject={handleReject}
          onReset={resetFilters}
        />
      </main>

      {modalRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-base bg-[rgba(19,27,46,0.45)] backdrop-blur-sm">
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-space-base border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary">fact_check</span>
                <h3 className="font-bold text-base sm:text-lg text-on-surface">
                  Reconciliation Inspection
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalRecord(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface-variant"
                title="Close"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-space-base text-sm">
              <div className="bg-surface-container-low p-space-base rounded-xl space-y-space-xs border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary">
                    {modalRecord.firaRef}
                  </span>
                  <span
                    className={`px-space-xs py-0.5 rounded text-[11px] font-bold uppercase ${modalStatusTone}`}
                  >
                    {modalRecord.status}
                  </span>
                </div>
                <div className="text-base font-extrabold text-on-surface">
                  {modalRecord.remitter}
                </div>
                <div className="text-xs text-on-surface-variant">
                  {modalRecord.location} • Bank:{' '}
                  <strong className="text-on-surface font-mono">{modalRecord.bank}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-surface-container-low rounded-xl">
                  <span className="text-on-surface-variant font-medium block">Remittance Amount</span>
                  <strong className="text-base text-on-surface font-mono">{modalRecord.amount}</strong>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl">
                  <span className="text-on-surface-variant font-medium block">Matched Invoice</span>
                  <strong className="text-base text-primary font-mono">
                    {modalRecord.invoiceRef}
                  </strong>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-base">psychology</span>
                  AI Classification &amp; Rationale
                </span>
                <p className="text-on-surface-variant bg-surface-container-low p-3 rounded-xl leading-relaxed border border-outline-variant/20">
                  {modalRecord.recommendationDetail}
                </p>
              </div>

              <div className="p-3 bg-surface-container-low rounded-xl text-xs space-y-1 font-mono">
                <div className={detailRow}>
                  <span>Match Confidence:</span>
                  <ConfidenceIndicator value={modalRecord.confidence} />
                </div>
                <div className={detailRow}>
                  <span>UTR Reference:</span>
                  <strong className="text-on-surface">{modalRecord.utr}</strong>
                </div>
                <div className={detailRow}>
                  <span>Bank Partner:</span>
                  <strong className="text-on-surface">{modalRecord.bank}</strong>
                </div>
                <div className={detailRow}>
                  <span>Audit Seal:</span>
                  <strong className="text-emerald-700 truncate max-w-[200px]">
                    SHA256: {modalRecord.id.padStart(6, '0')}f4219bfe9930f782
                  </strong>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-outline-variant/30 bg-surface-container-low flex justify-end gap-space-xs">
              <button
                type="button"
                onClick={() => setModalRecord(null)}
                className="px-space-base py-2 rounded-xl text-sm font-semibold border border-outline-variant/60 text-on-surface hover:bg-surface-container-high transition-colors"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => handleForceMatch(modalRecord)}
                className="px-space-base py-2 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">check_circle</span>
                Confirm Match
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed top-space-base right-space-base z-50 flex flex-col gap-space-xs max-w-sm w-full pointer-events-none px-space-base sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-space-base rounded-xl shadow-xl flex items-start gap-3 text-xs sm:text-sm ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-white'
                : toast.type === 'error'
                  ? 'bg-red-900 text-white'
                  : 'bg-inverse-surface text-surface'
            }`}
          >
            <span className="material-symbols-outlined text-base sm:text-lg flex-shrink-0">
              {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
            </span>
            <div className="flex-1 font-medium leading-snug">{toast.message}</div>
            <button
              type="button"
              onClick={() => setToasts((current) => current.filter((t) => t.id !== toast.id))}
              className="opacity-70 hover:opacity-100"
              title="Dismiss"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchingCenter;
