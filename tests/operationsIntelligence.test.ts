import assert from "node:assert/strict";
import test from "node:test";
import { knowledgeBase } from "../src/demoData";
import { buildSupportOperationsIntelligence } from "../src/intelligence/operationsIntelligence";
import {
  buildSyntheticSupportHistory,
  syntheticHistoricalObservations,
  syntheticHistoricalTickets,
} from "../src/intelligence/syntheticSupportHistory";

const records = buildSyntheticSupportHistory(knowledgeBase);

test("synthetic history has one operational observation for every historical ticket", () => {
  assert.equal(syntheticHistoricalTickets.length, 14);
  assert.equal(syntheticHistoricalObservations.length, syntheticHistoricalTickets.length);
  assert.equal(records.length, syntheticHistoricalTickets.length);
  assert.deepEqual(
    new Set(records.map((record) => record.ticket.id)),
    new Set(records.map((record) => record.observation.ticketId)),
  );
});

test("operations summary calculates deterministic throughput and response medians", () => {
  const intelligence = buildSupportOperationsIntelligence(records);
  assert.equal(intelligence.summary.totalCases, 14);
  assert.equal(intelligence.summary.resolvedCases, 7);
  assert.equal(intelligence.summary.openCases, 2);
  assert.equal(intelligence.summary.resolutionRate, 0.5);
  assert.equal(intelligence.summary.medianFirstResponseMinutes, 7);
  assert.equal(intelligence.summary.medianResolutionMinutes, 28);
  assert.equal(intelligence.summary.averageDailyIntake, 4.7);
  assert.equal(intelligence.summary.averageDailyResolved, 2.3);
  assert.equal(intelligence.summary.reopenedCases, 2);
});

test("category trends expose billing concentration and policy escalation rate", () => {
  const intelligence = buildSupportOperationsIntelligence(records);
  const billing = intelligence.categoryTrends.find((trend) => trend.category === "billing");
  assert.ok(billing);
  assert.equal(billing.count, 8);
  assert.equal(billing.share, 0.57);
  assert.ok(billing.averageConfidence > 0);
  assert.ok(billing.escalationRate > 0);
});

test("billing intelligence separates explanation, human approval, and specialist authority", () => {
  const intelligence = buildSupportOperationsIntelligence(records);
  assert.equal(intelligence.billingTrend.totalCases, 8);
  assert.equal(intelligence.billingTrend.share, 0.57);
  const authorityCounts = Object.fromEntries(
    intelligence.billingTrend.byAuthority.map((item) => [item.authority, item.count]),
  );
  assert.equal(authorityCounts["automated-explanation"], 4);
  assert.equal(authorityCounts["human-approval-required"], 3);
  assert.equal(authorityCounts["specialist-escalation"], 1);
});

test("confidence distribution accounts for every case exactly once", () => {
  const intelligence = buildSupportOperationsIntelligence(records);
  assert.equal(
    intelligence.confidenceBands.reduce((sum, band) => sum + band.count, 0),
    intelligence.summary.totalCases,
  );
  assert.equal(
    Number(intelligence.confidenceBands.reduce((sum, band) => sum + band.share, 0).toFixed(2)),
    1,
  );
});

test("recurring issue patterns aggregate VOC themes into actionable evidence", () => {
  const intelligence = buildSupportOperationsIntelligence(records);
  const billingPattern = intelligence.recurringPatterns.find((pattern) => pattern.theme === "billing");
  assert.ok(billingPattern);
  assert.equal(billingPattern.count, 8);
  assert.match(billingPattern.recommendation, /billing/i);
  assert.ok(intelligence.vocActions.some((action) => action.theme === "billing" && action.priority === "act"));
});

test("invalid or reversed timestamps are excluded from latency metrics rather than corrupting them", () => {
  const [record] = records;
  assert.ok(record);
  const invalid = {
    ...record,
    observation: {
      ...record.observation,
      receivedAt: "2026-08-16T13:00:00Z",
      firstResponseAt: "2026-08-16T12:00:00Z",
      resolvedAt: "not-a-date",
    },
  };
  const intelligence = buildSupportOperationsIntelligence([invalid]);
  assert.equal(intelligence.summary.medianFirstResponseMinutes, null);
  assert.equal(intelligence.summary.medianResolutionMinutes, null);
});

test("operations intelligence is deterministic for the same support evidence", () => {
  const first = buildSupportOperationsIntelligence(records);
  const second = buildSupportOperationsIntelligence(records);
  assert.deepEqual(second, first);
  assert.equal(
    first.summary.escalatedCases,
    records.filter((record) => record.decision.escalate).length,
  );
});
