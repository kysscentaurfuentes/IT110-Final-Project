require("dotenv").config();
const { Pool } = require("pg");

// ✅ Use a database connection pool (fixes "Client already connected" issue)
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  max: 10, // ✅ Prevents too many connections
  idleTimeoutMillis: 30000, // ✅ Auto-close idle connections
  connectionTimeoutMillis: 2000, // ✅ Timeout if DB doesn't respond
});

// ✅ Test connection when server starts
pool
  .query("SELECT current_database();")
  .then((res) => console.log(`📡 Connected to database: ${res.rows[0].current_database}`))
  .catch((err) => console.error("❌ Database connection error:", err));

module.exports = pool; // ✅ Export the pool to use in other files
