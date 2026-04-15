import React from "react";
import AppLayout from "../components/AppLayout";
import { BarChart, TrendChart } from "../components/Charts";
import { getRiskLevel } from "../utils/helpers";
import { INITIAL_STUDENTS, WEEKLY_TRENDS } from "../data/mockData";

function TeacherDashboard() {
  const total         = INITIAL_STUDENTS.length;
  const highStress    = INITIAL_STUDENTS.filter((s) => s.stress    >= 70).length;
  const highAnxiety   = INITIAL_STUDENTS.filter((s) => s.anxiety   >= 70).length;
  const highDepression= INITIAL_STUDENTS.filter((s) => s.depression>= 70).length;

  const classAvg = {
    stress:     Math.round(INITIAL_STUDENTS.reduce((a, s) => a + s.stress,     0) / total),
    anxiety:    Math.round(INITIAL_STUDENTS.reduce((a, s) => a + s.anxiety,    0) / total),
    depression: Math.round(INITIAL_STUDENTS.reduce((a, s) => a + s.depression, 0) / total),
  };

  const summaryStats = [
    { label: "Total Students", value: total,                                          icon: "👥", color: "var(--blue)",  sub: "Enrolled"          },
    { label: "High Stress",    value: `${Math.round((highStress    / total) * 100)}%`, icon: "😤", color: "#ef4444",     sub: `${highStress} students`    },
    { label: "High Anxiety",   value: `${Math.round((highAnxiety   / total) * 100)}%`, icon: "😰", color: "#f59e0b",     sub: `${highAnxiety} students`   },
    { label: "High Depression",value: `${Math.round((highDepression/ total) * 100)}%`, icon: "😞", color: "#8b5cf6",     sub: `${highDepression} students` },
  ];

  return (
    <AppLayout
      title="Class Dashboard"
      subtitle="Aggregated, anonymized mental health insights — Privacy-protected"
    >
      {/* Privacy notice */}
      <div
        style={{
          background: "var(--mint)",
          border: "1px solid rgba(56,178,172,0.2)",
          borderRadius: "var(--radius-sm)",
          padding: "12px 16px",
          marginBottom: 24,
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <span>🔒</span>
        <span style={{ fontSize: 13, color: "var(--teal)" }}>
          You are viewing aggregated, anonymized data only. Individual student data,
          journals, and chats are private.
        </span>
      </div>

      {/* ── Summary Stats ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {summaryStats.map((stat, i) => (
          <div
            key={i}
            className="card"
            style={{ padding: 24, animation: `fadeUp 0.5s ease ${i * 0.1}s both` }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <span style={{ fontSize: 28 }}>{stat.icon}</span>
              <div
                style={{
                  width: 32, height: 32,
                  background: `${stat.color}11`,
                  borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <div
                  style={{ width: 8, height: 8, borderRadius: "50%", background: stat.color }}
                />
              </div>
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: stat.color,
                fontFamily: "var(--font-body)",
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 4 }}>
              {stat.label}
            </div>
            <div style={{ fontSize: 11, color: "var(--gray-300)" }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Bar chart */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>
            Class Average Scores
          </h3>
          <BarChart
            bars={[
              { label: "Stress",     value: classAvg.stress,     color: "#ef4444" },
              { label: "Anxiety",    value: classAvg.anxiety,    color: "#f59e0b" },
              { label: "Depression", value: classAvg.depression, color: "#8b5cf6" },
            ]}
          />
          <div style={{ marginTop: 16 }}>
            {[
              { label: "Stress",     avg: classAvg.stress,     color: "#ef4444" },
              { label: "Anxiety",    avg: classAvg.anxiety,    color: "#f59e0b" },
              { label: "Depression", avg: classAvg.depression, color: "#8b5cf6" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: 13, color: "var(--gray-500)" }}>{s.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 80, height: 6, background: "var(--gray-100)", borderRadius: 3 }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${s.avg}%`,
                        background: s.color,
                        borderRadius: 3,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: s.color, width: 28 }}>
                    {s.avg}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trend chart */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, color: "var(--gray-900)", marginBottom: 8 }}>
            4-Week Class Trend (Stress)
          </h3>
          <p style={{ fontSize: 12, color: "var(--gray-300)", marginBottom: 16 }}>
            Average stress across all students
          </p>
          <TrendChart
            data={WEEKLY_TRENDS.map((w) => ({ value: w.stress }))}
            color="#ef4444"
          />
          <div
            style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}
          >
            {WEEKLY_TRENDS.map((w, i) => (
              <span key={i} style={{ fontSize: 11, color: "var(--gray-300)" }}>
                {w.week}
              </span>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default TeacherDashboard;
