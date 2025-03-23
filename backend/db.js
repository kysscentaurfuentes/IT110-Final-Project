require("dotenv").config({ path: "./.env" });
const { Client } = require("pg");

// 🔍 Force-load environment variables
if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  console.error("❌ ERROR: Some .env variables are missing!");
  process.exit(1);
}

console.log("🔍 Checking .env variables:");
console.log("DB_USER:", process.env.DB_USER || "NOT FOUND");
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "******" : "NOT FOUND"); // Hide password for security
console.log("DB_NAME:", process.env.DB_NAME || "NOT FOUND");
console.log("DB_HOST:", process.env.DB_HOST || "NOT FOUND");
console.log("DB_PORT:", process.env.DB_PORT || "NOT FOUND");

const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

client
  .connect()
  .then(async () => {
    console.log("📡 Database connected successfully!");

    // 🔍 Fetch the actual database name
    try {
      const result = await client.query("SELECT current_database();");
      console.log("✅ Connected to database:", result.rows[0].current_database);
    } catch (err) {
      console.error("❌ Failed to retrieve database name:", err);
    }
  })
  .catch((err) => console.error("❌ Database connection error:", err));

module.exports = client;
