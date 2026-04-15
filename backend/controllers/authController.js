// ============================================================
// AUTH CONTROLLER
// ============================================================
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const User   = require("../models/User");

const JWT_SECRET  = process.env.JWT_SECRET  || "dev_secret";
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || "7d";

// ── Helper: sign JWT ──────────────────────────────────────────
const signToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

// ── POST /api/login ───────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    // Try DB lookup; fall back to demo user if DB not connected
    let user;
    try {
      user = await User.findByEmail(email);
    } catch {
      // DB not available — return demo user
      user = buildDemoUser(role || "student", email);
      const token = signToken({ id: user.id, role: user.role });
      return res.json({ success: true, token, user });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = signToken({ id: user.id, role: user.role });
    const { password: _pw, ...safeUser } = user;
    res.json({ success: true, token, user: safeUser });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error during login." });
  }
};

// ── POST /api/signup ──────────────────────────────────────────
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, dept, age } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required." });
    }

    let existing;
    try {
      existing = await User.findByEmail(email);
    } catch {
      // DB unavailable — return demo user
      const demoUser = buildDemoUser(role || "student", email, name);
      const token = signToken({ id: demoUser.id, role: demoUser.role });
      return res.json({ success: true, token, user: demoUser });
    }

    if (existing) {
      return res.status(409).json({ success: false, message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = await User.create({ name, email, hashedPassword, role: role || "student", dept, age });

    const token = signToken({ id: userId, role: role || "student" });
    res.status(201).json({
      success: true,
      token,
      user: { id: userId, name, email, role: role || "student", dept, age },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Server error during signup." });
  }
};

// ── GET /api/me ───────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── Helper: demo user (used when DB is not connected) ─────────
function buildDemoUser(role, email, name) {
  return {
    id:    `DEMO_${Date.now()}`,
    name:  name || (role === "teacher" ? "Prof. Demo Teacher" : "Demo Student"),
    email,
    role:  role || "student",
    dept:  "Computer Science",
    age:   21,
    stress:     72,
    anxiety:    58,
    depression: 45,
    parentConsent: true,
  };
}
