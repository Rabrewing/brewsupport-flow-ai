"use client";

import { useMemo, useState } from "react";
import { demoTickets, knowledgeBase } from "../src/demoData";
import { runSupportFlow } from "../src/supportFlow";

type GovernedDraftApiResponse = {
  ticketId: string;
  draft: string;
  source: "ai" | "deterministic-fallback";
  provider: string;
  model?: string;
  groundedArticleIds: string[];
  rationale: string;
  fallbackReason?: string;
  escalate: boolean;
  escalationReasons: string[];
  confidence: number;
  retrieval: {
    mode: "lexical" | "hybrid" | "lexical-fallback";
    provider?: string;
    model?: string;
    fallbackReason?: string;
  };
  retrieved: Array<{
    articleId: string;
    title: string;
    score: number;
    lexicalScore: number | null;
    semanticScore: number | null;
    strategy: "lexical" | "semantic" | "hybrid";
  }>;
};

type AiDraftState = {
  loading: boolean;
  result?: GovernedDraftApiResponse;
  error?: string;
};

export default function HomePage() {
  const [selectedId, setSelectedId] = useState(demoTickets[0]?.id ?? "");
  const [status, setStatus] = useState<Record<string, "pending" | "approved" | "escalated">>({});
  const [aiDrafts, setAiDrafts] = useState<Record<string, AiDraftState>>({});

  const selected = demoTickets.find((ticket) => ticket.id === selectedId) ?? demoTickets[0];
  const decision = useMemo(() => (selected ? runSupportFlow(selected, knowledgeBase) : null), [selected]);
  const decisions = demoTickets.map((ticket) => ({ ticket, decision: runSupportFlow(ticket, knowledgeBase) }));

  const metrics = {
    total: decisions.length,
    escalations: decisions.filter(({ decision }) => decision.escalate).length,
    avgConfidence:
      decisions.length === 0
        ? 0
        : decisions.reduce((sum, item) => sum + item.decision.confidence, 0) / decisions.length,
    tier3: decisions.filter(({ decision }) => decision.classification.tier === 3).length,
  };

  const vocCounts = new Map<string, number>();
  for (const item of decisions) {
    for (const theme of item.decision.vocThemes) {
      vocCounts.set(theme, (vocCounts.get(theme) ?? 0) + 1);
    }
  }
  const voc = [...vocCounts.entries()].sort((a, b) => b[1] - a[1]);

  if (!selected || !decision) return <main className="shell">No synthetic tickets loaded.</main>;

  const currentStatus = status[selected.id] ?? "pending";
  const aiDraftState = aiDrafts[selected.id];

  function approveTicket() {
    if (!selected || !decision || decision.escalate) return;
    setStatus((current) => ({ ...current, [selected.id]: "approved" }));
  }

  function escalateTicket() {
    if (!selected) return;
    setStatus((current) => ({ ...current, [selected.id]: "escalated" }));
  }

  async function generateAiDraft() {
    const ticketId = selected.id;
    setAiDrafts((current) => ({ ...current, [ticketId]: { loading: true } }));

    try {
      const response = await fetch("/api/governed-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId }),
      });

      if (!response.ok) throw new Error("Draft request failed");
      const result = (await response.json()) as GovernedDraftApiResponse;
      setAiDrafts((current) => ({ ...current, [ticketId]: { loading: false, result } }));
    } catch {
      setAiDrafts((current) => ({
        ...current,
        [ticketId]: { loading: false, error: "The governed AI + RAG workflow could not be generated." },
      }));
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">PUBLIC AI SUPPORT PORTFOLIO</div>
          <h1>BrewSupport Flow AI</h1>
          <p>Human-governed support automation for high-volume SaaS operations.</p>
        </div>
        <div className="safetyBadge">Synthetic data only</div>
      </header>

      <section className="metrics" aria-label="Support metrics">
        <Metric label="Tickets" value={String(metrics.total)} />
        <Metric label="Escalations" value={String(metrics.escalations)} />
        <Metric label="Avg. confidence" value={`${Math.round(metrics.avgConfidence * 100)}%`} />
        <Metric label="Tier 3" value={String(metrics.tier3)} />
      </section>

      <section className="workspace">
        <aside className="panel queue">
          <div className="panelHeader">
            <div>
              <span className="kicker">QUEUE</span>
              <h2>Open tickets</h2>
            </div>
            <span className="countPill">{demoTickets.length}</span>
          </div>

          <div className="ticketList">
            {decisions.map(({ ticket, decision: itemDecision }) => {
              const itemStatus = status[ticket.id] ?? "pending";
              return (
                <button
                  key={ticket.id}
                  className={`ticketCard ${ticket.id === selected.id ? "selected" : ""}`}
                  onClick={() => setSelectedId(ticket.id)}
                >
                  <div className="ticketRow">
                    <span className={`severity severity-${itemDecision.classification.severity}`}>
                      {itemDecision.classification.severity}
                    </span>
                    <span className="ticketId">{ticket.id}</span>
                  </div>
                  <strong>{ticket.subject}</strong>
                  <p>{ticket.body}</p>
                  <div className="ticketMeta">
                    <span>Tier {itemDecision.classification.tier}</span>
                    <span>{Math.round(itemDecision.confidence * 100)}%</span>
                    <span className={`status status-${itemStatus}`}>{itemStatus}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="panel casePanel">
          <div className="panelHeader caseHeader">
            <div>
              <span className="kicker">CASE WORKSPACE</span>
              <h2>{selected.subject}</h2>
              <p className="caseText">{selected.body}</p>
            </div>
            <span className={`tier tier-${decision.classification.tier}`}>Tier {decision.classification.tier}</span>
          </div>

          <div className="analysisGrid">
            <InfoCard title="Classification">
              <div className="bigLabel">{decision.classification.category}</div>
              <div className="minor">Severity: {decision.classification.severity}</div>
              <div className="tagRow">
                {decision.classification.signals.map((signal) => (
                  <span className="tag" key={signal}>{signal}</span>
                ))}
              </div>
            </InfoCard>

            <InfoCard title="Confidence">
              <div className="confidenceValue">{Math.round(decision.confidence * 100)}%</div>
              <div className="confidenceTrack" aria-label="Confidence score">
                <span style={{ width: `${decision.confidence * 100}%` }} />
              </div>
              <div className="minor">Auto-resolution threshold: 65%</div>
            </InfoCard>
          </div>

          <div className="sectionBlock">
            <div className="sectionTitle">
              <span>Deterministic retrieval baseline</span>
              <small>{decision.retrieved.length} lexical KB matches · always available</small>
            </div>
            <div className="kbList">
              {decision.retrieved.length === 0 ? (
                <div className="emptyState">No verified knowledge match. Human clarification required.</div>
              ) : (
                decision.retrieved.map(({ article, score }) => (
                  <article className="kbCard" key={article.id}>
                    <div>
                      <strong>{article.title}</strong>
                      <p>{article.body}</p>
                    </div>
                    <span>{Math.round(score * 100)}%</span>
                  </article>
                ))
              )}
            </div>
          </div>

          <div className="sectionBlock">
            <div className="sectionTitle">
              <span>Deterministic grounded baseline</span>
              <small>Always available · no model dependency</small>
            </div>
            <div className="draftBox">{decision.draft}</div>
          </div>

          <div className="sectionBlock aiDraftSection">
            <div className="sectionTitle aiDraftTitle">
              <div>
                <span>Governed AI + hybrid RAG</span>
                <small>Semantic retrieval · structured output · deterministic policy authority</small>
              </div>
              <button className="aiButton" onClick={generateAiDraft} disabled={aiDraftState?.loading}>
                {aiDraftState?.loading ? "Running…" : aiDraftState?.result ? "Run AI + RAG again" : "Run AI + RAG"}
              </button>
            </div>

            {!aiDraftState?.result && !aiDraftState?.error && (
              <div className="aiEmptyState">
                Run the provider-backed workflow to combine lexical and semantic KB evidence before drafting. If embeddings or drafting are unavailable, the system degrades safely to deterministic retrieval and response behavior.
              </div>
            )}

            {aiDraftState?.error && <div className="aiError">{aiDraftState.error}</div>}

            {aiDraftState?.result && (
              <div className="aiResult">
                <div className="aiMetaRow">
                  <span className={`providerPill provider-${aiDraftState.result.source}`}>
                    {aiDraftState.result.source === "ai" ? "AI validated" : "Safe fallback"}
                  </span>
                  <span>RAG: {aiDraftState.result.retrieval.mode}</span>
                  <span>
                    {aiDraftState.result.retrieval.provider
                      ? `${aiDraftState.result.retrieval.provider} · ${aiDraftState.result.retrieval.model ?? "embedding model"}`
                      : "Deterministic retrieval"}
                  </span>
                </div>

                <div className="kbList">
                  {aiDraftState.result.retrieved.map((item) => (
                    <article className="kbCard" key={item.articleId}>
                      <div>
                        <strong>{item.title}</strong>
                        <p className="minor">
                          {item.strategy} · lexical {item.lexicalScore === null ? "n/a" : `${Math.round(item.lexicalScore * 100)}%`} · semantic {item.semanticScore === null ? "n/a" : `${Math.round(item.semanticScore * 100)}%`}
                        </p>
                      </div>
                      <span>{Math.round(item.score * 100)}%</span>
                    </article>
                  ))}
                </div>

                {aiDraftState.result.retrieval.fallbackReason && (
                  <div className="aiError">Semantic fallback: {aiDraftState.result.retrieval.fallbackReason}</div>
                )}

                <div className="draftBox aiDraftBox">{aiDraftState.result.draft}</div>
                <div className="aiRationale">
                  <strong>Draft rationale</strong>
                  <p>{aiDraftState.result.rationale}</p>
                  {aiDraftState.result.fallbackReason && <p>Draft fallback: {aiDraftState.result.fallbackReason}</p>}
                </div>
              </div>
            )}
          </div>

          {decision.escalate && (
            <div className="escalationBox">
              <strong>Human review required</strong>
              <p>This case cannot be auto-approved because deterministic policy has identified escalation conditions.</p>
              <ul>
                {decision.escalationReasons.map((reason) => <li key={reason}>{reason}</li>)}
              </ul>
            </div>
          )}

          <div className="actionBar">
            <button className="secondaryButton" onClick={escalateTicket}>Escalate to specialist</button>
            <button
              className="primaryButton"
              onClick={approveTicket}
              disabled={decision.escalate}
              title={decision.escalate ? "Deterministic policy requires human escalation" : "Approve grounded draft"}
            >
              {decision.escalate ? "Approval blocked by policy" : "Approve response"}
            </button>
          </div>
          <div className="decisionStatus">Case decision: <strong>{currentStatus}</strong></div>
        </section>

        <aside className="panel intelligence">
          <div className="panelHeader">
            <div>
              <span className="kicker">VOICE OF CUSTOMER</span>
              <h2>Support intelligence</h2>
            </div>
          </div>

          <div className="vocList">
            {voc.map(([theme, count]) => (
              <div className="vocRow" key={theme}>
                <span>{theme}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>

          <div className="sectionBlock compact">
            <div className="sectionTitle"><span>Current case themes</span></div>
            <div className="tagRow">
              {decision.vocThemes.length > 0
                ? decision.vocThemes.map((theme) => <span className="tag" key={theme}>{theme}</span>)
                : <span className="minor">No theme extracted</span>}
            </div>
          </div>

          <div className="principleCard">
            <span className="kicker">OPERATING PRINCIPLE</span>
            <strong>AI may recommend. Policy retains authority.</strong>
            <p>Semantic retrieval can improve context, but security, fraud, disputes, ambiguous answers, and Tier 3 cases remain human-governed.</p>
          </div>
        </aside>
      </section>

      <footer>
        BrewSupport Flow AI · Built by Randy Brewington · Portfolio demonstration · No real customer or billing data
      </footer>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metricCard">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="infoCard">
      <span className="kicker">{title}</span>
      {children}
    </div>
  );
}
