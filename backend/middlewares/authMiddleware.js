const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ✅ Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Unauthorized: Invalid token" });
    }

    req.user = decoded; // ✅ Save user info in request
    next();
  });
};

// ✅ Middleware to check if user is Super Admin
const isAdmin = (req, res, next) => {
    console.log("🔍 Debugging `isAdmin`: ", req.user); // ✅ Log full user data

  if (req.user.role !== "superadmin") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
  next();
};

module.exports = { verifyToken, isAdmin };
