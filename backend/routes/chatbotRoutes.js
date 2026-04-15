// ============================================================
// CHATBOT ROUTES
// ============================================================
const express      = require("express");
const router       = express.Router();
const { chat }     = require("../controllers/chatbotController");
const { protect }  = require("../middleware/auth");

router.use(protect);

router.post("/", chat);

module.exports = router;
