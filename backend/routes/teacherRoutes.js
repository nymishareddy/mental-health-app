const express = require("express");
const router = express.Router();
const { sendAlert, assignCounselor, getAlertsStatus, updateAssignmentStatus, completeSession, scheduleFollowup } = require("../controllers/teacherController");
const { protect, requireRole } = require("../middleware/auth");

router.use(protect);
router.use(requireRole("teacher")); // Only teachers permitted globally

router.get("/alerts-status", getAlertsStatus);
router.post("/send-alert", sendAlert);
router.post("/assign-counselor", assignCounselor);
router.post("/update-status", updateAssignmentStatus);
router.post("/complete-session", completeSession);
router.post("/schedule-followup", scheduleFollowup);

module.exports = router;
