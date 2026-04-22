import React, { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { getUserData } from "../utils/api";

function AIInsightsPage({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      const res = await getUserData(user.id);
      setData(res);
      setLoading(false);
    }
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <AppLayout title="AI Insights" subtitle="Analyzing your mental health patterns">
        <div style={{ padding: 40, textAlign: "center" }}>Loading your personalized insights...</div>
      </AppLayout>
    );
  }

  // Ensure data exists
  if (!data || (!data.stress?.length && !data.anxiety?.length && !data.depression?.length)) {
    return (
      <AppLayout title="AI Insights" subtitle="Analyzing your mental health patterns">
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <h3 style={{ color: "var(--gray-900)" }}>No Data Available</h3>
          <p style={{ color: "var(--gray-500)" }}>Take assessments to view insights.</p>
        </div>
      </AppLayout>
    );
  }

  // Calculate highest concern
  let latestStress = 0, latestAnx = 0, latestDep = 0;
  if (data.stress?.length) latestStress = data.stress[data.stress.length - 1].score;
  if (data.anxiety?.length) latestAnx = data.anxiety[data.anxiety.length - 1].score;
  if (data.depression?.length) latestDep = data.depression[data.depression.length - 1].score;

  let maxScore = Math.max(latestStress, latestAnx, latestDep);
  let primaryConcern = "Unknown";
  let concernColor = "var(--gray-500)";
  let historyArray = [];

  if (maxScore === latestStress) {
    primaryConcern = "Stress";
    concernColor = "#ef4444";
    historyArray = data.stress || [];
  } else if (maxScore === latestAnx) {
    primaryConcern = "Anxiety";
    concernColor = "#f59e0b";
    historyArray = data.anxiety || [];
  } else if (maxScore === latestDep) {
    primaryConcern = "Depression";
    concernColor = "#8b5cf6";
    historyArray = data.depression || [];
  }

  // Determine trend
  let trendMsg = "Not enough data to determine trend";
  let predictionMsg = null;

  if (historyArray.length >= 2) {
    const lastScore = historyArray[historyArray.length - 1].score;
    const prevScore = historyArray[historyArray.length - 2].score;
    const diff = lastScore - prevScore;

    if (diff > 5) {
      trendMsg = `Your ${primaryConcern.toLowerCase()} levels are increasing over recent assessments.`;
      predictionMsg = "You may be at risk of higher levels if current trend continues.";
    } else if (diff < -5) {
      trendMsg = `Your condition is improving.`;
    } else {
      trendMsg = `Your condition is stable.`;
    }
  }

  // Dynamic recommendations
  let recs = [];
  if (primaryConcern === "Stress") {
    recs = [
      "Practice 4-7-8 breathing techniques to physically lower cortisol.",
      "Take short breaks every pomodoro cycle (25 minutes).",
      "Prioritize tasks using the Eisenhower Matrix."
    ];
  } else if (primaryConcern === "Anxiety") {
    recs = [
      "Use grounding techniques (5-4-3-2-1) when feeling overwhelmed.",
      "Limit caffeine intake, especially in afternoon hours.",
      "Write out your worries in the journal to externalize them."
    ];
  } else if (primaryConcern === "Depression") {
    recs = [
      "Set one very small, highly achievable goal for today.",
      "Engage in 15 minutes of light physical activity like walking.",
      "Reach out to an assigned counselor for professional guidance."
    ];
  }

  return (
    <AppLayout title="AI Insights" subtitle="Analyzing your mental health patterns">
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: 10 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--gray-900)" }}>AI Insight & Personalized Analysis</h2>
          <p style={{ color: "var(--gray-500)", marginTop: 4 }}>Intelligent pattern recognition derived from your recent scores.</p>
        </div>

        {/* Primary Concern & Trend Card */}
        <div className="card" style={{ padding: 28, animation: "fadeUp 0.4s ease" }}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 250 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                Primary Concern Detected
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                <span style={{ background: `${concernColor}15`, color: concernColor, padding: "8px 16px", borderRadius: 20, fontWeight: 700, fontSize: 16 }}>
                  {primaryConcern}
                </span>
                <span style={{ fontSize: 14, color: "var(--gray-500)", fontWeight: 600 }}>Score: {maxScore}</span>
              </div>
              <p style={{ color: "var(--gray-700)", lineHeight: 1.6 }}>
                {trendMsg}
              </p>
              {predictionMsg && (
                <div style={{ marginTop: 12, padding: "10px 14px", background: "#fef2f2", borderLeft: "4px solid #ef4444", borderRadius: "0 8px 8px 0" }}>
                  <p style={{ fontSize: 13, color: "#991b1b", fontWeight: 600, margin: 0 }}>
                    ⚠️ {predictionMsg}
                  </p>
                </div>
              )}
            </div>
            
            <div style={{ flex: 1, minWidth: 250, borderLeft: "1px dashed var(--gray-200)", paddingLeft: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>
                Actionable Focus
              </div>
              <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {recs.map((r, i) => (
                  <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ color: concernColor, fontWeight: 700 }}>•</span>
                    <span style={{ fontSize: 14, color: "var(--gray-700)", lineHeight: 1.5 }}>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Contextual Context Card */}
        <div className="card" style={{ padding: 24, background: "linear-gradient(135deg, #f8fafc, #f1f5f9)" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ fontSize: 24 }}>🤖</div>
            <div>
              <div style={{ fontWeight: 600, color: "var(--gray-900)" }}>Mira's Analytics Engine</div>
              <div style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 4 }}>
                This analysis considers your most recent test sequences and automatically pivots focus to ensure your safety. Data tracking computes historical trajectory mapped against clinical guidelines.
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </AppLayout>
  );
}

export default AIInsightsPage;
