import React from "react";
import AppLayout   from "../components/AppLayout";
import AlertBanner from "../components/AlertBanner";
import { TrendChart, RadialScore } from "../components/Charts";
import { getRiskLevel, getScoreColor } from "../utils/helpers";
import { WEEKLY_TRENDS } from "../data/mockData";

function StudentDashboard({ user, scores, onNavigate, alertDismissed, setAlertDismissed }) {
  const quickActions = [
    { label: "Stress Test",   icon: "😤", page: "stress-test",     color: "#ef4444"       },
    { label: "Talk to Mira",  icon: "💬", page: "chatbot",          color: "var(--blue)"   },
    { label: "Write Journal", icon: "📔", page: "journal",          color: "var(--violet)" },
    { label: "Get Tips",      icon: "🌟", page: "recommendations",  color: "var(--sage)"   },
  ];

  return (
    <AppLayout
      title={`Hello, ${user?.name?.split(" ")[0]} 👋`}
      subtitle="Here's your mental wellness overview for this week"
    >
      {!alertDismissed && (
        <AlertBanner scores={scores} onDismiss={() => setAlertDismissed(true)} />
      )}

      {/* ── Score Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {[
          { key: "stress",     label: "Stress",     icon: "😤" },
          { key: "anxiety",    label: "Anxiety",    icon: "😰" },
          { key: "depression", label: "Depression", icon: "😞" },
        ].map((card) => {
          const score = scores[card.key];
          const risk  = getRiskLevel(score);
          const color = getScoreColor(score);
          return (
            <div
              key={card.key}
              className="card"
              style={{ padding: 24, animation: "fadeUp 0.5s ease both" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--gray-500)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: 4,
                    }}
                  >
                    {card.label}
                  </div>
                  <div
                    style={{
                      fontSize: 36,
                      fontWeight: 700,
                      color,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {score}
                  </div>
                </div>
                <span style={{ fontSize: 28 }}>{card.icon}</span>
              </div>
              <div
                style={{
                  background: risk.bg,
                  color: risk.color,
                  borderRadius: 20,
                  padding: "4px 10px",
                  display: "inline-block",
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 12,
                }}
              >
                {risk.emoji} {risk.label}
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
                    width: `${score}%`,
                    background: `linear-gradient(90deg, ${color}88, ${color})`,
                    borderRadius: 3,
                    transition: "width 1s ease",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Trend + Radial ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div className="card" style={{ padding: 24 }}>
          <h3
            style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: "var(--gray-900)" }}
          >
            4-Week Stress Trend
          </h3>
          <p style={{ fontSize: 12, color: "var(--gray-300)", marginBottom: 16 }}>
            Your stress levels over time
          </p>
          <TrendChart
            data={WEEKLY_TRENDS.map((w) => ({ value: w.stress }))}
            color="#ef4444"
          />
          <div
            style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}
          >
            {WEEKLY_TRENDS.map((w, i) => (
              <span key={i} style={{ fontSize: 10, color: "var(--gray-300)" }}>
                {w.week}
              </span>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h3
            style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "var(--gray-900)" }}
          >
            Current Scores
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              alignItems: "center",
            }}
          >
            <RadialScore score={scores.stress}     label="Stress"     color={getScoreColor(scores.stress)}     size={100} />
            <RadialScore score={scores.anxiety}    label="Anxiety"    color={getScoreColor(scores.anxiety)}    size={100} />
            <RadialScore score={scores.depression} label="Depression" color={getScoreColor(scores.depression)} size={100} />
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="card" style={{ padding: 24 }}>
        <h3
          style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "var(--gray-900)" }}
        >
          Quick Actions
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
          }}
        >
          {quickActions.map((a) => (
            <button
              key={a.page}
              onClick={() => onNavigate(a.page)}
              style={{
                padding: "16px 12px",
                borderRadius: "var(--radius-sm)",
                border: `1.5px solid ${a.color}22`,
                background: `${a.color}0f`,
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s",
                fontFamily: "var(--font-body)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform  = "translateY(-2px)";
                e.currentTarget.style.boxShadow  = "var(--shadow-md)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform  = "translateY(0)";
                e.currentTarget.style.boxShadow  = "none";
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{a.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: a.color }}>{a.label}</div>
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

export default StudentDashboard;
