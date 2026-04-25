import React from "react";

// Navigation 
const STUDENT_NAV = [
  { id: "dashboard",       icon: "🏠", label: "Dashboard"      },
  { id: "stress-test",     icon: "😤", label: "Stress Test"    },
  { id: "anxiety-test",    icon: "😰", label: "Anxiety Test"   },
  { id: "depression-test", icon: "😞", label: "Depression Test"},
  { id: "counselors",      icon: "🩺", label: "Counselors"     },
  { id: "support",         icon: "🛡️", label: "My Support"     },
  { id: "chatbot",         icon: "💬", label: "AI Chatbot"     },
  { id: "journal",         icon: "📔", label: "My Journal"     },
  { id: "ai-insights",     icon: "🧠", label: "AI Insights"    },
  { id: "recommendations", icon: "🌟", label: "Recommendations"},
  { id: "profile",         icon: "👤", label: "Profile"        },
];

const TEACHER_NAV = [
  { id: "teacher-dashboard", icon: "📊", label: "Class Dashboard" },
  { id: "risk-alerts",       icon: "⚠️", label: "Risk Alerts"    },
  { id: "analytics",         icon: "📈", label: "Analytics"       },
  { id: "profile",           icon: "👤", label: "Profile"         },
];

function Sidebar({ user, activePage, onNavigate, onLogout }) {
  const nav = user?.role === "teacher" ? TEACHER_NAV : STUDENT_NAV;

  return (
    <aside
      style={{
        width: 240,
        minHeight: "100vh",
        background: "linear-gradient(180deg, var(--gray-900) 0%, #1a3a52 100%)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "sticky",
        top: 0,
      }}
    >
      {/* ── Logo ── */}
      <div
        style={{
          padding: "24px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg, var(--blue), var(--teal))",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            🧠
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 17,
                color: "white",
              }}
            >
              Swasthya Initiative
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
                textTransform: "capitalize",
              }}
            >
              {user?.role} Portal
            </div>
          </div>
        </div>
      </div>

      {/* ── Nav Items ── */}
      <nav
        style={{
          flex: 1,
          padding: "16px 12px",
          overflowY: "auto",
        }}
      >
        {nav.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 14px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              fontSize: 14,
              fontWeight: activePage === item.id ? 600 : 500,
              textAlign: "left",
              transition: "all 0.2s",
              background:
                activePage === item.id
                  ? "rgba(74,158,221,0.2)"
                  : "transparent",
              color:
                activePage === item.id
                  ? "#7dd3fc"
                  : "rgba(255,255,255,0.6)",
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* ── User Footer ── */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, var(--blue), var(--teal))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              color: "white",
              fontWeight: 700,
            }}
          >
            {user?.name?.[0] || "U"}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "white",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.email}
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            padding: "9px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "transparent",
            color: "rgba(255,255,255,0.4)",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            fontSize: 13,
            transition: "all 0.2s",
          }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
