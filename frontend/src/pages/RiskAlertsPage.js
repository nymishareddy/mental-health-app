import React, { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { getTeacherAnalytics, sendRiskAlert, assignCounselor, getAlertsStatus, updateSessionStatus, completeSession, scheduleFollowup } from "../utils/api";

function RiskAlertsPage() {
  const [flagged, setFlagged] = useState([]);
  const [loading, setLoading] = useState(true);

  const [alertStatus, setAlertStatus] = useState({});
  const [assignMap, setAssignMap] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [res, statsRes] = await Promise.all([getTeacherAnalytics(), getAlertsStatus()]);
    
    if (res && res.success && res.highRiskStudents) {
      setFlagged(res.highRiskStudents);
    }
    
    if (statsRes && statsRes.success && statsRes.statusMap) {
      const initAlerts = {};
      const initAssigns = {};
      Object.keys(statsRes.statusMap).forEach(key => {
        if (statsRes.statusMap[key].emailSent) initAlerts[key] = "✅ Parent Notified";
        if (statsRes.statusMap[key].assignedCounselor) {
          initAssigns[key] = statsRes.statusMap[key];
        }
      });
      setAlertStatus(initAlerts);
      setAssignMap(initAssigns);
    }
    setLoading(false);
  }

  const handleSendAlert = async (id, type) => {
    const key = `${id}_${type}`;
    setAlertStatus(p => ({ ...p, [key]: "Sending..." }));
    const res = await sendRiskAlert(id, type);
    if (res && res.success) setAlertStatus(p => ({ ...p, [key]: "✅ Parent Notified" }));
  };

  const handleAssign = async (id, type, e) => {
    const doc = e.target.value;
    if(!doc) return;
    await assignCounselor(id, type, doc);
    await loadData();
  };

  const handleStartSession = async (id, type) => {
    await updateSessionStatus(id, type, "in_progress");
    await loadData();
  };

  const handleCompleteSession = async (id, type) => {
    const notes = window.prompt("Enter session notes for completion:");
    if (notes === null) return;
    await completeSession(id, type, notes);
    await loadData();
  };

  const handleScheduleFollowup = async (id, type, date) => {
    await scheduleFollowup(id, type, date);
    await loadData();
  };
  
  const handleReopenIntervention = async (id, type) => {
    await updateSessionStatus(id, type, "in_progress");
    await loadData();
  };

  if(loading) return <AppLayout title="Risk Alerts"><div style={{padding:40,textAlign:"center"}}>Loading alerts...</div></AppLayout>;

  return (
    <AppLayout title="Risk Alerts" subtitle="Students flagged for high-risk scores — tracking intervention lifecycle natively">
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

          const key = `${student.id}_${student.type}`;
          const assignFlow = assignMap[key];

          return (
            <div key={i} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16, animation: `fadeUp 0.4s ease ${i * 0.1}s both` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
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
                  {alertStatus[key] ? (
                    <span style={{ background: "var(--mint)", color: "var(--teal)", borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 600 }}>
                      📱 {alertStatus[key]}
                    </span>
                  ) : (
                    <button onClick={() => handleSendAlert(student.id, student.type)} style={{ background: "var(--blue)", color: "white", border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                      + Send Alert
                    </button>
                  )}

                  {!assignFlow && (
                    <select onChange={(e) => handleAssign(student.id, student.type, e)} defaultValue="" style={{ appearance: "none", background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1", borderRadius: 20, padding: "6px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                      <option value="" disabled>🔴 Assign Counselor</option>
                      <option value="Dr. Sharma">Dr. Sharma (Stress)</option>
                      <option value="Dr. Mehta">Dr. Mehta (Anxiety)</option>
                      <option value="Dr. Rao">Dr. Rao (Depression)</option>
                    </select>
                  )}
                  {assignFlow && assignFlow.status === "assigned" && (
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#475569" }}>{assignFlow.assignedCounselor}</span>
                      <button onClick={() => handleStartSession(student.id, student.type)} style={{ background: "var(--blue)", color: "white", border: "none", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>▶ Start Session</button>
                    </div>
                  )}
                  {assignFlow && assignFlow.status === "in_progress" && (
                     <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#f59e0b", background: "#fffbeb", padding: "4px 10px", borderRadius: 20 }}>In Progress</span>
                      <button onClick={() => handleCompleteSession(student.id, student.type)} style={{ background: "#22c55e", color: "white", border: "none", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>✓ Mark Completed</button>
                    </div>
                  )}
                  {assignFlow && assignFlow.status === "completed" && (
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#22c55e", background: "#f0fdf4", padding: "4px 10px", borderRadius: 20 }}>✓ Completed</span>
                      {!assignFlow.followUpDate ? (
                        <input type="date" onChange={(e) => handleScheduleFollowup(student.id, student.type, e.target.value)} style={{ fontSize: 11, padding: "4px", borderRadius: 4, border: "1px solid #cbd5e1" }} />
                      ) : (
                        <span style={{ fontSize: 11, color: "var(--gray-500)" }}>Follow Up: {assignFlow.followUpDate.split('T')[0]}</span>
                      )}
                      
                      <button onClick={() => handleReopenIntervention(student.id, student.type)} style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fca5a5", borderRadius: 20, padding: "4px 10px", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>↺ Re-Open</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Extended View for Completed items displaying notes / outcome */}
              {assignFlow && assignFlow.status === "completed" && assignFlow.sessionNotes && (
                <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8, border: "1px dashed #cbd5e1", display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gray-500)", marginBottom: 4 }}>Session Notes:</div>
                    <div style={{ fontSize: 12, color: "var(--gray-900)" }}>{assignFlow.sessionNotes}</div>
                  </div>
                  {assignFlow.outcome && (
                    <div style={{ width: 140, textAlign: 'right' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gray-500)", marginBottom: 4 }}>Outcome:</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: assignFlow.outcome === "Improved" ? "#22c55e" : (assignFlow.outcome === "Needs Attention" ? "#ef4444" : "#f59e0b") }}>
                        {assignFlow.outcome} ({assignFlow.outcomeDetails})
                      </div>
                    </div>
                  )}
                </div>
              )}
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
