import React from "react";
import AppLayout from "../components/AppLayout";
import { INITIAL_STUDENTS } from "../data/mockData";

function RiskAlertsPage() {
  const flagged = INITIAL_STUDENTS.filter(
    (s) => s.stress >= 70 || s.anxiety >= 70 || s.depression >= 70
  );

  return (
    <AppLayout
      title="Risk Alerts"
      subtitle="Students flagged for high-risk scores — identities shown only to faculty"
    >
      {/* Warning banner */}
      <div
        style={{
          background: "#fef3e8",
          border: "1.5px solid rgba(244,132,95,0.2)",
          borderRadius: "var(--radius-sm)",
          padding: "12px 16px",
          marginBottom: 24,
          display: "flex",
          gap: 10,
        }}
      >
        <span>⚠️</span>
        <span style={{ fontSize: 13, color: "#c2410c" }}>
          These students have been flagged based on repeated high scores. Please
          handle this information with care and sensitivity.
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {flagged.map((student, i) => {
          const risks = [];
          if (student.stress     >= 70) risks.push({ label: `Stress: ${student.stress}`,         color: "#ef4444" });
          if (student.anxiety    >= 70) risks.push({ label: `Anxiety: ${student.anxiety}`,       color: "#f59e0b" });
          if (student.depression >= 70) risks.push({ label: `Depression: ${student.depression}`, color: "#8b5cf6" });

          return (
            <div
              key={i}
              className="card"
              style={{
                padding: 20,
                display: "flex",
                alignItems: "center",
                gap: 16,
                animation: `fadeUp 0.4s ease ${i * 0.1}s both`,
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 44, height: 44,
                  background: "linear-gradient(135deg, #ef4444, #f59e0b)",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontWeight: 700, fontSize: 16, flexShrink: 0,
                }}
              >
                {student.name[0]}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "var(--gray-900)", marginBottom: 4 }}>
                  {student.name}
                </div>
                <div style={{ fontSize: 12, color: "var(--gray-500)" }}>
                  {student.dept} • Week {student.week}
                </div>
              </div>

              {/* Risk badges */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {risks.map((r, j) => (
                  <span
                    key={j}
                    style={{
                      background: `${r.color}11`,
                      color: r.color,
                      borderRadius: 20,
                      padding: "4px 10px",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {r.label}
                  </span>
                ))}
              </div>

              {/* Status badges */}
              <div style={{ display: "flex", gap: 8 }}>
                {student.parentConsent && (
                  <span
                    style={{
                      background: "var(--mint)",
                      color: "var(--teal)",
                      borderRadius: 20,
                      padding: "4px 10px",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    📱 Parent Notified
                  </span>
                )}
                <span
                  style={{
                    background: "#fef3e8",
                    color: "#c2410c",
                    borderRadius: 20,
                    padding: "4px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  🔴 Action Needed
                </span>
              </div>
            </div>
          );
        })}

        {flagged.length === 0 && (
          <div className="card" style={{ padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h3 style={{ color: "#22c55e", marginBottom: 8 }}>No High-Risk Students</h3>
            <p style={{ color: "var(--gray-500)" }}>
              All students are within acceptable ranges this week.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default RiskAlertsPage;
