import React, { useState } from "react";
import AppLayout from "../components/AppLayout";
import { RadialScore } from "../components/Charts";
import { ASSESSMENT_CONFIG } from "../data/questions";
import { calculateScore, getRiskLevel } from "../utils/helpers";
import { getAssessmentInsight } from "../utils/api";
import { submitAssessment } from "../utils/api";

function AssessmentPage({ type, user, onComplete }) {
  const config  = ASSESSMENT_CONFIG[type];
  const totalQ  = config.questions.length;

  const [current,   setCurrent]   = useState(0);
  const [answers,   setAnswers]   = useState({});
  const [phase,     setPhase]     = useState("intro"); // intro | test | result
  const [result,    setResult]    = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [aiInsight, setAiInsight] = useState("");

  const progress = (Object.keys(answers).length / totalQ) * 100;

  const selectAnswer = (qId, optionIndex) => {
    const newAnswers = { ...answers, [qId]: optionIndex };
    setAnswers(newAnswers);
    if (current < totalQ - 1) setTimeout(() => setCurrent((c) => c + 1), 300);
  };

  const submitTest = async () => {
  const vals  = Object.values(answers);
  const score = calculateScore(vals, config.questions[0].options.length - 1);
  const risk  = getRiskLevel(score);

  setLoading(true);
  setPhase("result");
  setResult({ score, risk });

  try {
    const insight = await getAssessmentInsight(type, score, risk.label);
    setAiInsight(insight);
  } catch {
    setAiInsight("");
  }

  
  const res = await submitAssessment(user.id, type, score, answers);
  console.log("SUBMIT RESPONSE:", res);

  onComplete(type, score);
  setLoading(false);
};

  
  if (phase === "intro") {
    return (
      <AppLayout title={config.title} subtitle={config.subtitle}>
        <div className="card animate-fadeUp" style={{ padding: 40, maxWidth: 600, textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 20, animation: "float 3s ease-in-out infinite" }}>
            {config.icon}
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--gray-900)", marginBottom: 12 }}>
            Ready to check in with yourself?
          </h2>
          <p style={{ color: "var(--gray-500)", lineHeight: 1.7, marginBottom: 24 }}>
            This {totalQ}-question assessment helps you understand your current {type} levels.
            There are no right or wrong answers — just be honest with yourself.
            Your responses are private and secure. 🔒
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 32 }}>
            {[`${totalQ} Questions`, "~3 minutes", "Evidence-based"].map((tag) => (
              <span
                key={tag}
                style={{
                  background: config.bg, color: config.color,
                  borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 600,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setPhase("test")}
            style={{ padding: "14px 32px", fontSize: 16 }}
          >
            Begin Assessment →
          </button>
        </div>
      </AppLayout>
    );
  }

  
  if (phase === "test") {
    const q = config.questions[current];
    return (
      <AppLayout title={config.title} subtitle={`Question ${current + 1} of ${totalQ}`}>
        {/* Progress bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "var(--gray-500)" }}>Progress</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: config.color }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div style={{ height: 8, background: "var(--gray-100)", borderRadius: 4, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${config.color}99, ${config.color})`,
                borderRadius: 4,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        <div className="card animate-fadeUp" style={{ padding: 36, maxWidth: 680 }}>
          <div
            style={{
              fontSize: 13, fontWeight: 600, color: config.color,
              marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em",
            }}
          >
            Question {current + 1}
          </div>
          <h2
            style={{
              fontSize: 22, fontWeight: 600, color: "var(--gray-900)",
              lineHeight: 1.4, marginBottom: 32,
            }}
          >
            {q.text}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => selectAnswer(q.id, idx)}
                style={{
                  padding: "16px 20px",
                  borderRadius: "var(--radius-sm)",
                  border: `2px solid ${answers[q.id] === idx ? config.color : "var(--gray-100)"}`,
                  background: answers[q.id] === idx ? config.bg : "white",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  color:      answers[q.id] === idx ? config.color : "var(--gray-700)",
                  fontWeight: answers[q.id] === idx ? 600 : 400,
                  transition: "all 0.2s",
                }}
              >
                <span
                  style={{
                    width: 28, height: 28,
                    border: `2px solid ${answers[q.id] === idx ? config.color : "var(--gray-100)"}`,
                    borderRadius: "50%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                    fontSize: 12,
                    fontWeight: 700,
                    background: answers[q.id] === idx ? config.color : "transparent",
                    color:      answers[q.id] === idx ? "white" : "var(--gray-300)",
                  }}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </button>
            ))}
          </div>

          <div
            style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}
          >
            <button
              className="btn btn-ghost"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
            >
              ← Previous
            </button>
            {current === totalQ - 1 ? (
              <button
                className="btn btn-primary"
                onClick={submitTest}
                disabled={Object.keys(answers).length < totalQ}
              >
                View Results →
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setCurrent((c) => Math.min(totalQ - 1, c + 1))}
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </AppLayout>
    );
  }

  // ── Result Screen ──
  if (phase === "result" && result) {
    const nextSteps =
      result.score >= 80
        ? [
            { icon: "📞", title: "Talk to Counselor", desc: "Schedule a session with the campus counseling center" },
            { icon: "💬", title: "Chat with Mira",    desc: "Our AI chatbot is available 24/7 for support" },
            { icon: "📔", title: "Journal Your Feelings", desc: "Writing can help process difficult emotions" },
          ]
        : result.score >= 50
        ? [
            { icon: "🧘", title: "Try Meditation", desc: "10 minutes daily can reduce symptoms significantly" },
            { icon: "🚶", title: "Take a Walk",    desc: "Physical activity naturally boosts mood" },
            { icon: "💬", title: "Chat with Mira", desc: "Talk through what's on your mind" },
          ]
        : [
            { icon: "✅", title: "Keep It Up",    desc: "Your scores are healthy — maintain your routines" },
            { icon: "📊", title: "Track Weekly",  desc: "Regular assessments help spot trends early" },
            { icon: "🌟", title: "Help Others",   desc: "Check in on your peers too" },
          ];

    return (
      <AppLayout title="Assessment Results" subtitle="Your personalized analysis">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Score card */}
          <div className="card animate-fadeUp" style={{ padding: 36, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{config.icon}</div>
            <div
              style={{
                fontSize: 64, fontWeight: 700,
                color: result.risk.color,
                fontFamily: "var(--font-body)",
                lineHeight: 1,
              }}
            >
              {result.score}
            </div>
            <div style={{ fontSize: 15, color: "var(--gray-500)", marginBottom: 16 }}>
              out of 100
            </div>
            <div
              style={{
                background: result.risk.bg,
                color: result.risk.color,
                borderRadius: 24,
                padding: "8px 20px",
                display: "inline-block",
                fontWeight: 700,
                fontSize: 16,
                marginBottom: 24,
              }}
            >
              {result.risk.emoji} {result.risk.label}
            </div>
            <RadialScore
              score={result.score}
              label={`${type.charAt(0).toUpperCase() + type.slice(1)} Score`}
              color={result.risk.color}
              size={140}
            />
          </div>

          {/* AI Insight */}
          {(loading || aiInsight) && (
            <div
              className="card animate-fadeUp"
              style={{ padding: 36, display: "flex", flexDirection: "column" }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20 }}>
                <div
                  style={{
                    width: 40, height: 40,
                    background: "linear-gradient(135deg, var(--blue), var(--teal))",
                    borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, flexShrink: 0,
                  }}
                >
                  🤖
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--gray-900)" }}>
                    Mira's Analysis
                  </div>
                  <div style={{ fontSize: 12, color: "var(--gray-300)" }}>
                    AI Mental Health Companion
                  </div>
                </div>
              </div>

              {loading ? (
                <div
                  style={{
                    flex: 1, display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 12 }}>
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="typing-dot"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                    <p style={{ fontSize: 13, color: "var(--gray-300)" }}>
                      Analyzing your responses...
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      color: "var(--gray-700)",
                      lineHeight: 1.8,
                      fontSize: 15,
                      fontStyle: "italic",
                    }}
                  >
                    "{aiInsight}"
                  </p>
                </div>
              )}

              <div
                style={{
                  borderTop: "1px solid var(--gray-100)",
                  paddingTop: 16, marginTop: 16,
                }}
              >
                <p style={{ fontSize: 12, color: "var(--gray-300)" }}>
                  ⚠️ This is a screening tool, not a clinical diagnosis. If you're
                  struggling, please reach out to a mental health professional.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="card animate-fadeUp" style={{ padding: 24, marginTop: 20 }}>
          <h3 style={{ fontWeight: 700, color: "var(--gray-900)", marginBottom: 16 }}>
            Recommended Next Steps
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {nextSteps.map((step, i) => (
              <div
                key={i}
                style={{ background: "var(--snow)", borderRadius: "var(--radius-sm)", padding: 16 }}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>{step.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "var(--gray-900)", marginBottom: 4 }}>
                  {step.title}
                </div>
                <div style={{ fontSize: 13, color: "var(--gray-500)" }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return null;
}

export default AssessmentPage;
