require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db"); // ✅ Import the shared database pool
const authRoutes = require("./auth"); // ✅ Import authentication routes

const app = express();
const PORT = 3000;

// ✅ Enable CORS for frontend (fixes CORS issues)
app.use(cors({ origin: "*" }));

// ✅ Middleware to parse JSON requests
app.use(express.json());

console.log("✅ Registering /auth routes...");
// ✅ Authentication Routes
app.use("/auth", authRoutes);

// ✅ GET: Fetch all users
app.get("/users", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM public.users");
    res.json(result.rows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Database query failed", details: err.message });
  }
});

// ✅ POST: Add a new user
app.post("/users", async (req, res) => {
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

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
