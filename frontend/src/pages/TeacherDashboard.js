import React, { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { BarChart, TrendChart } from "../components/Charts";
import { getTeacherAnalytics } from "../utils/api";
import { WEEKLY_TRENDS } from "../data/mockData";

function TeacherDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getTeacherAnalytics();
      if (res && res.success) {
        setData(res);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <AppLayout title="Class Dashboard" subtitle="Aggregating secure assessment data...">
        <div style={{ textAlign: "center", padding: 80, fontSize: 18, color: "var(--gray-500)" }}>
          Loading real-time analytics...
        </div>
      </AppLayout>
    );
  }

  if (!data) {
    return (
      <AppLayout title="Class Dashboard" subtitle="Overview">
        <div style={{ color: "red", padding: 20 }}>
          Failed to load insights. Ensure you are authorized as a teacher.
        </div>
      </AppLayout>
    );
  }

  const { totalStudents, avgStress, avgAnxiety, avgDepression, highRiskStudents } = data;
  
  const highStress = highRiskStudents.filter(r => r.type === 'stress').length;
  const highAnxiety = highRiskStudents.filter(r => r.type === 'anxiety').length;
  const highDepression = highRiskStudents.filter(r => r.type === 'depression').length;

  const getPercent = (count) => totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;

  const summaryStats = [
    { label: "Total Students",  value: totalStudents,             icon: "👥", color: "var(--blue)", sub: "Active records"      },
    { label: "High Stress",     value: `${getPercent(highStress)}%`,     icon: "😤", color: "#ef4444", sub: `${highStress} students` },
    { label: "High Anxiety",    value: `${getPercent(highAnxiety)}%`,    icon: "😰", color: "#f59e0b", sub: `${highAnxiety} students` },
    { label: "High Depression", value: `${getPercent(highDepression)}%`, icon: "😞", color: "#8b5cf6", sub: `${highDepression} students`}
  ];

  return (
    <AppLayout title="Class Dashboard" subtitle="Aggregated mental health insights — Real-time Evaluation">
      <div style={{ background: "var(--mint)", border: "1px solid rgba(56,178,172,0.2)", borderRadius: "var(--radius-sm)", padding: "12px 16px", marginBottom: 24, display: "flex", gap: 10, alignItems: "center" }}>
        <span>🔒</span>
        <span style={{ fontSize: 13, color: "var(--teal)" }}>
          You are viewing aggregate averages tracking only the <strong>latest</strong> test per student. Chat records remain strictly private.
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {summaryStats.map((stat, i) => (
          <div key={i} className="card" style={{ padding: 24, animation: `fadeUp 0.5s ease ${i * 0.1}s both` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>{stat.icon}</span>
              <div style={{ width: 32, height: 32, background: `${stat.color}11`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: stat.color }} />
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: stat.color, fontFamily: "var(--font-body)" }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 4 }}>{stat.label}</div>
            <div style={{ fontSize: 11, color: "var(--gray-300)" }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Active Class Averages</h3>
          <BarChart bars={[ { label: "Stress", value: avgStress, color: "#ef4444" }, { label: "Anxiety", value: avgAnxiety, color: "#f59e0b" }, { label: "Depression", value: avgDepression, color: "#8b5cf6" }]} />
          <div style={{ marginTop: 24 }}>
            {[ { label: "Stress", avg: avgStress, color: "#ef4444" }, { label: "Anxiety", avg: avgAnxiety, color: "#f59e0b" }, { label: "Depression", avg: avgDepression, color: "#8b5cf6" }].map((s) => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: "var(--gray-500)", fontWeight: 600 }}>{s.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 100, height: 6, background: "var(--gray-100)", borderRadius: 3 }}>
                    <div style={{ height: "100%", width: `${s.avg}%`, background: s.color, borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: s.color, width: 28 }}>{s.avg}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, color: "var(--gray-900)", marginBottom: 8 }}>4-Week Class Trend (Stress)</h3>
          <p style={{ fontSize: 12, color: "var(--gray-300)", marginBottom: 16 }}>Average recorded stress inputs over time.</p>
          <TrendChart data={WEEKLY_TRENDS.map((w) => ({ value: w.stress }))} color="#ef4444"/>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            {WEEKLY_TRENDS.map((w, i) => (
              <span key={i} style={{ fontSize: 11, color: "var(--gray-300)" }}>{w.week}</span>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}

export default TeacherDashboard;
