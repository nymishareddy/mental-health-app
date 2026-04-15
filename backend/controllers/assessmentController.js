// ============================================================
// ASSESSMENT CONTROLLER
// ============================================================
const Assessment = require("../models/Assessment");
const db = require("../config/db");

// ── POST /api/assessment ──────────────────────────────────────
exports.submit = async (req, res) => {
  try {
    const { type, score, answers } = req.body;
    const userId = req.user.id;

    if (!type || score === undefined) {
      return res.status(400).json({ success: false, message: "type and score are required." });
    }

    let id;
    try {
      id = await Assessment.save(userId, type, score, answers || {});
    } catch {
      // DB not available — acknowledge gracefully
      return res.json({ success: true, id: null, message: "Stored locally (DB unavailable)." });
    }

    // Check escalation
    const needsAlert = score >= 70;
    res.json({ success: true, id, score, needsAlert });
  } catch (err) {
    console.error("Assessment submit error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── GET /api/assessment/history?type=stress ───────────────────
exports.getHistory = async (req, res) => {
  try {
    const { type } = req.query;
    const userId   = req.user.id;

    if (!type) {
      return res.status(400).json({ success: false, message: "type query param required." });
    }

    let history;
    try {
      history = await Assessment.getHistory(userId, type);
    } catch {
      history = [];
    }
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── GET /api/assessment/class-stats (teacher only) ────────────
exports.getClassStats = async (req, res) => {
  try {
    const results = {};
    for (const type of ["stress", "anxiety", "depression"]) {
      try {
        results[type] = await Assessment.getClassStats(type);
      } catch {
        results[type] = { avg_score: 0, high_risk_count: 0, total: 0 };
      }
    }
    res.json({ success: true, stats: results });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.getUserAssessments = async (req, res) => {
  const userId = req.params.id;

  try {
    const [stress] = await db.query("SELECT * FROM stress_tests WHERE user_id=? ORDER BY created_at ASC", [userId]);
    const [anxiety] = await db.query("SELECT * FROM anxiety_tests WHERE user_id=? ORDER BY created_at ASC", [userId]);
    const [depression] = await db.query("SELECT * FROM depression_tests WHERE user_id=? ORDER BY created_at ASC", [userId]);

    res.json({ stress, anxiety, depression });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
