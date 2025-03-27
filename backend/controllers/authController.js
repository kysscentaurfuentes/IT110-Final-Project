const redis = require("../redisClient");

async function logout(req, res) {
  const token = req.token;
  const expiresIn = req.user.exp - Math.floor(Date.now() / 1000); // Remaining token time

  // Save the token in Redis with an expiration time
  await redis.set(`blacklist:${token}`, "revoked", "EX", expiresIn);

  return res.status(200).json({ message: "Logged out successfully" });
}

console.log("🔍 User from DB:", user);
console.log("🔍 Input Password:", password);
console.log("🔍 Hashed Password in DB:", user.password);

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

    // Compare input password with hashed password in DB
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
