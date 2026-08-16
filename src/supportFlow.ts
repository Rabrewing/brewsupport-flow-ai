import type {
  Classification,
  KnowledgeArticle,
  RetrievalResult,
  SupportDecision,
  SupportTicket,
  TicketCategory,
} from "./types";

const HIGH_RISK_TERMS = [
  "chargeback",
  "dispute",
  "fraud",
  "hacked",
  "security",
  "breach",
  "data loss",
  "deleted all",
  "legal",
  "lawyer",
];

const CATEGORY_TERMS: Record<TicketCategory, string[]> = {
  billing: ["billing", "charged", "refund", "subscription", "invoice", "payment", "upgrade", "downgrade", "stripe"],
  account: ["login", "password", "account", "locked", "access", "email"],
  bug: ["bug", "error", "broken", "crash", "failed", "not working"],
  how_to: ["how do i", "how to", "where can i", "help me", "instructions"],
  security: ["security", "hacked", "breach", "fraud", "suspicious"],
  feedback: ["feedback", "feature request", "wish", "suggestion", "would love"],
  other: [],
};

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

function words(value: string): Set<string> {
  return new Set(normalize(value).split(/\s+/).filter(Boolean));
}

export function classifyTicket(ticket: SupportTicket): Classification {
  const text = normalize(`${ticket.subject} ${ticket.body}`);
  const signals: string[] = [];
  let bestCategory: TicketCategory = "other";
  let bestScore = 0;

  for (const [category, terms] of Object.entries(CATEGORY_TERMS) as [TicketCategory, string[]][]) {
    const score = terms.reduce((total, term) => total + (text.includes(term) ? 1 : 0), 0);
    if (score > bestScore) {
      bestCategory = category;
      bestScore = score;
    }
  }

  if (bestScore > 0) signals.push(`matched:${bestCategory}`);
  const highRisk = HIGH_RISK_TERMS.filter((term) => text.includes(term));
  signals.push(...highRisk.map((term) => `risk:${term}`));

  if (bestCategory === "security" || highRisk.length > 0) {
    return { category: bestCategory === "other" ? "security" : bestCategory, severity: "critical", tier: 3, signals };
  }

  if (bestCategory === "bug") return { category: bestCategory, severity: "high", tier: 3, signals };
  if (bestCategory === "billing" || bestCategory === "account") {
    return { category: bestCategory, severity: "medium", tier: 2, signals };
  }

  return { category: bestCategory, severity: "low", tier: 1, signals };
}

export function retrieveKnowledge(ticket: SupportTicket, articles: KnowledgeArticle[], limit = 3): RetrievalResult[] {
  const queryWords = words(`${ticket.subject} ${ticket.body}`);

  return articles
    .map((article) => {
      const articleWords = words(`${article.title} ${article.body} ${article.tags.join(" ")}`);
      const overlap = [...queryWords].filter((word) => articleWords.has(word)).length;
      const score = queryWords.size === 0 ? 0 : overlap / queryWords.size;
      return { article, score: Number(score.toFixed(3)) };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function scoreConfidence(classification: Classification, retrieved: RetrievalResult[]): number {
  const retrieval = retrieved[0]?.score ?? 0;
  let confidence = 0.45 + Math.min(retrieval, 0.35);
  if (classification.category !== "other") confidence += 0.1;
  if (classification.tier === 3) confidence -= 0.15;
  if (classification.signals.some((signal) => signal.startsWith("risk:"))) confidence -= 0.2;
  return Number(Math.max(0, Math.min(1, confidence)).toFixed(2));
}

export function determineEscalation(classification: Classification, confidence: number): string[] {
  const reasons: string[] = [];
  if (classification.tier === 3) reasons.push("tier-3 technical or high-risk issue");
  if (classification.signals.some((signal) => signal.startsWith("risk:"))) reasons.push("high-risk policy signal");
  if (confidence < 0.65) reasons.push("confidence below auto-resolution threshold");
  return reasons;
}

export function summarizeVoc(ticket: SupportTicket, classification: Classification): string[] {
  const text = normalize(`${ticket.subject} ${ticket.body}`);
  const themes = new Set<string>();
  if (classification.category !== "other") themes.add(classification.category);
  if (text.includes("upgrade") || text.includes("subscription")) themes.add("subscription lifecycle");
  if (text.includes("login") || text.includes("access")) themes.add("account access friction");
  if (text.includes("slow") || text.includes("timeout")) themes.add("performance");
  if (text.includes("confusing") || text.includes("unclear")) themes.add("ux clarity");
  return [...themes];
}

export function draftGroundedResponse(ticket: SupportTicket, retrieved: RetrievalResult[], escalate: boolean): string {
  if (escalate) {
    return `Thanks for reporting this. I’ve identified that this issue needs a specialist review before we make changes to your account. I’ve captured the details from ticket ${ticket.id} and would escalate it with the relevant context rather than guess.`;
  }

  const article = retrieved[0]?.article;
  if (!article) {
    return "Thanks for reaching out. I need a little more verified context before giving you instructions, so I would request clarification rather than generate an unsupported answer.";
  }

  return `Thanks for reaching out. Based on our support guidance, the most relevant article is “${article.title}.” ${article.body}`;
}

export function runSupportFlow(ticket: SupportTicket, articles: KnowledgeArticle[]): SupportDecision {
  const classification = classifyTicket(ticket);
  const retrieved = retrieveKnowledge(ticket, articles);
  const confidence = scoreConfidence(classification, retrieved);
  const escalationReasons = determineEscalation(classification, confidence);
  const escalate = escalationReasons.length > 0;

  return {
    classification,
    retrieved,
    confidence,
    escalate,
    escalationReasons,
    draft: draftGroundedResponse(ticket, retrieved, escalate),
    vocThemes: summarizeVoc(ticket, classification),
  };
}
