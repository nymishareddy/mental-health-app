// ASSESSMENT MODEL — SQL helpers for stress/anxiety/depression tests
const db = require("../config/db");

const Assessment = {
  /**
   * Save a completed assessment.
   * @param {string} userId
   * @param {"stress"|"anxiety"|"depression"} type
   * @param {number} score  0–100
   * @param {object} answers  raw answer map
   */
  async save(userId, type, score, answers) {
    const tableMap = {
      stress:     "stress_tests",
      anxiety:    "anxiety_tests",
      depression: "depression_tests",
    };
    const table = tableMap[type];
    if (!table) throw new Error(`Unknown assessment type: ${type}`);

    const [result] = await db.execute(
      `INSERT INTO ${table} (user_id, score, answers, created_at) VALUES (?, ?, ?, NOW())`,
      [userId, score, JSON.stringify(answers)]
    );
    return result.insertId;
  },

  /**
   * Get the last N assessments for a user by type.
   */
  async getHistory(userId, type, limit = 10) {
    const tableMap = {
      stress:     "stress_tests",
      anxiety:    "anxiety_tests",
      depression: "depression_tests",
    };
    const table = tableMap[type];
    const [rows] = await db.execute(
      `SELECT id, score, created_at FROM ${table} WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`,
      [userId, limit]
    );
    return rows;
  },

  /**
   * Get aggregated class stats (teacher view).
   */
  async getClassStats(type) {
    const tableMap = {
      stress:     "stress_tests",
      anxiety:    "anxiety_tests",
      depression: "depression_tests",
    };
    const table = tableMap[type];
    const [rows] = await db.execute(
      `SELECT AVG(score) AS avg_score,
              COUNT(CASE WHEN score >= 70 THEN 1 END) AS high_risk_count,
              COUNT(*) AS total
       FROM ${table}
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`
    );
    return rows[0];
  },
};

module.exports = Assessment;
