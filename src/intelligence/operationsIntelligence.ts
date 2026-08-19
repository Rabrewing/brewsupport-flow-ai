import type { BillingAuthority } from "../billing/types";
import type { TicketCategory } from "../types";
import type {
  BillingTrend,
  CategoryTrend,
  ConfidenceBand,
  ConfidenceBandId,
  RecurringPattern,
  SupportCaseRecord,
  SupportOperationsIntelligence,
  VoiceOfCustomerAction,
} from "./types";

const CONFIDENCE_BANDS: Array<{ band: ConfidenceBandId; matches: (confidence: number) => boolean }> = [
  { band: "high", matches: (confidence) => confidence >= 0.8 },
  { band: "medium", matches: (confidence) => confidence >= 0.65 && confidence < 0.8 },
  { band: "low", matches: (confidence) => confidence < 0.65 },
];

const BILLING_AUTHORITIES: BillingAuthority[] = [
  "automated-explanation",
  "human-approval-required",
  "specialist-escalation",
];

function round(value: number, digits = 2): number {
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
}

function ratio(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : round(numerator / denominator);
}

function minutesBetween(start: string, end?: string): number | null {
  if (!end) return null;
  const startMs = Date.parse(start);
  const endMs = Date.parse(end);
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs < startMs) return null;
  return round((endMs - startMs) / 60_000, 1);
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[middle] ?? null;
  return round(((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2, 1);
}

function observedDaySpan(records: SupportCaseRecord[]): number {
  const received = records
    .map((record) => Date.parse(record.observation.receivedAt))
    .filter((value) => Number.isFinite(value));
  if (received.length === 0) return 1;

  const start = new Date(Math.min(...received));
  const end = new Date(Math.max(...received));
  const startDay = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  const endDay = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate());
  return Math.max(1, Math.floor((endDay - startDay) / 86_400_000) + 1);
}

