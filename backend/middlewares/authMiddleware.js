const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ✅ Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    console.log("❌ No token provided")
    return res.status(401).json({ error: "Unauthorized: No token provided" })
  }

  console.log("📡 Received Token:", token) // ✅ Debugging

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("❌ Token verification failed:", err.message)
      return res.status(403).json({ error: "Unauthorized: Invalid token" })
    }

    console.log("✅ Token Verified:", decoded) // ✅ Debugging
    req.user = decoded
    next()
  })
}

// ✅ Middleware to check if user is Super Admin
const isAdmin = (req, res, next) => {
    console.log("🔍 Debugging `isAdmin`: ", req.user); // ✅ Log full user data

  if (req.user.role !== "superadmin") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
  next();
};

module.exports = { verifyToken, isAdmin };
