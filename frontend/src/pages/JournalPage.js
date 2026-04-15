import React, { useState } from "react";
import AppLayout from "../components/AppLayout";
import { RadialScore } from "../components/Charts";
import { getSentimentStyle, getScoreColor } from "../utils/helpers";
import { analyseJournalSentiment, saveJournalEntry } from "../utils/api";

const INITIAL_ENTRIES = [
  {
    id: 1,
    date: "2025-01-20",
    text: "Had a tough day with the project deadline but managed to stay focused. Feeling a bit tired.",
    sentiment: "neutral",
    score: 45,
    reflection: "You showed real resilience today — staying focused under pressure is a strength.",
  },
  {
    id: 2,
    date: "2025-01-19",
    text: "Really enjoyed the study group session today! Feel much more confident about the exam now.",
    sentiment: "positive",
    score: 78,
    reflection: "It's wonderful that connection and collaboration lifted your spirits today.",
  },
];

function JournalPage({ user, entries: propEntries, setEntries: propSetEntries }) {
  const [localEntries, setLocalEntries] = useState(INITIAL_ENTRIES);
  const entries = propEntries || localEntries;
  const setEntries = propSetEntries || setLocalEntries;

  const [newEntry,    setNewEntry]    = useState("");
  const [analyzing,  setAnalyzing]   = useState(false);
  const [expandedId, setExpandedId]  = useState(null);

  const avgWellness = Math.round(
    entries.filter((e) => !e.analyzing).reduce((s, e) => s + (e.score || 50), 0) /
      Math.max(entries.filter((e) => !e.analyzing).length, 1)
  );

  const addEntry = async () => {
    if (!newEntry.trim()) return;
    setAnalyzing(true);

    const tempEntry = {
      id:        Date.now(),
      date:      new Date().toISOString().split("T")[0],
      text:      newEntry,
      sentiment: "neutral",
      score:     50,
      analyzing: true,
    };
    setEntries((prev) => [tempEntry, ...prev]);
    setNewEntry("");

    try {
      const parsed = await analyseJournalSentiment(tempEntry.text);
      setEntries((prev) =>
        prev.map((e) =>
          e.id === tempEntry.id ? { ...e, ...parsed, analyzing: false } : e
        )
      );
      // Optionally persist to backend
      await saveJournalEntry(user?.id, tempEntry.text, parsed.sentiment, parsed.score);
    } catch {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === tempEntry.id
            ? { ...e, sentiment: "neutral", score: 50, analyzing: false }
            : e
        )
      );
    }
    setAnalyzing(false);
  };

  return (
    <AppLayout
      title="My Journal"
      subtitle="A private space for your thoughts — analyzed with care"
    >
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        {/* ── Left: Write + Entries ── */}
        <div>
          {/* New entry */}
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, color: "var(--gray-900)", marginBottom: 16 }}>
              Today's Entry
            </h3>
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="What's on your mind today? Write freely — this is your private space..."
              style={{ width: "100%", minHeight: 140, resize: "vertical", lineHeight: 1.7 }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 12,
              }}
            >
              <span style={{ fontSize: 12, color: "var(--gray-300)" }}>
                🔒 Private & encrypted. AI analyzes sentiment only.
              </span>
              <button
                className="btn btn-primary"
                onClick={addEntry}
                disabled={!newEntry.trim() || analyzing}
              >
                {analyzing ? "Analyzing..." : "Save & Analyze →"}
              </button>
            </div>
          </div>

          {/* Entries list */}
          {entries.map((entry) => {
            const s = getSentimentStyle(entry.sentiment);
            return (
              <div
                key={entry.id}
                className="card"
                style={{
                  padding: 20,
                  marginBottom: 12,
                  animation: "fadeUp 0.4s ease",
                  cursor: "pointer",
                }}
                onClick={() =>
                  setExpandedId(expandedId === entry.id ? null : entry.id)
                }
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span
                      style={{
                        background: s.bg,
                        color: s.color,
                        borderRadius: 20,
                        padding: "4px 10px",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {s.icon} {s.label}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--gray-300)" }}>
                      Wellness: {entry.score}/100
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--gray-300)" }}>
                    {entry.date}
                  </span>
                </div>

                <p
                  style={{
                    color: "var(--gray-700)",
                    fontSize: 14,
                    lineHeight: 1.6,
                    display: "-webkit-box",
                    WebkitLineClamp: expandedId === entry.id ? "unset" : 2,
                    WebkitBoxOrient: "vertical",
                    overflow: expandedId === entry.id ? "visible" : "hidden",
                  }}
                >
                  {entry.analyzing ? (
                    <em style={{ color: "var(--gray-300)" }}>Analyzing...</em>
                  ) : (
                    entry.text
                  )}
                </p>

                {entry.reflection && expandedId === entry.id && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: 12,
                      background: "var(--sky)",
                      borderRadius: 8,
                      fontSize: 13,
                      color: "var(--blue-dark)",
                      fontStyle: "italic",
                    }}
                  >
                    💙 {entry.reflection}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Right: Insights ── */}
        <div>
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            <h3
              style={{ fontWeight: 700, color: "var(--gray-900)", marginBottom: 16 }}
            >
              Journal Insights
            </h3>
            <RadialScore
              score={avgWellness}
              label="Avg Wellness"
              color={getScoreColor(100 - avgWellness)}
              size={120}
            />
            <div style={{ marginTop: 20 }}>
              {["positive", "neutral", "negative"].map((s) => {
                const count   = entries.filter((e) => e.sentiment === s).length;
                const pct     = Math.round((count / entries.length) * 100) || 0;
                const style   = getSentimentStyle(s);
                return (
                  <div key={s} style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <span style={{ fontSize: 12, fontWeight: 600, color: style.color }}>
                        {style.icon} {style.label}
                      </span>
                      <span style={{ fontSize: 12, color: "var(--gray-300)" }}>
                        {count} entries
                      </span>
                    </div>
                    <div
                      style={{
                        height: 6,
                        background: "var(--gray-100)",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          background: style.color,
                          borderRadius: 3,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: 20,
              background: "linear-gradient(135deg, var(--sky), var(--mint))",
              border: "none",
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>💡</div>
            <p style={{ fontSize: 13, color: "var(--gray-700)", lineHeight: 1.7 }}>
              Journaling for just 15 minutes, 3 times a week can significantly reduce
              stress and improve emotional processing.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default JournalPage;
