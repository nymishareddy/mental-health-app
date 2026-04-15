import React from "react";
import AppLayout from "../components/AppLayout";
import { TrendChart } from "../components/Charts";
import { getRiskLevel } from "../utils/helpers";
import { WEEKLY_TRENDS, DEPT_BREAKDOWN } from "../data/mockData";

function AnalyticsPage() {
  return (
    <AppLayout
      title="Analytics"
      subtitle="Class-wide mental health trends and department insights"
    >
      {/* ── Trend Charts ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, color: "var(--gray-900)", marginBottom: 8 }}>
            Anxiety Trend — 4 Weeks
          </h3>
          <TrendChart
            data={WEEKLY_TRENDS.map((w) => ({ value: w.anxiety }))}
            color="#f59e0b"
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            {WEEKLY_TRENDS.map((w, i) => (
              <span key={i} style={{ fontSize: 11, color: "var(--gray-300)" }}>{w.week}</span>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, color: "var(--gray-900)", marginBottom: 8 }}>
            Depression Trend — 4 Weeks
          </h3>
          <TrendChart
            data={WEEKLY_TRENDS.map((w) => ({ value: w.depression }))}
            color="#8b5cf6"
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            {WEEKLY_TRENDS.map((w, i) => (
              <span key={i} style={{ fontSize: 11, color: "var(--gray-300)" }}>{w.week}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Department Table ── */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>
          Department Breakdown
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--gray-100)" }}>
                {["Department", "Avg Stress", "Avg Anxiety", "Avg Depression", "Risk Level"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 16px",
                        textAlign: "left",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--gray-500)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {DEPT_BREAKDOWN.map((row, i) => {
                const maxScore = Math.max(row.stress, row.anxiety, row.depression);
                const risk     = getRiskLevel(maxScore);
                return (
                  <tr key={i} style={{ borderBottom: "1px solid var(--gray-50)" }}>
                    <td style={{ padding: "14px 16px", fontWeight: 600, color: "var(--gray-900)" }}>
                      {row.dept}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ color: "#ef4444", fontWeight: 700 }}>{row.stress}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ color: "#f59e0b", fontWeight: 700 }}>{row.anxiety}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ color: "#8b5cf6", fontWeight: 700 }}>{row.depression}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          background: risk.bg,
                          color: risk.color,
                          borderRadius: 20,
                          padding: "4px 10px",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {risk.emoji} {risk.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

export default AnalyticsPage;
