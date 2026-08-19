import type { BillingAuthority } from "../billing/types";
import type { SupportDecision, SupportTicket, TicketCategory } from "../types";

export type SupportCaseOutcome = "resolved" | "escalated" | "open";
export type ConfidenceBandId = "high" | "medium" | "low";

export interface SupportCaseObservation {
  ticketId: string;
  receivedAt: string;
  firstResponseAt?: string;
  resolvedAt?: string;
  outcome: SupportCaseOutcome;
  reopened?: boolean;
}

export interface SupportCaseRecord {
  ticket: SupportTicket;
  decision: SupportDecision;
  observation: SupportCaseObservation;
}

export interface OperationsSummary {
  totalCases: number;
  resolvedCases: number;
  escalatedCases: number;
  openCases: number;
  resolutionRate: number;
  escalationRate: number;
  averageConfidence: number;
  medianFirstResponseMinutes: number | null;
  medianResolutionMinutes: number | null;
  averageDailyIntake: number;
  averageDailyResolved: number;
  reopenedCases: number;
}

export interface CategoryTrend {
  category: TicketCategory;
  count: number;
  share: number;
  escalationRate: number;
  averageConfidence: number;
}

export interface BillingTrend {
  totalCases: number;
  share: number;
  byAuthority: Array<{
    authority: BillingAuthority;
    count: number;
    share: number;
  }>;
}

export interface ConfidenceBand {
  band: ConfidenceBandId;
  count: number;
  share: number;
}

export interface RecurringPattern {
  theme: string;
  count: number;
  share: number;
  escalationRate: number;
  averageConfidence: number;
  recommendation: string;
}

export interface VoiceOfCustomerAction {
  theme: string;
  priority: "watch" | "review" | "act";
  evidence: string;
  recommendedAction: string;
}

export interface SupportOperationsIntelligence {
  summary: OperationsSummary;
  categoryTrends: CategoryTrend[];
  billingTrend: BillingTrend;
  confidenceBands: ConfidenceBand[];
  recurringPatterns: RecurringPattern[];
  vocActions: VoiceOfCustomerAction[];
}
