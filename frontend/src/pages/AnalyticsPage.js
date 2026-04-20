import React, { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { TrendChart } from "../components/Charts";
import { getRiskLevel } from "../utils/helpers";
import { WEEKLY_TRENDS } from "../data/mockData";
import { getTeacherAnalytics } from "../utils/api";

function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      const res = await getTeacherAnalytics();
      if (res && res.success) setData(res);
      setLoading(false);
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <AppLayout title="Analytics" subtitle="Loading data streams...">
        <div style={{ padding: 40, textAlign: "center" }}>Loading metrics...</div>
      </AppLayout>
    );
  }

  if (!data) return <AppLayout title="Analytics" subtitle="Failed to load." />;

  const { deptBreakdown } = data;

  return (
    <AppLayout
      title="Analytics"
      subtitle="Class-wide mental health trends and targeted department insights"
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, color: "var(--gray-900)", marginBottom: 8 }}>Anxiety Trend — 4 Weeks</h3>
          <TrendChart data={WEEKLY_TRENDS.map((w) => ({ value: w.anxiety }))} color="#f59e0b" />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            {WEEKLY_TRENDS.map((w, i) => <span key={i} style={{ fontSize: 11, color: "var(--gray-300)" }}>{w.week}</span>)}
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, color: "var(--gray-900)", marginBottom: 8 }}>Depression Trend — 4 Weeks</h3>
          <TrendChart data={WEEKLY_TRENDS.map((w) => ({ value: w.depression }))} color="#8b5cf6" />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            {WEEKLY_TRENDS.map((w, i) => <span key={i} style={{ fontSize: 11, color: "var(--gray-300)" }}>{w.week}</span>)}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Department Breakdown</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--gray-100)" }}>
                {["Department", "Avg Stress", "Avg Anxiety", "Avg Depression", "Risk Level"].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deptBreakdown && deptBreakdown.map((row, i) => {
                const maxScore = Math.max(row.avgStress || 0, row.avgAnxiety || 0, row.avgDepression || 0);
                const risk = getRiskLevel(maxScore);
                return (
                  <tr key={i} style={{ borderBottom: "1px solid var(--gray-50)" }}>
                    <td style={{ padding: "14px 16px", fontWeight: 600, color: "var(--gray-900)" }}>{row.dept}</td>
                    <td style={{ padding: "14px 16px" }}><span style={{ color: "#ef4444", fontWeight: 700 }}>{row.avgStress}</span></td>
                    <td style={{ padding: "14px 16px" }}><span style={{ color: "#f59e0b", fontWeight: 700 }}>{row.avgAnxiety}</span></td>
                    <td style={{ padding: "14px 16px" }}><span style={{ color: "#8b5cf6", fontWeight: 700 }}>{row.avgDepression}</span></td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ background: risk.bg, color: risk.color, borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 600 }}>
                        {risk.emoji} {risk.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {(!deptBreakdown || deptBreakdown.length === 0) && (
                <tr>
                  <td colSpan="5" style={{ padding: 20, textAlign: "center", color: "var(--gray-500)" }}>No department data collected yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

export default AnalyticsPage;
