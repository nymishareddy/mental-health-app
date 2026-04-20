import React, { useState } from "react";
import { DEMO_USERS } from "../data/mockData";
import { loginUser, signupUser } from "../utils/api";

function AuthPage({ onLogin }) {
  const [mode, setMode]     = useState("login");
  const [role, setRole]     = useState("student");
  const [form, setForm]     = useState({ name: "", email: "", password: "", dept: "", age: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const handleSubmit = async () => {
    if (!form.email || !form.password || (mode === "signup" && !form.name)) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let res;
      if (mode === "signup") {
        res = await signupUser({ 
          name: form.name, 
          email: form.email, 
          password: form.password, 
          role: role, 
          dept: form.dept, 
          age: form.age 
        });
      } else {
        res = await loginUser(form.email, form.password, role);
      }

      console.log("AUTH RESPONSE:", res);
      if (res && res.success) {
        localStorage.setItem("token", res.token);
        onLogin(res.user);
      } else {
        setError(res?.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  const loginAsDemo = (demoRole) => onLogin(DEMO_USERS[demoRole]);

  const roles = [
    { v: "student", icon: "👩‍🎓", label: "Student"  },
    { v: "teacher", icon: "👨‍🏫", label: "Teacher"  },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, var(--sky) 0%, white 60%, var(--mint) 100%)",
        padding: 24,
      }}
    >
      <div className="card animate-fadeUp" style={{ width: "100%", maxWidth: 440, padding: "40px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 56, height: 56,
              background: "linear-gradient(135deg, var(--blue), var(--teal))",
              borderRadius: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: 28,
            }}
          >
            🧠
          </div>
          <h1
            style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--gray-900)" }}
          >
            MindCare AI
          </h1>
          <p style={{ color: "var(--gray-500)", fontSize: 14, marginTop: 6 }}>
            Mental Health Monitoring for Students
          </p>
        </div>

        {/* Mode Toggle */}
        <div
          style={{
            display: "flex",
            background: "var(--gray-50)",
            borderRadius: "var(--radius-sm)",
            padding: 4,
            marginBottom: 24,
          }}
        >
          {["login", "signup"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1, padding: "9px",
                borderRadius: 8, border: "none", cursor: "pointer",
                fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14,
                transition: "all 0.2s",
                background: mode === m ? "white" : "transparent",
                color:      mode === m ? "var(--blue-dark)" : "var(--gray-500)",
                boxShadow:  mode === m ? "var(--shadow-sm)" : "none",
              }}
            >
              {m === "login" ? "Login" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Role Selector */}
        <div style={{ marginBottom: 20 }}>
          <label>Role</label>
          <div style={{ display: "flex", gap: 10 }}>
            {roles.map((r) => (
              <div
                key={r.v}
                onClick={() => setRole(r.v)}
                style={{
                  flex: 1, padding: "12px",
                  borderRadius: "var(--radius-sm)",
                  border: `2px solid ${role === r.v ? "var(--blue)" : "var(--gray-100)"}`,
                  background: role === r.v ? "var(--sky)" : "white",
                  cursor: "pointer", textAlign: "center", transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 4 }}>{r.icon}</div>
                <div
                  style={{
                    fontSize: 13, fontWeight: 600,
                    color: role === r.v ? "var(--blue-dark)" : "var(--gray-500)",
                  }}
                >
                  {r.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {mode === "signup" && (
            <>
              <div>
                <label>Full Name *</label>
                <input
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label>Department</label>
                <input
                  placeholder="e.g. Computer Science"
                  value={form.dept}
                  onChange={(e) => setForm({ ...form, dept: e.target.value })}
                />
              </div>
            </>
          )}
          <div>
            <label>Email *</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label>Password *</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
        </div>

        {error && (
          <p style={{ color: "#dc2626", fontSize: 13, marginTop: 12 }}>{error}</p>
        )}

        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: "100%", justifyContent: "center", marginTop: 24, padding: "14px" }}
        >
          {loading ? (
            <span
              style={{
                width: 16, height: 16,
                border: "2px solid white",
                borderTop: "2px solid transparent",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                display: "inline-block",
              }}
            />
          ) : mode === "login" ? "Login →" : "Create Account →"}
        </button>

        {/* Demo Access */}
        <div
          style={{
            marginTop: 24, paddingTop: 24,
            borderTop: "1px solid var(--gray-100)",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 12, color: "var(--gray-300)", marginBottom: 12 }}>
            Quick Demo Access
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="btn btn-secondary"
              onClick={() => loginAsDemo("student")}
              style={{ flex: 1, justifyContent: "center", fontSize: 12 }}
            >
              👩‍🎓 Student Demo
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => loginAsDemo("teacher")}
              style={{ flex: 1, justifyContent: "center", fontSize: 12 }}
            >
              👨‍🏫 Teacher Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
