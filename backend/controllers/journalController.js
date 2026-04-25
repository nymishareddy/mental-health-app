// JOURNAL CONTROLLER
const Journal = require("../models/Journal");
const db = require("../config/db");

// ── POST /api/journal ─────────────────────────────────────────
exports.save = async (req, res) => {
  try {
    const { text, sentiment, score, reflection } = req.body;
    const userId = req.user.id;

    if (!text) {
      return res.status(400).json({ success: false, message: "text is required." });
    }

    let id;
    try {
      id = await Journal.save(userId, text, sentiment || "neutral", score || 50, reflection);
    } catch {
      return res.json({ success: true, id: null, message: "Stored locally (DB unavailable)." });
    }

    res.status(201).json({ success: true, id });
  } catch (err) {
    console.error("Journal save error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── GET /api/journal ──────────────────────────────────────────
exports.getEntries = async (req, res) => {
  try {
    const userId = req.user.id;
    let entries;
    try {
      entries = await Journal.getByUser(userId);
    } catch {
      entries = [];
    }
    res.json({ success: true, entries });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};
exports.getJournalEntries = async (req, res) => {
  const userId = req.params.userId;

  const [rows] = await db.query(
    "SELECT * FROM journal_entries WHERE user_id=? ORDER BY created_at DESC",
    [userId]
  );

  res.json(rows);
};
