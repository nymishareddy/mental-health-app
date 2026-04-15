// ============================================================
// AUTH MIDDLEWARE — Validates JWT on protected routes
// ============================================================
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized — no token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

/**
 * Role-based access guard.
 * Usage: router.get("/admin", protect, requireRole("teacher"), handler)
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ success: false, message: "Access denied — insufficient role" });
  }
  next();
};

module.exports = { protect, requireRole };
