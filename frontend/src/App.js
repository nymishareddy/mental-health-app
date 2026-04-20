import React, { useState } from "react";

// Pages
import LandingPage        from "./pages/LandingPage";
import AuthPage           from "./pages/AuthPage";
import StudentDashboard   from "./pages/StudentDashboard";
import AssessmentPage     from "./pages/AssessmentPage";
import ChatbotPage        from "./pages/ChatbotPage";
import JournalPage        from "./pages/JournalPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import ProfilePage        from "./pages/ProfilePage";
import CounselorsPage     from "./pages/CounselorsPage";
import TeacherDashboard   from "./pages/TeacherDashboard";
import RiskAlertsPage     from "./pages/RiskAlertsPage";
import AnalyticsPage      from "./pages/AnalyticsPage";
import { getUserData, getJournalEntries } from "./utils/api";

// Components
import Sidebar from "./components/Sidebar";

// ============================================================
// ROOT APP — Screen & Page Router
// ============================================================
function App() {
  const [screen,         setScreen]         = useState("landing"); // landing | auth | app
  const [user,           setUser]           = useState(null);
  const [activePage,     setActivePage]     = useState("dashboard");
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [scores,         setScores]         = useState({
    stress:     72,
    anxiety:    58,
    depression: 45,
  });
  const [journalEntries, setJournalEntries] = useState([]);

  // ── Auth handlers ──
  const handleLogin = async (userData) => {
  setUser(userData);

  // 🔥 Fetch data from backend
  const data = await getUserData(userData.id);
  console.log("Fetched Data:", data);

  // 👉 Extract latest scores (simple logic)
  let stress = 0, anxiety = 0, depression = 0;

  if (data) {
    if (data.stress?.length) {
      stress = data.stress[data.stress.length - 1].score;
    }
    if (data.anxiety?.length) {
      anxiety = data.anxiety[data.anxiety.length - 1].score;
    }
    if (data.depression?.length) {
      depression = data.depression[data.depression.length - 1].score;
    }
  }

  // ✅ Set scores from DB
  setScores({ stress, anxiety, depression });

  // 🔥 Fetch journal entries
  const entriesData = await getJournalEntries(userData.id);
  if (entriesData && entriesData.success && entriesData.entries) {
    setJournalEntries(entriesData.entries);
  } else if (Array.isArray(entriesData)) {
    setJournalEntries(entriesData);
  }

  // 👉 Navigate
  setActivePage(userData.role === "teacher" ? "teacher-dashboard" : "dashboard");
  setScreen("app");
};

  const handleLogout = () => {
    setUser(null);
    setScreen("landing");
    setAlertDismissed(false);
  };

  // Called by AssessmentPage after test completes
  const handleTestComplete = (type, score) => {
    setScores((prev) => ({ ...prev, [type]: score }));
  };

  // ── Page Renderer ──
  const renderPage = () => {
    // Teacher pages
    if (user?.role === "teacher") {
      switch (activePage) {
        case "teacher-dashboard": return <TeacherDashboard />;
        case "risk-alerts":       return <RiskAlertsPage />;
        case "analytics":         return <AnalyticsPage />;
        case "profile":           return <ProfilePage user={user} scores={scores} onUpdateUser={setUser} />;
        default:                  return <TeacherDashboard />;
      }
    }

    // Student pages
    switch (activePage) {
      case "dashboard":
        return (
          <StudentDashboard
            user={user}
            scores={scores}
            onNavigate={setActivePage}
            alertDismissed={alertDismissed}
            setAlertDismissed={setAlertDismissed}
          />
        );
      case "stress-test":
        return <AssessmentPage type="stress"     user={user} onComplete={handleTestComplete} />;
      case "anxiety-test":
        return <AssessmentPage type="anxiety"    user={user} onComplete={handleTestComplete} />;
      case "depression-test":
        return <AssessmentPage type="depression" user={user} onComplete={handleTestComplete} />;
      case "counselors":
        return <CounselorsPage />;
      case "chatbot":
        return <ChatbotPage user={user} />;
      case "journal":
        return <JournalPage user={user} entries={journalEntries} setEntries={setJournalEntries} />;
      case "recommendations":
        return <RecommendationsPage scores={scores} />;
      case "profile":
        return <ProfilePage user={user} scores={scores} onUpdateUser={setUser} />;
      default:
        return (
          <StudentDashboard
            user={user}
            scores={scores}
            onNavigate={setActivePage}
            alertDismissed={alertDismissed}
            setAlertDismissed={setAlertDismissed}
          />
        );
    }
  };

  // ── Screen Router ──
  if (screen === "landing") return <LandingPage onGetStarted={() => setScreen("auth")} />;
  if (screen === "auth")    return <AuthPage onLogin={handleLogin} />;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        user={user}
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={handleLogout}
      />
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: activePage === "chatbot" ? "hidden" : "auto",
          background: "var(--snow)",
        }}
      >
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
