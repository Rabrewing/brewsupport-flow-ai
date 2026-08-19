import { knowledgeBase } from "../../src/demoData";
import { buildSupportOperationsIntelligence } from "../../src/intelligence/operationsIntelligence";
import { buildSyntheticSupportHistory } from "../../src/intelligence/syntheticSupportHistory";
import styles from "./intelligence.module.css";

const records = buildSyntheticSupportHistory(knowledgeBase);
const intelligence = buildSupportOperationsIntelligence(records);

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function minutes(value: number | null): string {
  return value === null ? "n/a" : `${value}m`;
}

export default function IntelligencePage() {
  const { summary } = intelligence;

  return (
    <main className={styles.shell}>
      <header className={styles.hero}>
        <div>
          <div className={styles.eyebrow}>BSF-5 · SUPPORT OPERATIONS INTELLIGENCE</div>
          <h1>Turn support decisions into operating evidence.</h1>
          <p>
            Deterministic analytics over a synthetic historical support dataset: throughput, latency,
            escalation, category trends, billing authority, confidence distribution, recurring issues,
            and actionable Voice-of-Customer signals.
          </p>
        </div>
        <div className={styles.badge}>Synthetic support history only</div>
      </header>

      <section className={styles.metrics} aria-label="Operations summary">
        <Metric label="Historical cases" value={String(summary.totalCases)} detail="3-day synthetic window" />
        <Metric label="Resolution rate" value={percent(summary.resolutionRate)} detail={`${summary.resolvedCases} resolved`} />
        <Metric label="Policy escalation" value={percent(summary.escalationRate)} detail={`${summary.escalatedCases} cases`} />
        <Metric label="Median first response" value={minutes(summary.medianFirstResponseMinutes)} detail="valid timestamps only" />
        <Metric label="Median resolution" value={minutes(summary.medianResolutionMinutes)} detail="resolved cases" />
        <Metric label="Average confidence" value={percent(summary.averageConfidence)} detail="deterministic support score" />
      </section>

      <section className={styles.grid}>
        <article className={styles.panel}>
          <PanelHeader kicker="THROUGHPUT" title="Flow & latency" />
          <div className={styles.statGrid}>
            <SmallStat label="Daily intake" value={String(summary.averageDailyIntake)} />
            <SmallStat label="Daily resolved" value={String(summary.averageDailyResolved)} />
            <SmallStat label="Open cases" value={String(summary.openCases)} />
            <SmallStat label="Reopened" value={String(summary.reopenedCases)} />
          </div>
          <p className={styles.note}>
            Invalid, missing, or reversed timestamps are excluded from latency calculations rather than
            silently corrupting operational metrics.
          </p>
        </article>

        <article className={styles.panel}>
          <PanelHeader kicker="CATEGORY MIX" title="Volume & escalation" />
          <div className={styles.rows}>
            {intelligence.categoryTrends.map((trend) => (
              <div className={styles.trendRow} key={trend.category}>
                <div className={styles.rowHeading}>
                  <strong>{trend.category.replaceAll("_", " ")}</strong>
                  <span>{trend.count} cases · {percent(trend.share)}</span>
                </div>
                <div className={styles.bar}><span style={{ width: percent(trend.share) }} /></div>
                <div className={styles.rowMeta}>
                  <span>{percent(trend.escalationRate)} escalation</span>
                  <span>{percent(trend.averageConfidence)} avg. confidence</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.panel}>
          <PanelHeader kicker="CONFIDENCE" title="Decision distribution" />
          <div className={styles.rows}>
            {intelligence.confidenceBands.map((band) => (
              <div className={styles.bandRow} key={band.band}>
                <div>
                  <strong>{band.band}</strong>
                  <span>{band.band === "high" ? "80–100%" : band.band === "medium" ? "65–79%" : "Below 65%"}</span>
                </div>
                <div className={styles.bandValue}>{band.count} · {percent(band.share)}</div>
              </div>
            ))}
          </div>
          <p className={styles.note}>
            Confidence is an evidence signal, not permission. Tier 3, security, refund, dispute, and
            other policy conditions can still require human review at higher confidence.
          </p>
        </article>

        <article className={styles.panel}>
          <PanelHeader kicker="BILLING" title="Authority mix" />
          <div className={styles.heroStat}>
            <strong>{intelligence.billingTrend.totalCases}</strong>
            <span>billing-involved cases · {percent(intelligence.billingTrend.share)} of history</span>
          </div>
          <div className={styles.rows}>
            {intelligence.billingTrend.byAuthority.map((item) => (
              <div className={styles.authorityRow} key={item.authority}>
                <span>{item.authority.replaceAll("-", " ")}</span>
                <strong>{item.count} · {percent(item.share)}</strong>
              </div>
            ))}
          </div>
          <p className={styles.note}>
            Billing involvement is tracked independently from primary support category. A chargeback,
            for example, may be a billing case while correctly classifying into a high-risk escalation lane.
          </p>
        </article>
      </section>

      <section className={styles.widePanel}>
        <PanelHeader kicker="RECURRING ISSUES" title="Patterns worth investigating" />
        <div className={styles.patternGrid}>
          {intelligence.recurringPatterns.map((pattern) => (
            <article className={styles.patternCard} key={pattern.theme}>
              <div className={styles.patternTop}>
                <strong>{pattern.theme}</strong>
                <span>{pattern.count} cases</span>
              </div>
              <div className={styles.rowMeta}>
                <span>{percent(pattern.share)} of history</span>
                <span>{percent(pattern.escalationRate)} escalation</span>
                <span>{percent(pattern.averageConfidence)} confidence</span>
              </div>
              <p>{pattern.recommendation}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.widePanel}>
        <PanelHeader kicker="VOICE OF CUSTOMER" title="Action queue" />
        <div className={styles.actionGrid}>
          {intelligence.vocActions.map((action) => (
            <article className={styles.actionCard} key={action.theme}>
              <div className={styles.actionHeader}>
                <strong>{action.theme}</strong>
                <span className={`${styles.priority} ${styles[`priority_${action.priority}`]}`}>{action.priority}</span>
              </div>
              <p className={styles.evidence}>{action.evidence}</p>
              <p>{action.recommendedAction}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.boundary}>
        <div>
          <span className={styles.eyebrow}>ARCHITECTURE BOUNDARY</span>
          <h2>Analytics observes authority. It does not replace it.</h2>
        </div>
        <p>
          BSF-5 consumes deterministic support decisions plus synthetic operational observations. It does
          not change ticket classification, confidence policy, billing authority, escalation requirements,
          AI permissions, or approval state. The intelligence layer can identify patterns and recommend
          areas to investigate; consequential support actions remain governed by the existing workflow.
        </p>
      </section>

      <footer className={styles.footer}>
        BrewSupport Flow AI · BSF-5 portfolio demonstration · No production customer/support/payment data
      </footer>
    </main>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className={styles.metric}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.smallStat}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function PanelHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className={styles.panelHeader}>
      <span>{kicker}</span>
      <h2>{title}</h2>
    </div>
  );
}
