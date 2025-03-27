require("dotenv").config();
const { Pool } = require("pg");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports = prisma;

// 🔐 [SECURITY] Use a Database Connection Pool → 🗄️ Prevents "Client already connected" issue
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  max: 10, // ✅ Prevents too many connections (DoS Protection)
  idleTimeoutMillis: 30000, // ✅ Auto-close idle connections (Resource Management)
  connectionTimeoutMillis: 2000, // ✅ Prevents app freeze if DB doesn't respond
});

// 🔐 [SECURITY] Test Connection Before Server Starts → 🚀 Ensures DB is working
pool
  .query("SELECT current_database();") // 🔒 Safe query (no user input)
  .then((res) =>
    console.log(`📡 Connected to database: ${res.rows[0].current_database}`)
  )
  .catch((err) => console.error("❌ Database connection error:", err));

// 🔐 [SECURITY] Prevents unexpected database errors from crashing the server → 🔧 Stops app crashes
pool.on("error", (err) => {
  console.error("❌ Unexpected DB Error:", err);
});

// 🔐 [SECURITY] Graceful shutdown: Close DB connection when the server stops → 🔄 Closes DB connection when server stops
process.on("SIGINT", async () => {
  console.log("🔴 Closing database connection...");
  await pool.end();
  console.log("✅ Database connection closed.");
  process.exit(0);
});

module.exports = pool; // ✅ Export the pool to use in other files
