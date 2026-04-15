import React, { useState } from "react";
import AppLayout from "../components/AppLayout";
import { RECOMMENDATIONS, RECOMMENDATION_CATEGORIES } from "../data/recommendations";
import { getScoreColor } from "../utils/helpers";

const TAG_COLORS = { stress: "#ef4444", anxiety: "#f59e0b", depression: "#8b5cf6" };

function RecommendationsPage({ scores }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const allRecs = Object.entries(RECOMMENDATIONS).flatMap(([cat, items]) =>
    items.map((item) => ({ ...item, category: cat }))
  );
  const filtered =
    activeCategory === "all"
      ? allRecs
      : allRecs.filter((r) => r.category === activeCategory);

  return (
    <AppLayout
      title="Recommendations"
      subtitle="Personalized strategies based on your mental health profile"
    >
      {/* ── Score Summary Banner ── */}
      <div
        className="card"
        style={{
          padding: 20,
          marginBottom: 24,
          background: "linear-gradient(135deg, var(--sky), var(--mint))",
          border: "none",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontWeight: 700, color: "var(--gray-900)", marginBottom: 4 }}>
              Based on Your Profile
            </h3>
            <p style={{ fontSize: 13, color: "var(--gray-500)" }}>
              Recommendations tailored to your stress ({scores.stress}), anxiety (
              {scores.anxiety}), and depression ({scores.depression}) scores.
            </p>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {[
              { label: "Stress",     val: scores.stress     },
              { label: "Anxiety",    val: scores.anxiety    },
              { label: "Depression", val: scores.depression },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: getScoreColor(s.val) }}>
                  {s.val}
                </div>
                <div style={{ fontSize: 11, color: "var(--gray-500)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Category Filter ── */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        {RECOMMENDATION_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: "9px 18px",
              borderRadius: 24,
              border: `1.5px solid ${activeCategory === cat.id ? "var(--blue)" : "var(--gray-100)"}`,
              background: activeCategory === cat.id ? "var(--sky)" : "white",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 600,
              color: activeCategory === cat.id ? "var(--blue-dark)" : "var(--gray-500)",
              transition: "all 0.2s",
            }}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* ── Recommendation Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {filtered.map((rec, i) => (
          <div
            key={i}
            className="card"
            style={{ padding: 24, animation: `fadeUp 0.4s ease ${i * 0.06}s both` }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 12,
              }}
            >
              <span style={{ fontSize: 36 }}>{rec.icon}</span>
              {rec.duration && (
                <span
                  style={{
                    background: "var(--sky)",
                    color: "var(--blue-dark)",
                    borderRadius: 20,
                    padding: "4px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  ⏱ {rec.duration}
                </span>
              )}
            </div>
            <h3
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: "var(--gray-900)",
                marginBottom: 8,
              }}
            >
              {rec.title}
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "var(--gray-500)",
                lineHeight: 1.6,
                marginBottom: 14,
              }}
            >
              {rec.desc}
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {rec.tags?.map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: `${TAG_COLORS[tag]}11`,
                    color: TAG_COLORS[tag],
                    borderRadius: 20,
                    padding: "3px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}

export default RecommendationsPage;
