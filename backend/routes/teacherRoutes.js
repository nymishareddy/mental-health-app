const express = require("express");
const router = express.Router();
const { sendAlert, assignCounselor, getAlertsStatus } = require("../controllers/teacherController");
const { protect, requireRole } = require("../middleware/auth");

router.use(protect);
router.use(requireRole("teacher")); // Only teachers permitted globally

router.get("/alerts-status", getAlertsStatus);
router.post("/send-alert", sendAlert);
router.post("/assign-counselor", assignCounselor);

module.exports = router;
