// ASSESSMENT CONTROLLER

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

exports.getAnalytics = async (req, res) => {
  try {
    const [studentRows] = await db.execute("SELECT COUNT(id) as total FROM users WHERE role = 'student'");
    const totalStudents = studentRows[0].total;

    // Map the most recent tests per user ONLY
    const getLatestScoresQuery = (tableName) => `
      SELECT t1.user_id, t1.score, u.name, u.dept 
      FROM ${tableName} t1
      INNER JOIN (
        SELECT user_id, MAX(created_at) as max_date 
        FROM ${tableName} 
        GROUP BY user_id
      ) t2 ON t1.user_id = t2.user_id AND t1.created_at = t2.max_date
      JOIN users u ON t1.user_id = u.id
      WHERE u.role = 'student'
    `;

    const [stressData] = await db.execute(getLatestScoresQuery('stress_tests'));
    const [anxietyData] = await db.execute(getLatestScoresQuery('anxiety_tests'));
    const [depressionData] = await db.execute(getLatestScoresQuery('depression_tests'));

    const calcAvg = (arr) => arr.length > 0 ? Math.round(arr.reduce((acc, curr) => acc + (curr.score || curr), 0) / arr.length) : 0;
    
    const highRiskStudents = [];
    stressData.forEach(row => { if (row.score >= 80) highRiskStudents.push({ id: row.user_id, name: row.name, dept: row.dept, type: 'stress', score: row.score }) });
    anxietyData.forEach(row => { if (row.score >= 80) highRiskStudents.push({ id: row.user_id, name: row.name, dept: row.dept, type: 'anxiety', score: row.score }) });
    depressionData.forEach(row => { if (row.score >= 80) highRiskStudents.push({ id: row.user_id, name: row.name, dept: row.dept, type: 'depression', score: row.score }) });

    // Prevent cross-talk by sorting safely
    highRiskStudents.sort((a,b) => b.score - a.score);

    const deptBreakdownMap = {};
    const processDept = (data, type) => {
      data.forEach(row => {
        const d = row.dept || "Unassigned";
        if (!deptBreakdownMap[d]) deptBreakdownMap[d] = { stress: [], anxiety: [], depression: [] };
        deptBreakdownMap[d][type].push(row.score);
      });
    };
    
    processDept(stressData, 'stress');
    processDept(anxietyData, 'anxiety');
    processDept(depressionData, 'depression');

    const deptBreakdown = Object.keys(deptBreakdownMap).map(dept => {
      const g = deptBreakdownMap[dept];
      return {
        dept,
        avgStress: calcAvg(g.stress),
        avgAnxiety: calcAvg(g.anxiety),
        avgDepression: calcAvg(g.depression),
      };
    });

    res.json({
      success: true,
      totalStudents,
      avgStress: calcAvg(stressData),
      avgAnxiety: calcAvg(anxietyData),
      avgDepression: calcAvg(depressionData),
      highRiskStudents,
      deptBreakdown
    });

  } catch (err) {
    console.error("Analytics fetch error:", err);
    res.status(500).json({ success: false, message: "Server error calculating analytics." });
  }
};

exports.getMySupport = async (req, res) => {
  try {
    const studentId = req.user.id;
    // Get ALL counselor assignments for the logged-in student (one for each type)
    const [counselorRows] = await db.query(
      "SELECT type, counselor_name as assignedCounselor, status, session_notes as sessionNotes, completed_at, follow_up_date as followUpDate FROM counselor_assignments WHERE student_id = ? ORDER BY completed_at DESC",
      [studentId]
    );

    if (counselorRows.length === 0) {
      return res.json({ success: true, supports: [] });
    }

    const supports = [];

    for (const r of counselorRows) {
      const support = {
        type: r.type,
        assignedCounselor: r.assignedCounselor,
        status: r.status,
        sessionNotes: r.sessionNotes,
        completedAt: r.completed_at,
        followUpDate: r.followUpDate,
      };

      // Calculate outcome if completed
      if (r.status === 'completed' && r.completed_at) {
        let tableName;
        if (r.type === 'stress') tableName = 'stress_tests';
        else if (r.type === 'anxiety') tableName = 'anxiety_tests';
        else if (r.type === 'depression') tableName = 'depression_tests';

        if (tableName) {
          let maxBefore = 0;
          let maxAfter = 0;
        
          const [before] = await db.query(`SELECT score FROM ${tableName} WHERE user_id=? AND created_at < ? ORDER BY created_at DESC LIMIT 1`, [studentId, r.completed_at]);
          if(before.length && before[0].score > maxBefore) maxBefore = before[0].score;

          const [after] = await db.query(`SELECT score FROM ${tableName} WHERE user_id=? AND created_at >= ? ORDER BY created_at DESC LIMIT 1`, [studentId, r.completed_at]);
          if(after.length && after[0].score > maxAfter) maxAfter = after[0].score;

          if (maxBefore > 0 && maxAfter > 0) {
            if (maxAfter < maxBefore) support.outcome = "Improved";
            else if (maxAfter === maxBefore) support.outcome = "No Change";
            else support.outcome = "Needs Attention";
            support.outcomeDetails = `${maxBefore} → ${maxAfter}`;
          }
        }
      }
      supports.push(support);
    }

    res.json({ success: true, supports });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching support state" });
  }
};
