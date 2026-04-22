import React, { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { getStudentSupport } from "../utils/api";

function SupportStatusPage() {
  const [supports, setSupports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getStudentSupport();
      if (res && res.success && res.supports) {
        setSupports(res.supports);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <AppLayout title="My Support"><div style={{padding: 40, textAlign: "center"}}>Loading your support timeline...</div></AppLayout>;

  return (
    <AppLayout title="My Support" subtitle="Your personalized counseling integration">
      {supports.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
           <h3 style={{ color: "var(--gray-900)" }}>No Active Assignments</h3>
           <p style={{ color: "var(--gray-500)" }}>You currently don't have an active counseling assignment. If you feel you need to speak to someone, please visit the Counselors tab!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {supports.map((support, idx) => (
            <div key={idx} className="card" style={{ padding: 24, animation: `fadeUp 0.4s ease ${idx * 0.1}s both` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ textTransform: "capitalize" }}>Intervention: {support.type}</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <div style={{ fontSize: 13, color: "var(--gray-500)" }}>Counselor</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{support.assignedCounselor}</div>
                </div>
                <div>
                  <div style={{ fontSize: 13, color: "var(--gray-500)" }}>Status</div>
                  <div style={{ padding: "6px 12px", background: support.status === "completed" ? "#f0fdf4" : (support.status === "in_progress" ? "#fffbeb" : "#f1f5f9"), color: support.status === "completed" ? "#22c55e" : (support.status === "in_progress" ? "#f59e0b" : "#475569"), display: "inline-block", borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: "capitalize" }}>
                    {support.status}
                  </div>
                </div>
              </div>
              
              {support.status === 'completed' && (
                <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--gray-100)" }}>
                   <h3 style={{ marginBottom: 12 }}>Session Details</h3>
                   <div style={{ background: "#f8fafc", padding: 16, borderRadius: 8 }}>
                     <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "var(--gray-500)" }}>Counselor Notes:</div>
                     <div style={{ fontSize: 14, color: "var(--gray-700)", lineHeight: 1.6 }}>{support.sessionNotes || "No notes provided."}</div>
                   </div>
                   
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 20 }}>
                     {support.followUpDate && (
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-500)" }}>Scheduled Follow-up:</div>
                          <div style={{ fontSize: 15, color: "var(--blue)", fontWeight: 700 }}>{support.followUpDate.split('T')[0]}</div>
                        </div>
                     )}
                     {support.outcome && (
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-500)" }}>Wellness Outcome:</div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: support.outcome === "Improved" ? "#22c55e" : (support.outcome === "Needs Attention" ? "#ef4444" : "#f59e0b") }}>
                            {support.outcome} <span style={{fontSize: 12, color: "var(--gray-400)", marginLeft: 6}}>({support.outcomeDetails})</span>
                          </div>
                        </div>
                     )}
                   </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  )
}
export default SupportStatusPage;
