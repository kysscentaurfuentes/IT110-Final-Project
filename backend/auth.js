console.log("✅ auth.js has been loaded!");
require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("./db"); // ✅ Import the shared database pool
const cookieParser = require("cookie-parser"); // ✅ Add this middleware

const router = express.Router();
router.use(cookieParser()); // ✅ Enable cookie parsing

// 🔐 [SECURITY] JWT Secret Key & Refresh Token Secret Key → ✅ Secure authentication
const JWT_SECRET = process.env.JWT_SECRET; //  Secure JWT Secret Key
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET; //  Secure Refresh Token Secret Key

// ✅ TEST ROUTE to check if auth.js is working
router.get("/test", (req, res) => {
  res.json({ message: "Auth route is working!" });
});

// ✅ Function to Generate Access & Refresh Tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  const refreshToken = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

// 🔐 [SECURITY] Hash Password Before Storing in DB → 🔑 Protects passwords from leaks
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
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

// ✅ LOGIN (Set Access & Refresh Token)
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("🔍 Login Attempt:", username);

  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows.length === 0)
      return res.status(401).json({ error: "Invalid credentials" });

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      return res.status(401).json({ error: "Invalid credentials" });

    // 🔐 [SECURITY] Generate Access & Refresh Tokens (JWT) → 🔄 Auto-authentication
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Store refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // 🔥 Change to true only if using HTTPS
      sameSite: "Lax", // ✅ Fixes CORS issues
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("✅ Refresh Token Set in Cookie!");
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: "Error logging in", details: error.message });
  }
});

// ✅ REFRESH TOKEN
router.post("/refresh-token", (req, res) => {
  console.log("🔄 Refresh Token Request Received!");
  console.log("📡 Cookies received:", req.cookies);

  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    console.log("❌ No refresh token found in cookies!");
    return res.status(401).json({ error: "Refresh token required" });
  }

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      console.log("❌ Invalid refresh token:", err.message);
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ New Access Token Generated!");
    res.json({ accessToken: newAccessToken });
  });
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

// ✅ LOGOUT (Clear Refresh Token)
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
});

console.log("📌 Registered Auth Routes:");
const registeredRoutes = router.stack
  .filter((r) => r.route)
  .map(
    (r) =>
      `➡ ${Object.keys(r.route.methods)[0].toUpperCase()} /auth${r.route.path}`
  );
console.log(
  registeredRoutes.length
    ? registeredRoutes.join("\n")
    : "❌ No routes registered!"
);

module.exports = router;
