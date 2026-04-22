const nodemailer = require("nodemailer");
const db = require("../config/db");

// Live SMTP Configuration natively drawing from process.env
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendAlert = async (req, res) => {
  try {
    const { studentId, type } = req.body;
    
    // Fetch the user to determine email destination
    const [rows] = await db.query("SELECT email, parent_email, name FROM users WHERE id=?", [studentId]);
    if(rows.length === 0) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }
    
    const student = rows[0];
    const targetEmail = student.parent_email || student.email; 

    console.log(`Sending email to: ${targetEmail}`);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: targetEmail,
      subject: "Mental Health Alert",
      text: `Your ward ${student.name} has been identified with high ${type} levels. Counseling is recommended.`,
    });

    await db.query("INSERT INTO email_alerts_log (student_id, type) VALUES (?, ?) ON DUPLICATE KEY UPDATE type=type", [studentId, type]);

    res.json({ success: true, message: "Parent formally notified." });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ success: false, message: "Server encountered error triggering SMTP." });
  }
};

exports.assignCounselor = async (req, res) => {
  try {
    const { studentId, type, counselorName } = req.body;
    const teacherId = req.user.id;

    await db.query(
      "INSERT INTO counselor_assignments (student_id, type, teacher_id, counselor_name) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE counselor_name = ?",
      [studentId, type, teacherId, counselorName, counselorName]
    );

    res.json({ success: true, message: `Successfully assigned to ${counselorName}`});
  } catch (err) {
    console.error("Counselor assignment error:", err);
    res.status(500).json({ success: false, message: "Server encountered error binding Database." });
  }
};

exports.getAlertsStatus = async (req, res) => {
  try {
    const [counselorRows] = await db.query("SELECT student_id, type, counselor_name as assignedCounselor, status, session_notes, completed_at, follow_up_date FROM counselor_assignments");
    const [emailRows] = await db.query("SELECT student_id, type, 1 as emailSent FROM email_alerts_log");

    const statusMap = {};
    
    emailRows.forEach(r => {
      const key = `${r.student_id}_${r.type}`;
      if (!statusMap[key]) statusMap[key] = {};
      statusMap[key].emailSent = true;
    });

    for (const r of counselorRows) {
      const key = `${r.student_id}_${r.type}`;
      if (!statusMap[key]) statusMap[key] = {};
      statusMap[key].assignedCounselor = r.assignedCounselor;
      statusMap[key].status = r.status;
      statusMap[key].sessionNotes = r.session_notes;
      statusMap[key].completedAt = r.completed_at;
      statusMap[key].followUpDate = r.follow_up_date;

      // Predict Outcome if completed
      if (r.status === 'completed' && r.completed_at) {
        let tableName;
        if (r.type === 'stress') tableName = 'stress_tests';
        else if (r.type === 'anxiety') tableName = 'anxiety_tests';
        else if (r.type === 'depression') tableName = 'depression_tests';

        if (tableName) {
          let maxBefore = 0;
          let maxAfter = 0;
          
          const [before] = await db.query(`SELECT score FROM ${tableName} WHERE user_id=? AND created_at < ? ORDER BY created_at DESC LIMIT 1`, [r.student_id, r.completed_at]);
          if(before.length && before[0].score > maxBefore) maxBefore = before[0].score;

          const [after] = await db.query(`SELECT score FROM ${tableName} WHERE user_id=? AND created_at >= ? ORDER BY created_at DESC LIMIT 1`, [r.student_id, r.completed_at]);
          if(after.length && after[0].score > maxAfter) maxAfter = after[0].score;

          if (maxBefore > 0 && maxAfter > 0) {
            if (maxAfter < maxBefore) statusMap[key].outcome = "Improved";
            else if (maxAfter === maxBefore) statusMap[key].outcome = "No Change";
            else statusMap[key].outcome = "Needs Attention";
            statusMap[key].outcomeDetails = `${maxBefore} → ${maxAfter}`;
          }
        }
      }
    }

    res.json({ success: true, statusMap });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching states" });
  }
};

exports.updateAssignmentStatus = async (req, res) => {
  try {
    const { studentId, type, status } = req.body;
    await db.query("UPDATE counselor_assignments SET status = ? WHERE student_id = ? AND type = ?", [status, studentId, type]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

exports.completeSession = async (req, res) => {
  try {
    const { studentId, type, notes } = req.body;
    await db.query(
      "UPDATE counselor_assignments SET status = 'completed', session_notes = ?, completed_at = NOW() WHERE student_id = ? AND type = ?",
      [notes, studentId, type]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

exports.scheduleFollowup = async (req, res) => {
  try {
    const { studentId, type, date } = req.body;
    await db.query("UPDATE counselor_assignments SET follow_up_date = ? WHERE student_id = ? AND type = ?", [date, studentId, type]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};
