import React from 'react';
import ConfidenceIndicator from './ConfidenceIndicator';
import type { MatchRecord, MatchStatus } from '../../types/matching';

interface MatchTableProps {
  records: MatchRecord[];
  totalCount: number;
  onDetails: (record: MatchRecord) => void;
  onForceMatch: (record: MatchRecord) => void;
  onReject: (record: MatchRecord) => void;
  onReset: () => void;
  className?: string;
}

const statusBadge: Record<MatchStatus, { container: string; dot: string; label: string }> = {
  matched: {
    container: 'bg-emerald-100 text-emerald-800',
    dot: 'bg-emerald-600',
    label: 'MATCHED',
  },
  unmatched: {
    container: 'bg-error-container text-error',
    dot: 'bg-error',
    label: 'UNMATCHED',
  },
  pending: {
    container: 'bg-amber-100 text-amber-800',
    dot: 'bg-amber-500',
    label: 'PENDING',
  },
};

const paymentTagTone: Record<MatchStatus, string> = {
  matched: 'text-on-surface-variant bg-surface-container',
  unmatched: 'text-error bg-red-100 font-medium',
  pending: 'text-amber-800 bg-amber-100 font-medium',
};

const rowTone: Record<MatchStatus, string> = {
  matched: '',
  unmatched: 'bg-red-50/20',
  pending: 'bg-amber-50/20',
};

