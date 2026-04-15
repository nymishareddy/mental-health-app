import React, { useState } from "react";
import AppLayout from "../components/AppLayout";
import { getScoreColor } from "../utils/helpers";

function ProfilePage({ user,scores = { stress: 0, anxiety: 0, depression: 0 }, onUpdateUser }) {
  const [form, setForm] = useState({
    name:          user?.name          || "",
    email:         user?.email         || "",
    dept:          user?.dept          || "",
    age:           user?.age           || "",
    parentConsent: user?.parentConsent || false,
  });
  const [saved, setSaved] = useState(false);

  const save = () => {
    onUpdateUser({ ...user, ...form });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppLayout title="My Profile" subtitle="Manage your account and privacy settings">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
        {/* ── Avatar card ── */}
        <div className="card" style={{ padding: 32, textAlign: "center" }}>
          <div
            style={{
              width: 80, height: 80,
              background: "linear-gradient(135deg, var(--blue), var(--teal))",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 36,
              margin: "0 auto 16px",
              color: "white",
              fontWeight: 700,
            }}
          >
            {user?.name?.[0] || "U"}
          </div>
          <h2 style={{ fontWeight: 700, fontSize: 18, color: "var(--gray-900)", marginBottom: 4 }}>
            {user?.name}
          </h2>
          <p style={{ fontSize: 14, color: "var(--gray-500)", marginBottom: 16 }}>
            {user?.email}
          </p>
          <div
            style={{
              background: "var(--sky)",
              color: "var(--blue-dark)",
              borderRadius: 20,
              padding: "6px 16px",
              display: "inline-block",
              fontSize: 13,
              fontWeight: 600,
              textTransform: "capitalize",
            }}
          >
            {user?.role === "teacher" ? "👨‍🏫" : "👩‍🎓"} {user?.role}
          </div>

          {/* Score summary (students only) */}
          {user?.role === "student" && (
            <div
              style={{
                marginTop: 24,
                padding: 16,
                background: "var(--snow)",
                borderRadius: "var(--radius-sm)",
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-900)", marginBottom: 12 }}>
                Current Scores
              </div>
              {[
                { label: "Stress",    val: scores?.stress || 0     },
                { label: "Anxiety",   val: scores?.anxiety || 0   },
                { label: "Depression", val: scores?.depression || 0 },
              ].map((s) => (
                <div key={s.label} style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontSize: 12, color: "var(--gray-500)" }}>{s.label}</span>
                    <span
                      style={{ fontSize: 12, fontWeight: 700, color: getScoreColor(s.val) }}
                    >
                      {s.val}
                    </span>
                  </div>
                  <div style={{ height: 5, background: "var(--gray-100)", borderRadius: 3 }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${s.val}%`,
                        background: getScoreColor(s.val),
                        borderRadius: 3,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Edit form ── */}
        <div className="card" style={{ padding: 32 }}>
          <h3 style={{ fontWeight: 700, fontSize: 18, color: "var(--gray-900)", marginBottom: 24 }}>
            Personal Information
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              marginBottom: 20,
            }}
          >
            <div>
              <label>Full Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label>Email</label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label>Department</label>
              <input
                value={form.dept}
                onChange={(e) => setForm({ ...form, dept: e.target.value })}
              />
            </div>
            {user?.role === "student" && (
              <div>
                <label>Age</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                />
              </div>
            )}
          </div>

          {/* Privacy toggle (students only) */}
          {user?.role === "student" && (
            <div
              style={{
                marginBottom: 24,
                padding: 20,
                background: "var(--snow)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <h4 style={{ fontWeight: 700, color: "var(--gray-900)", marginBottom: 8 }}>
                🔒 Privacy & Consent
              </h4>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  onClick={() =>
                    setForm({ ...form, parentConsent: !form.parentConsent })
                  }
                  style={{
                    width: 44,
                    height: 24,
                    background: form.parentConsent ? "var(--blue)" : "var(--gray-100)",
                    borderRadius: 12,
                    cursor: "pointer",
                    position: "relative",
                    transition: "background 0.3s",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      background: "white",
                      borderRadius: "50%",
                      position: "absolute",
                      top: 3,
                      left: form.parentConsent ? 23 : 3,
                      transition: "left 0.3s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-900)" }}>
                    Parent Emergency Alerts
                  </div>
                  <div style={{ fontSize: 12, color: "var(--gray-500)" }}>
                    Allow parents to receive alerts only in high-risk situations
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={save}
            style={{ padding: "12px 28px" }}
          >
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}

export default ProfilePage;
