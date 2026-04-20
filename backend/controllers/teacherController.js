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

    await db.query("INSERT IGNORE INTO email_alerts_log (student_id) VALUES (?)", [studentId]);

    res.json({ success: true, message: "Parent formally notified." });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ success: false, message: "Server encountered error triggering SMTP." });
  }
};

exports.assignCounselor = async (req, res) => {
  try {
    const { studentId, counselorName } = req.body;
    const teacherId = req.user.id;

    await db.query(
      "INSERT INTO counselor_assignments (student_id, teacher_id, counselor_name) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE counselor_name = ?",
      [studentId, teacherId, counselorName, counselorName]
    );

    res.json({ success: true, message: `Successfully assigned to ${counselorName}`});
  } catch (err) {
    console.error("Counselor assignment error:", err);
    res.status(500).json({ success: false, message: "Server encountered error binding Database." });
  }
};

exports.getAlertsStatus = async (req, res) => {
  try {
    const [counselorRows] = await db.query("SELECT student_id, counselor_name as assignedCounselor FROM counselor_assignments");
    const [emailRows] = await db.query("SELECT student_id, 1 as emailSent FROM email_alerts_log");

    const statusMap = {};
    
    emailRows.forEach(r => {
      if (!statusMap[r.student_id]) statusMap[r.student_id] = {};
      statusMap[r.student_id].emailSent = true;
    });

    counselorRows.forEach(r => {
      if (!statusMap[r.student_id]) statusMap[r.student_id] = {};
      statusMap[r.student_id].assignedCounselor = r.assignedCounselor;
    });

    res.json({ success: true, statusMap });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching states" });
  }
};
