// ============================================================
// AUTH ROUTES
// ============================================================
const express = require("express");
const router  = express.Router();
const { login, signup, getMe } = require("../controllers/authController");
const { protect }              = require("../middleware/auth");

// Public
router.post("/login",  login);
router.post("/signup", signup);

// Protected
router.get("/me", protect, getMe);

module.exports = router;