const StatusPill: React.FC<{ status: MatchStatus }> = ({ status }) => {
  const tone = statusBadge[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${tone.container}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`}></span>
      {tone.label}
    </span>
  );
};

export const MatchTable: React.FC<MatchTableProps> = ({
  records,
  totalCount,
  onDetails,
  onForceMatch,
  onReject,
  onReset,
  className = '',
}) => {
  return (
    <div
      className={`bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm overflow-hidden ${className}`}
    >
      <div className="px-space-lg py-space-base border-b border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs bg-surface-container-low/40">
        <div>
          <div className="flex items-center gap-space-xs">
            <h2 className="text-base sm:text-lg font-bold text-on-surface">Reconciliation Queue</h2>
            <span className="px-space-xs py-0.5 rounded-full text-xs font-mono font-bold bg-primary-light text-primary">
              {records.length} item{records.length !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {records.length} of {totalCount} remittances shown — awaiting match confirmation or
            regulatory review
          </p>
        </div>
        <div className="flex items-center gap-space-xs text-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-sm">lock</span>
          <span>SHA-256 Proof Anchored</span>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="p-space-xl text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-surface-container mx-auto flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-2xl">search_off</span>
          </div>
          <div>
            <h4 className="font-bold text-on-surface text-sm">No matching reconciliation records</h4>
            <p className="text-xs text-on-surface-variant mt-1">
              Try adjusting your search criteria, bank filter, or status selection.
            </p>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="px-space-base py-2 rounded-xl bg-surface-container-high text-xs font-bold text-on-surface hover:bg-surface-container transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant uppercase font-semibold text-[11px] tracking-wider border-b border-outline-variant/30">
                  <th className="py-3.5 px-space-base">Status</th>
                  <th className="py-3.5 px-space-base">FIRA &amp; Remittance UTR</th>
                  <th className="py-3.5 px-space-base">Invoice &amp; Client</th>
                  <th className="py-3.5 px-space-base">Amount &amp; Bank</th>
                  <th className="py-3.5 px-space-base">AI Recommendation &amp; Score</th>
                  <th className="py-3.5 px-space-base text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {records.map((record) => (
                  <tr
                    key={record.id}
                    className={`hover:bg-surface-container-low/50 transition-colors ${rowTone[record.status]}`}
                  >
                    <td className="py-space-base px-space-base align-top">
                      <StatusPill status={record.status} />
                    </td>
                    <td className="py-space-base px-space-base align-top">
                      <div
                        className={`font-mono font-bold ${record.status === 'matched' ? 'text-primary' : 'text-on-surface'}`}
                      >
                        {record.firaRef}
                      </div>
                      <div className="font-mono text-xs text-on-surface-variant mt-0.5">
                        {record.utr}
                      </div>
                      <span
                        className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded ${paymentTagTone[record.status]}`}
                      >
                        {record.paymentTag}
                      </span>
                    </td>
                    <td className="py-space-base px-space-base align-top">
                      <div className="font-semibold text-on-surface">{record.remitter}</div>
                      <div className="font-mono text-xs text-primary font-medium mt-0.5">
                        {record.invoiceRef}
                      </div>
                      <div className="text-[11px] text-on-surface-variant">{record.location}</div>
                    </td>
                    <td className="py-space-base px-space-base align-top">
                      <div className="font-bold text-on-surface font-mono">{record.amount}</div>
                      <div className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-sm">account_balance</span>
                        {record.bank}
                      </div>
                    </td>
                    <td className="py-space-base px-space-base align-top max-w-xs">
                      <div className="mb-1">
                        <ConfidenceIndicator value={record.confidence} />
                      </div>
                      <p
                        className={`text-xs font-medium ${
                          record.status === 'unmatched'
                            ? 'text-error'
                            : record.status === 'pending'
                              ? 'text-amber-800'
                              : 'text-on-surface'
                        }`}
                      >
                        {record.aiRecommendation}
                      </p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">
                        {record.recommendationDetail}
                      </p>
                    </td>
                    <td className="py-space-base px-space-base align-top text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onDetails(record)}
                          className="px-2.5 py-1.5 rounded-lg border border-outline-variant/60 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
                          title="View details"
                        >
                          Details
                        </button>
                        {record.status === 'matched' ? (
                          <button
                            type="button"
                            onClick={() => onForceMatch(record)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-colors"
                            title="Re-affirm Match"
                          >
                            Affirm
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => onForceMatch(record)}
                              className="px-2.5 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-dark text-xs font-bold transition-colors shadow-sm"
                              title="Force Match"
                            >
                              Force Match
                            </button>
                            <button
                              type="button"
                              onClick={() => onReject(record)}
                              className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-red-50 transition-colors"
                              title="Reject / Flag"
                            >
                              <span className="material-symbols-outlined text-base">close</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-outline-variant/20">
            {records.map((record) => (
              <div key={record.id} className={`p-space-base space-y-3 ${rowTone[record.status]}`}>
                <div className="flex items-center justify-between">
                  <StatusPill status={record.status} />
                  <div
                    className={`flex items-center gap-1.5 font-mono text-xs font-bold ${
                      record.status === 'matched'
                        ? 'text-emerald-700'
                        : record.status === 'pending'
                          ? 'text-primary'
                          : 'text-amber-700'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {record.status === 'matched'
                        ? 'verified'
                        : record.status === 'pending'
                          ? 'hourglass_top'
                          : 'warning'}
                    </span>
                    {record.confidence.toFixed(1)}% Score
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="font-bold text-on-surface text-base">{record.remitter}</h4>
                    <span className="font-mono font-bold text-on-surface text-sm whitespace-nowrap">
                      {record.amount}
                    </span>
                  </div>
                  <div className="flex items-center gap-space-xs text-xs text-on-surface-variant mt-1">
                    <span className="font-mono text-primary font-semibold">{record.invoiceRef}</span>
                    <span>•</span>
                    <span>{record.bank}</span>
                  </div>
                </div>

                <div
                  className={`rounded-xl p-2.5 text-xs border ${
                    record.status === 'unmatched'
                      ? 'bg-red-50/80 border-red-200/60'
                      : record.status === 'pending'
                        ? 'bg-amber-50/80 border-amber-200/60'
                        : 'bg-surface-container-low border-outline-variant/30'
                  }`}
                >
                  <div className="font-mono text-[11px] text-on-surface-variant">
                    {record.firaRef} • {record.utr}
                  </div>
                  <p
                    className={`font-semibold mt-1 ${
                      record.status === 'unmatched'
                        ? 'text-error'
                        : record.status === 'pending'
                          ? 'text-amber-900'
                          : 'text-on-surface'
                    }`}
                  >
                    {record.aiRecommendation}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-space-xs pt-1">
                  <button
                    type="button"
                    onClick={() => onDetails(record)}
                    className="px-3 py-2 rounded-xl border border-outline-variant/60 text-xs font-bold text-on-surface hover:bg-surface-container transition-colors"
                  >
                    Details
                  </button>
                  {record.status === 'matched' ? (
                    <button
                      type="button"
                      onClick={() => onForceMatch(record)}
                      className="flex-1 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors text-center"
                    >
                      Affirm ✓
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => onForceMatch(record)}
                        className="flex-1 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors shadow-sm text-center"
                      >
                        Force Match
                      </button>
                      <button
                        type="button"
                        onClick={() => onReject(record)}
                        className="px-3 py-2 rounded-xl border border-red-200 text-error hover:bg-red-50 text-xs font-bold transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MatchTable;
