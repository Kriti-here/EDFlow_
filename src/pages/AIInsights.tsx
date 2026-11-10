import React from 'react';
import Reveal from '../components/common/Reveal';
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
  HeroKPICard,
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
          <AIInsightsHeader />

          <Reveal>
            <EngineStatusCard data={engineStatus} />
          </Reveal>

          <HeroKPICard />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
            <Reveal delay={0.2}>
              <MetricCard
                data={{
                  id: 'speed',
                  label: 'Speed Improvement',
                  value: '1.2s',
                  subtitle: 'vs 45m Manual Review',
                  icon: 'speed',
                  iconColor: 'text-secondary',
                }}
                size="large"
              />
            </Reveal>
            <Reveal delay={0.2}>
              <MetricCard
                data={{
                  id: 'precision',
                  label: 'Overall Precision',
                  value: '98.4%',
                  subtitle: '1,248 Remittance Checks',
                  icon: 'target',
                  iconColor: 'text-primary',
                }}
                size="large"
              />
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
            <Reveal delay={0.3}>
              <MetricCard
                data={{
                  id: 'uptime',
                  label: 'System Uptime',
                  value: '99.98%',
                  subtitle: 'Claude 3.5 + GPT-4o &middot; 420ms',
                  icon: 'neurology',
                  iconColor: 'text-primary',
                }}
                size="medium"
              />
            </Reveal>
            <Reveal delay={0.3}>
              <MetricCard data={metricCards[1]} size="medium" />
            </Reveal>
          </div>

          <Reveal delay={0.4}>
            <ReplayCacheCard data={replayCache} />
          </Reveal>

          <Reveal delay={0.5}>
            <ForensicAuditCard data={forensicAudit} />
          </Reveal>

          <Reveal delay={0.6}>
            <HeuristicsSection
              items={heuristicItems}
              title="Automated Exception Remediation"
              subtitle="2 HEURISTICS ACTIVE"
            />
          </Reveal>

          <Reveal delay={0.7}>
            <ConfidenceDistribution
              bars={confidenceBars}
              title="Inference Distribution & Stability"
              subtitle="Regulatory baseline vs current runtime"
              icon="verified"
            />
          </Reveal>

          <Reveal delay={0.8}>
            <DriftIndicator {...driftInfo} />
          </Reveal>

          <Reveal delay={0.9}>
            <DecisionsSection
              records={decisionRecords}
              tabs={filterTabs}
              title="Human-in-the-Loop Decisions"
              subtitle="Complete audit trail of accepted recommendations and auditor overrides."
            />
          </Reveal>

          <Reveal delay={1.0}>
            <GuardrailsSection items={guardrailItems} />
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
