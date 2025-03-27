const jwt = require("jsonwebtoken");
const redis = require("../redisClient"); // 🔹 Import Redis client
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// ✅ Middleware to verify JWT token and auto refresh if needed
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  // 🔹 Check if token is blacklisted
  const isBlacklisted = await redis.get(`blacklist:${token}`);
  if (isBlacklisted) {
    console.log("⛔ Token is blacklisted, access denied.");
    return res.status(401).json({ error: "Unauthorized: Token revoked" });
  }

  console.log("📡 Received Token:", token); // ✅ Debugging

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("❌ Token verification failed:", err.message);
      return res.status(403).json({ error: "Unauthorized: Invalid token" });
    }

    console.log("✅ Token Verified:", decoded); // ✅ Debugging
    req.user = decoded;
    next();
  });
};

// ✅ Middleware to check if user is Super Admin
const isAdmin = (req, res, next) => {
  console.log("🔍 Checking user role:", req.user); // ✅ Log user info

  if (!req.user || req.user.role !== "superadmin") {
    console.log("⛔ Access denied! User is not superadmin.");
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }

  console.log("✅ User is admin, access granted.");
  next();
};

module.exports = { verifyToken, isAdmin };
