const express = require("express");
const router = express.Router();
const {
  verifyToken,
  isAdmin,
  checkBlacklist,
} = require("../middlewares/authMiddleware");
const { apiLimiter } = require("../middlewares/rateLimiter");
const db = require("../db");
const bcrypt = require("bcrypt");

router.use(verifyToken); // ✅ Protect routes with token verification
router.use(apiLimiter); // ✅ Apply rate limiting to all /users routes

// ✅ Dashboard Route
router.get("/dashboard", (req, res) => {
  res.json({ message: "Welcome to the dashboard!" });
});

// ✅ GET: Fetch all users (Super Admin Only)
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, email, role, username FROM users"
    );
    res.json(result.rows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Database query failed", details: err.message });
  }
});

// 🔐 [SECURITY] Secure Parameterized Query → 🚫 Prevents SQL Injection
// ✅ POST: Add a new user (Authenticated Users)
router.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Fetch user from DB
    const result = await db.query(
      "SELECT id, username, password FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = result.rows[0];

    // ✅ Correct: "await" is now inside the async function
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password does not match!");
      return res.status(401).json({ error: "Invalid username or password" });
    }

    res.json({ success: true, message: "Login successful!" });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});

// ✅ PUT: Update User Role (Super Admin Only)
router.put("/users/:id", verifyToken, isAdmin, async (req, res) => {
  const { role } = req.body;
  const userId = req.params.id;

  try {
    const result = await db.query(
      "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, role",
      [role, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      message: "User role updated!",
      user: result.rows[0],
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update user role", details: err.message });
  }
});

// ✅ DELETE: Remove User (Super Admin Only)
router.delete("/users/:id", verifyToken, isAdmin, async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await db.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, message: "User deleted!" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete user", details: err.message });
  }
});

// Compare input password with hashed password from DB
module.exports = router;
