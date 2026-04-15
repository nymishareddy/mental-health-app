// ============================================================
// ASSESSMENT ROUTES
// ============================================================
const express    = require("express");
const router     = express.Router();
const { submit, getHistory, getClassStats, getUserAssessments } = require("../controllers/assessmentController");
const { protect, requireRole }             = require("../middleware/auth");

// All routes require authentication
router.use(protect);

router.post("/",             submit);
router.get("/history",       getHistory);
router.get("/class-stats",   requireRole("teacher"), getClassStats);
router.get("/user/:id", getUserAssessments);

module.exports = router;
