require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db"); // ✅ Import the shared database pool
const authRoutes = require("./auth"); // ✅ Import authentication routes
const { verifyToken, isAdmin } = require("./middlewares/authMiddleware"); // ✅ Import middleware
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken"); // ✅ Import JWT for token verification

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware to parse JSON requests & cookies
app.use(express.json());
app.use(cookieParser());

// ✅ Enable CORS for frontend (fixes CORS issues)
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Frontend origin
    credentials: true, // ✅ Allow cookies
  })
);

console.log("✅ Registering /auth routes...");
// ✅ Authentication Routes
app.use("/auth", authRoutes);

// 🔐 [SECURITY] Middleware to Verify JWT Token & Auto-Refresh → 🔄 Keeps users logged in securely
const authenticateToken = (req, res, next) => {
  let token = req.headers["authorization"]?.split(" ")[1]; // ✅ Extract token from header
  if (!token) return res.status(403).json({ error: "Access Denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // 🔄 Try refreshing the token if expired
      return res.status(401).json({ error: "Invalid Token", refresh: true });
    }
    req.user = user;
    next();
  });
};

// ✅ GET: Fetch all users (Super Admin Only)
app.get("/users", verifyToken, isAdmin, async (req, res) => {
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
// POST: Add a new user (Authenticated Users)
app.post("/users", authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const query =
      "INSERT INTO public.users (name, email) VALUES ($1, $2) RETURNING *";
    const result = await db.query(query, [name, email]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to insert user", details: err.message });
  }
});

// ✅ PUT: Update User Role (Super Admin Only)
app.put("/users/:id", verifyToken, isAdmin, async (req, res) => {
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
app.delete("/users/:id", verifyToken, isAdmin, async (req, res) => {
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

// 🔍 DEBUGGING: Log All Registered Routes
console.log("📌 Registered Server Routes:");
const registeredRoutes = app._router.stack
  .filter((r) => r.route)
  .map(
    (r) => `➡ ${Object.keys(r.route.methods)[0].toUpperCase()} ${r.route.path}`
  );
console.log(
  registeredRoutes.length
    ? registeredRoutes.join("\n")
    : "❌ No routes registered!"
);

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
