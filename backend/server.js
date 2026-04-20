// ============================================================
// MINDCARE AI — EXPRESS SERVER
// ============================================================
require("dotenv").config();
const express = require("express");
const cors    = require("cors");

const authRoutes       = require("./routes/authRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const journalRoutes    = require("./routes/journalRoutes");
const chatbotRoutes    = require("./routes/chatbotRoutes");
const teacherRoutes    = require("./routes/teacherRoutes");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin:      process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── API Routes ────────────────────────────────────────────────
app.use("/api/auth",       authRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/journal",    journalRoutes);
app.use("/api/chatbot",    chatbotRoutes);
app.use("/api/teacher",    teacherRoutes);

// ── 404 Handler ───────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// ── Global Error Handler ──────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error." });
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 MindCare AI Backend running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