function buildCategoryTrends(records: SupportCaseRecord[]): CategoryTrend[] {
  const categories = new Map<TicketCategory, SupportCaseRecord[]>();
  for (const record of records) {
    const category = record.decision.classification.category;
    categories.set(category, [...(categories.get(category) ?? []), record]);
  }

  return [...categories.entries()]
    .map(([category, categoryRecords]) => ({
      category,
      count: categoryRecords.length,
      share: ratio(categoryRecords.length, records.length),
      escalationRate: ratio(categoryRecords.filter((record) => record.decision.escalate).length, categoryRecords.length),
      averageConfidence: round(
        categoryRecords.reduce((sum, record) => sum + record.decision.confidence, 0) / categoryRecords.length,
      ),
    }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
}

function buildBillingTrend(records: SupportCaseRecord[]): BillingTrend {
  const billingRecords = records.filter((record) => Boolean(record.decision.billing));
  return {
    totalCases: billingRecords.length,
    share: ratio(billingRecords.length, records.length),
    byAuthority: BILLING_AUTHORITIES.map((authority) => {
      const count = billingRecords.filter((record) => record.decision.billing?.authority === authority).length;
      return { authority, count, share: ratio(count, billingRecords.length) };
    }),
  };
}

function buildConfidenceBands(records: SupportCaseRecord[]): ConfidenceBand[] {
  return CONFIDENCE_BANDS.map(({ band, matches }) => {
    const count = records.filter((record) => matches(record.decision.confidence)).length;
    return { band, count, share: ratio(count, records.length) };
  });
}

type ThemeAccumulator = {
  count: number;
  escalations: number;
  confidenceTotal: number;
};

function collectThemes(records: SupportCaseRecord[]): Map<string, ThemeAccumulator> {
  const themes = new Map<string, ThemeAccumulator>();
  for (const record of records) {
    for (const theme of new Set(record.decision.vocThemes)) {
      const current = themes.get(theme) ?? { count: 0, escalations: 0, confidenceTotal: 0 };
      current.count += 1;
      current.escalations += record.decision.escalate ? 1 : 0;
      current.confidenceTotal += record.decision.confidence;
      themes.set(theme, current);
    }
  }
  return themes;
}

function patternRecommendation(theme: string, escalationRate: number, averageConfidence: number): string {
  if (escalationRate >= 0.5) {
    return `Investigate the root cause behind ${theme} and strengthen the specialist, product, or knowledge workflow before increasing automation.`;
  }
  if (averageConfidence < 0.7) {
    return `Improve verified knowledge and retrieval coverage for ${theme} before expanding self-service or automated resolution.`;
  }
  return `Turn the repeated ${theme} resolution path into clearer self-service guidance and monitor whether ticket volume declines.`;
}

function buildRecurringPatterns(records: SupportCaseRecord[], themes: Map<string, ThemeAccumulator>): RecurringPattern[] {
  return [...themes.entries()]
    .filter(([, value]) => value.count >= 2)
    .map(([theme, value]) => {
      const escalationRate = ratio(value.escalations, value.count);
      const averageConfidence = round(value.confidenceTotal / value.count);
      return {
        theme,
        count: value.count,
        share: ratio(value.count, records.length),
        escalationRate,
        averageConfidence,
        recommendation: patternRecommendation(theme, escalationRate, averageConfidence),
      };
    })
    .sort((a, b) => b.count - a.count || b.escalationRate - a.escalationRate || a.theme.localeCompare(b.theme));
}

function actionPriority(count: number, share: number, escalationRate: number): VoiceOfCustomerAction["priority"] {
  if (count >= 3 && (share >= 0.25 || escalationRate >= 0.4)) return "act";
  if (count >= 2 || escalationRate >= 0.5) return "review";
  return "watch";
}

function buildVocActions(records: SupportCaseRecord[], themes: Map<string, ThemeAccumulator>): VoiceOfCustomerAction[] {
  return [...themes.entries()]
    .map(([theme, value]) => {
      const share = ratio(value.count, records.length);
      const escalationRate = ratio(value.escalations, value.count);
      const averageConfidence = round(value.confidenceTotal / value.count);
      const priority = actionPriority(value.count, share, escalationRate);
      return {
        theme,
        priority,
        evidence: `${value.count} of ${records.length} cases (${Math.round(share * 100)}%); ${Math.round(escalationRate * 100)}% escalation; ${Math.round(averageConfidence * 100)}% average confidence.`,
        recommendedAction: patternRecommendation(theme, escalationRate, averageConfidence),
      };
    })
    .sort((a, b) => {
      const priorityRank = { act: 3, review: 2, watch: 1 } as const;
      return priorityRank[b.priority] - priorityRank[a.priority] || a.theme.localeCompare(b.theme);
    })
    .slice(0, 5);
}

export function buildSupportOperationsIntelligence(records: SupportCaseRecord[]): SupportOperationsIntelligence {
  const totalCases = records.length;
  const resolvedCases = records.filter((record) => record.observation.outcome === "resolved").length;
  const escalatedCases = records.filter((record) => record.decision.escalate).length;
  const openCases = records.filter((record) => record.observation.outcome === "open").length;
  const reopenedCases = records.filter((record) => record.observation.reopened).length;

  const firstResponseMinutes = records
    .map((record) => minutesBetween(record.observation.receivedAt, record.observation.firstResponseAt))
    .filter((value): value is number => value !== null);
  const resolutionMinutes = records
    .map((record) => minutesBetween(record.observation.receivedAt, record.observation.resolvedAt))
    .filter((value): value is number => value !== null);

  const observedDays = observedDaySpan(records);
  const themes = collectThemes(records);

  return {
    summary: {
      totalCases,
      resolvedCases,
      escalatedCases,
      openCases,
      resolutionRate: ratio(resolvedCases, totalCases),
      escalationRate: ratio(escalatedCases, totalCases),
      averageConfidence:
        totalCases === 0 ? 0 : round(records.reduce((sum, record) => sum + record.decision.confidence, 0) / totalCases),
      medianFirstResponseMinutes: median(firstResponseMinutes),
      medianResolutionMinutes: median(resolutionMinutes),
      averageDailyIntake: round(totalCases / observedDays, 1),
      averageDailyResolved: round(resolvedCases / observedDays, 1),
      reopenedCases,
    },
    categoryTrends: buildCategoryTrends(records),
    billingTrend: buildBillingTrend(records),
    confidenceBands: buildConfidenceBands(records),
    recurringPatterns: buildRecurringPatterns(records, themes),
    vocActions: buildVocActions(records, themes),
  };
}
