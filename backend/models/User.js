// USER MODEL — users table

const db = require("../config/db");

const User = {
  /**
   * Find a user by email.
   */
  async findByEmail(email) {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    return rows[0] || null;
  },

  /**
   * Find a user by ID.
   */
  async findById(id) {
    const [rows] = await db.execute(
      "SELECT id, name, email, role, dept, age, parent_consent, created_at FROM users WHERE id = ? LIMIT 1",
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Create a new user.
   */
  async create({ name, email, hashedPassword, role, dept, age }) {
    const [result] = await db.execute(
      "INSERT INTO users (name, email, password, role, dept, age) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, hashedPassword, role, dept || null, age || null]
    );
    return result.insertId;
  },

  /**
   * Update profile fields.
   */
  async update(id, { name, dept, age, parentConsent }) {
    await db.execute(
      "UPDATE users SET name = ?, dept = ?, age = ?, parent_consent = ? WHERE id = ?",
      [name, dept, age, parentConsent ? 1 : 0, id]
    );
  },
};

module.exports = User;
