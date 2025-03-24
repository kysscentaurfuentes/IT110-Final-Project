console.log("✅ auth.js has been loaded!");
require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("./db"); // ✅ Import the shared database pool

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; // 🔐 JWT Secret Key

// ✅ TEST ROUTE to check if auth.js is working
router.get("/test", (req, res) => {
  res.json({ message: "Auth route is working!" });
});

// ✅ REGISTER (Hash Passwords + Save to DB)
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 🔒 Hash password
    const query =
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id";
    const result = await db.query(query, [username, hashedPassword, role]);

    res.json({ success: true, userId: result.rows[0].id });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error registering user", details: error.message });
  }
});

// ✅ LOGIN (Validate User + Generate JWT Token)
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("🔍 Login Attempt:", username, password);
  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    console.log("🔍 DB Query Result:", result.rows);

    if (result.rows.length === 0)
      return res.status(401).json({ error: "Invalid credentials" });

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 Password Match:", passwordMatch);

    if (!passwordMatch)
      return res.status(401).json({ error: "Invalid credentials" });

    // 🔥 Generate JWT Token
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in", details: error.message });
  }
});

// ✅ PROTECTED ROUTE (Verify JWT Token)
router.get("/protected", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    res.json({ message: "Protected data accessed", user: decoded });
  });
});

module.exports = router;
