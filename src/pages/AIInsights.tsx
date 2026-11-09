import React from 'react';
import {
  AIInsightsHeader,
  EngineStatusCard,
  ReplayCacheCard,
  MetricCard,
  ForensicAuditCard,
  HeuristicsSection,
  ConfidenceDistribution,
  DriftIndicator,
  DecisionsSection,
  GuardrailsSection,
} from '../components/aiinsights';
import {
  engineStatus,
  replayCache,
  metricCards,
  forensicAudit,
  heuristicItems,
  confidenceBars,
  driftInfo,
  decisionRecords,
  filterTabs,
  guardrailItems,
} from '../data/aiinsights';

const AIInsights: React.FC = () => {
  return (
    <div className="flex flex-col relative w-full pt-16 pb-24 bg-surface">
      <div className="flex flex-col w-full">
        <div className="w-full max-w-3xl mx-auto px-space-base py-space-md flex flex-col gap-space-lg">
          {/* Header Section */}
          <AIInsightsHeader />

          {/* Global Engine Status Strip */}
          <EngineStatusCard data={engineStatus} />

          {/* Deterministic Replay Card */}
          <ReplayCacheCard data={replayCache} />

          {/* Governance Performance Bento Grid */}
          <div className="grid grid-cols-2 gap-space-sm">
            {metricCards.map((card) => (
              <MetricCard key={card.id} data={card} />
            ))}
          </div>

          {/* Forensic Deep Dive */}
          <ForensicAuditCard data={forensicAudit} />

          {/* Automated Heuristics & Tolerance Resolvers */}
          <HeuristicsSection
            items={heuristicItems}
            title="Automated Exception Remediation"
            subtitle="2 HEURISTICS ACTIVE"
          />

          {/* AI Confidence Distribution & Drift Analysis */}
          <ConfidenceDistribution
            bars={confidenceBars}
            title="Inference Distribution & Stability"
            subtitle="Regulatory baseline vs current runtime"
            icon="verified"
          />

          {/* Drift Indicator */}
          <DriftIndicator {...driftInfo} />

          {/* Human-in-the-Loop Decisions */}
          <DecisionsSection
            records={decisionRecords}
            tabs={filterTabs}
            title="Human-in-the-Loop Decisions"
            subtitle="Complete audit trail of accepted recommendations and auditor overrides."
          />

          {/* Human Oversight Guardrails */}
          <GuardrailsSection items={guardrailItems} />
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
