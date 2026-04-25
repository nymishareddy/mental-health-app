import React from "react";


function AlertBanner({ scores, onDismiss }) {
  const high = [];
  if (scores.stress     >= 70) high.push("Stress");
  if (scores.anxiety    >= 70) high.push("Anxiety");
  if (scores.depression >= 70) high.push("Depression");

  if (!high.length) return null;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #fef2f2, #fff5f5)",
        border: "1.5px solid #fecaca",
        borderRadius: "var(--radius-md)",
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
        animation: "fadeUp 0.4s ease",
      }}
    >
      <span style={{ fontSize: 20 }}>⚠️</span>
      <div style={{ flex: 1 }}>
        <strong style={{ color: "#dc2626", fontSize: 14 }}>
          Mental Health Alert
        </strong>
        <p style={{ color: "#b91c1c", fontSize: 13, marginTop: 2 }}>
          Your {high.join(", ")} score{high.length > 1 ? "s are" : " is"} in the
          high-risk zone. Please consider speaking with a counselor. You're not alone. 💙
        </p>
      </div>
      <button
        onClick={onDismiss}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#dc2626",
          fontSize: 18,
        }}
      >
        ×
      </button>
    </div>
  );
}

export default AlertBanner;
