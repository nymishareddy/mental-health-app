// ============================================================
// JOURNAL MODEL
// ============================================================
const db = require("../config/db");

const Journal = {
  async save(userId, text, sentiment, score, reflection) {
    const [result] = await db.execute(
      "INSERT INTO journal_entries (user_id, text, sentiment, score, reflection, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [userId, text, sentiment, score, reflection || null]
    );
    return result.insertId;
  },

  async getByUser(userId, limit = 20) {
    const [rows] = await db.execute(
      "SELECT id, text, sentiment, score, reflection, created_at FROM journal_entries WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
      [userId, limit]
    );
    return rows;
  },
};

module.exports = Journal;
