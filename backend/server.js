require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db"); // ✅ Import the shared database pool
const authRoutes = require("./auth"); // ✅ Import authentication routes
const { verifyToken, isAdmin } = require("./middlewares/authMiddleware"); // ✅ Import middleware

const app = express();
const PORT = 3000;

// ✅ Enable CORS for frontend (fixes CORS issues)
app.use(cors({ origin: "*" }));

// ✅ Middleware to parse JSON requests
app.use(express.json());

console.log("✅ Registering /auth routes...");
// ✅ Authentication Routes
app.use("/auth", authRoutes);

// ✅ GET: Fetch all users (Super Admin Only)
app.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const result = await db.query("SELECT id, name, email, role, username FROM users"); // ❌ Removed 'password'
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database query failed", details: err.message });
  }
});

// ✅ POST: Add a new user
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const query = "INSERT INTO public.users (name, email) VALUES ($1, $2) RETURNING *";
    const result = await db.query(query, [name, email]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to insert user", details: err.message });
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

    res.json({ success: true, message: "User role updated!", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user role", details: err.message });
  }
});

// ✅ DELETE: Remove User (Super Admin Only)
app.delete("/users/:id", verifyToken, isAdmin, async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await db.query("DELETE FROM users WHERE id = $1 RETURNING id", [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, message: "User deleted!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user", details: err.message });
  }
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
