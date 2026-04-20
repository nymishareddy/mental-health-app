import React, { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { getTeacherAnalytics, sendRiskAlert, assignCounselor, getAlertsStatus } from "../utils/api";

function RiskAlertsPage() {
  const [flagged, setFlagged] = useState([]);
  const [loading, setLoading] = useState(true);

  const [alertStatus, setAlertStatus] = useState({});
  const [assignStatus, setAssignStatus] = useState({});

  useEffect(() => {
    async function load() {
      const p1 = getTeacherAnalytics();
      const p2 = getAlertsStatus();
      
      const [res, statsRes] = await Promise.all([p1, p2]);
      
      if (res && res.success && res.highRiskStudents) {
        setFlagged(res.highRiskStudents);
      }
      
      if (statsRes && statsRes.success && statsRes.statusMap) {
        const initAlerts = {};
        const initAssigns = {};
        Object.keys(statsRes.statusMap).forEach(id => {
          if (statsRes.statusMap[id].emailSent) initAlerts[id] = "✅ Parent Notified";
          if (statsRes.statusMap[id].assignedCounselor) initAssigns[id] = `Assigned: ${statsRes.statusMap[id].assignedCounselor}`;
        });
        setAlertStatus(initAlerts);
        setAssignStatus(initAssigns);
      }
      
      setLoading(false);
    }
    load();
  }, []);

  const handleSendAlert = async (id, type) => {
    setAlertStatus(p => ({ ...p, [id]: "Sending..." }));
    const res = await sendRiskAlert(id, type);
    if (res && res.success) {
      setAlertStatus(p => ({ ...p, [id]: "✅ Parent Notified" }));
    } else {
      setAlertStatus(p => ({ ...p, [id]: "❌ Failed" }));
    }
  };

  const handleAssign = async (id, e) => {
    const doc = e.target.value;
    if(!doc) return;
    setAssignStatus(p => ({ ...p, [id]: "Assigning..." }));
    const res = await assignCounselor(id, doc);
    if (res && res.success) {
      setAssignStatus(p => ({ ...p, [id]: `Assigned: ${doc}` }));
    } else {
      setAssignStatus(p => ({ ...p, [id]: "❌ Failed" }));
    }
  };

  if(loading) return <AppLayout title="Risk Alerts"><div style={{padding:40,textAlign:"center"}}>Loading alerts...</div></AppLayout>;

  return (
    <AppLayout title="Risk Alerts" subtitle="Students flagged for high-risk scores — identities shown only to faculty">
      <div style={{ background: "#fef3e8", border: "1.5px solid rgba(244,132,95,0.2)", borderRadius: "var(--radius-sm)", padding: "12px 16px", marginBottom: 24, display: "flex", gap: 10 }}>
        <span>⚠️</span>
        <span style={{ fontSize: 13, color: "#c2410c" }}>
          These students have been flagged based on repeated high scores. Please handle this information with care and sensitivity.
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {flagged.map((student, i) => {
          let badgeColor = "#ef4444";
          if (student.type === "anxiety") badgeColor = "#f59e0b";
          if (student.type === "depression") badgeColor = "#8b5cf6";

          return (
            <div key={i} className="card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 16, animation: `fadeUp 0.4s ease ${i * 0.1}s both` }}>
              <div style={{ width: 44, height: 44, background: `linear-gradient(135deg, ${badgeColor}, #fff)`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                {student.name[0]?.toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "var(--gray-900)", marginBottom: 4 }}>{student.name}</div>
                <div style={{ fontSize: 12, color: "var(--gray-500)", textTransform: "capitalize" }}>{student.dept}</div>
              </div>
              
              <div style={{ width: 140, display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                <span style={{ background: `${badgeColor}11`, color: badgeColor, borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>
                  {student.type} : {student.score}
                </span>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {alertStatus[student.id] ? (
                  <span style={{ background: "var(--mint)", color: "var(--teal)", borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 600 }}>
                    📱 {alertStatus[student.id]}
                  </span>
                ) : (
                  <button onClick={() => handleSendAlert(student.id, student.type)} style={{ background: "var(--blue)", color: "white", border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                    + Send Alert
                  </button>
                )}

                {assignStatus[student.id] ? (
                  <span style={{ background: "#fef3e8", color: "#c2410c", borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 600 }}>
                   ✅ {assignStatus[student.id]}
                  </span>
                ) : (
                  <select onChange={(e) => handleAssign(student.id, e)} defaultValue="" style={{ appearance: "none", background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1", borderRadius: 20, padding: "6px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                    <option value="" disabled>🔴 Assign Counselor</option>
                    <option value="Dr. Sharma">Dr. Sharma (Stress)</option>
                    <option value="Dr. Mehta">Dr. Mehta (Anxiety)</option>
                    <option value="Dr. Rao">Dr. Rao (Depression)</option>
                  </select>
                )}
              </div>
            </div>
          );
        })}

        {flagged.length === 0 && !loading && (
          <div className="card" style={{ padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h3 style={{ color: "#22c55e", marginBottom: 8 }}>No High-Risk Students</h3>
            <p style={{ color: "var(--gray-500)" }}>All students are within acceptable ranges.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default RiskAlertsPage;
