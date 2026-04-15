import React from "react";

function LandingPage({ onGetStarted }) {
  const features = [
    { icon: "🤖", title: "AI Chatbot",     desc: "Mira — your empathetic mental health companion, available 24/7"            },
    { icon: "📊", title: "3D Tracking",    desc: "Monitor Stress, Anxiety & Depression separately with weekly trends"        },
    { icon: "🔒", title: "Privacy First",  desc: "Your data is yours — teachers see only aggregated insights"                },
    { icon: "📝", title: "Smart Journal",  desc: "AI-powered sentiment analysis on your daily thoughts"                     },
    { icon: "🎯", title: "Predictions",    desc: "ML-based risk forecasting to catch issues before they escalate"           },
    { icon: "👨‍🏫", title: "Teacher View",  desc: "Anonymized class-level insights for early intervention"                   },
  ];

  const techStack = [
    "React.js", "Claude AI API", "Chart.js", "MySQL Schema", "Python ML", "Sentiment Analysis",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #e8f4fd 0%, #ffffff 50%, #f0fdf4 100%)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        {/* ── Navbar ── */}
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px 0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36, height: 36,
                background: "linear-gradient(135deg, var(--blue), var(--teal))",
                borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 18 }}>🧠</span>
            </div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                color: "var(--gray-900)",
              }}
            >
              MindCare AI
            </span>
          </div>
          <button className="btn btn-primary" onClick={onGetStarted}>
            Get Started →
          </button>
        </nav>

        {/* ── Hero ── */}
        <div style={{ textAlign: "center", padding: "80px 0 60px" }}>
          <div
            style={{
              display: "inline-block",
              background: "var(--sky)",
              color: "var(--blue-dark)",
              borderRadius: 20,
              padding: "6px 16px",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 24,
            }}
          >
            🎓 Final Year B.Tech Project — AI in Mental Health
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 6vw, 68px)",
              lineHeight: 1.15,
              color: "var(--gray-900)",
              marginBottom: 24,
            }}
          >
            Your mental wellness,
            <br />
            <em style={{ color: "var(--blue)" }}>intelligently monitored.</em>
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "var(--gray-500)",
              maxWidth: 560,
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            An AI-powered platform for students to track stress, anxiety, and
            depression — with personalized insights, an empathetic chatbot, and
            privacy-first design.
          </p>

          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              className="btn btn-primary"
              onClick={onGetStarted}
              style={{ padding: "14px 32px", fontSize: 16 }}
            >
              Start Your Journey
            </button>
            <button
              className="btn btn-secondary"
              style={{ padding: "14px 32px", fontSize: 16 }}
            >
              Watch Demo
            </button>
          </div>
        </div>

        {/* ── Feature Cards ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
            padding: "40px 0 80px",
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: 24,
                animation: `fadeUp 0.5s ease ${i * 0.08}s both`,
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--gray-900)",
                  marginBottom: 8,
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--gray-500)",
                  lineHeight: 1.6,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ── Tech Stack ── */}
        <div
          style={{
            textAlign: "center",
            borderTop: "1px solid var(--gray-100)",
            paddingTop: 40,
            paddingBottom: 60,
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: "var(--gray-300)",
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Built With
          </p>
          <div
            style={{
              display: "flex",
              gap: 24,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {techStack.map((t) => (
              <span
                key={t}
                style={{
                  background: "var(--sky)",
                  color: "var(--blue-dark)",
                  borderRadius: 20,
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
