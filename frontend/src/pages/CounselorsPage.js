import React from "react";
import AppLayout from "../components/AppLayout";

function CounselorsPage() {
  const counselors = [
    {
      name: "Dr. Sharma",
      specialty: "Stress Management",
      icon: "🧘‍♂️",
      color: "#ef4444",
      bio: "Behavioral specialist focused on stress reduction and academic pressure relief.",
      contact: "dr.sharma@swasthya.demo",
    },
    {
      name: "Dr. Mehta",
      specialty: "Anxiety & Panic Disorders",
      icon: "🌬️",
      color: "#f59e0b",
      bio: "Dedicated clinician assisting students in navigating severe anxiety pathways.",
      contact: "dr.mehta@swasthya.demo",
    },
    {
      name: "Dr. Rao",
      specialty: "Depression and Mood",
      icon: "🫂",
      color: "#8b5cf6",
      bio: "Providing an empathetic open door for students dealing with depressive periods.",
      contact: "dr.rao@swasthya.demo",
    },
  ];

  return (
    <AppLayout
      title="Available Counselors"
      subtitle="Connect directly with our internal support network"
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginTop: 12 }}>
        {counselors.map((doc, i) => (
          <div
            key={i}
            className="card"
            style={{ padding: 24, animation: `fadeUp 0.4s ease ${i * 0.1}s both`, borderTop: `4px solid ${doc.color}` }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${doc.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                {doc.icon}
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--gray-900)" }}>{doc.name}</h3>
                <span style={{ fontSize: 12, fontWeight: 600, color: doc.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {doc.specialty}
                </span>
              </div>
            </div>
            <p style={{ fontSize: 14, color: "var(--gray-500)", lineHeight: 1.5, marginBottom: 20 }}>
              {doc.bio}
            </p>
            <div style={{ padding: "12px 16px", background: "var(--gray-50)", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--gray-500)", fontWeight: 500 }}>Contact</span>
              <a href={`mailto:${doc.contact}`} style={{ fontSize: 13, color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>{doc.contact}</a>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}

export default CounselorsPage;
