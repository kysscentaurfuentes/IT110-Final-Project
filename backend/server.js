require("dotenv-safe").config(); // ✅ Load environment variables securely
const express = require("express");
const cors = require("cors");
const db = require("./db");
const authRoutes = require("./auth");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const protectedRoutes = require("./routes/protectedRoutes");
const morgan = require("morgan");
const logger = require("./utils/logger");
const errorHandler = require("./middlewares/errorHandler");
const helmet = require("helmet"); // 🔐 [SECURITY] Protects against XSS, Clickjacking, MIME sniffing, etc.
const {
  apiLimiter,
  loginLimiter,
  refreshLimiter,
} = require("./middlewares/rateLimiter"); // 🔐 [SECURITY] Prevents brute-force & DoS attacks

const app = express();
const PORT = process.env.PORT || 3000;

// Para sa HTTP request logs
app.use(morgan("combined"));
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Example error logging
app.get("/error", (req, res) => {
  logger.error("Test error log");
  res.status(500).send("Error occurred");
});

app.use(errorHandler); // Global error handler middleware

// ✅ Enable CORS for frontend (fixes CORS issues)
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Frontend origin
    credentials: true, // ✅ Allow cookies
  })
);
app.use("/users", protectedRoutes);
// ✅ Middleware to parse JSON requests & cookies
app.use(express.json());
app.use(cookieParser());

// ✅ Apply Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"], // ✅ Block inline scripts
        objectSrc: ["'none'"], // ✅ Block Flash, Silverlight, etc.
        upgradeInsecureRequests: [], // ✅ Auto-upgrade HTTP requests to HTTPS
      },
    },
    frameguard: { action: "deny" }, // ✅ Prevents clickjacking attacks
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }, // ✅ Limits referrer exposure
    xssFilter: true, // ✅ Helps prevent cross-site scripting attacks
  })
);

// Waiting for update sa "app.use(csrf()); // 🚫 Prevents CSRF attacks"
// ✅ Apply general rate limiting sa lahat ng API routes
// ✅ Apply login limiter
app.use("/auth/login", loginLimiter); // ✅ Limit login attempts
// ✅ Apply refresh token limiter
app.use("/auth/refresh-token", refreshLimiter); // ✅ Limit refresh token requests
// ✅ Authentication Routes
app.use("/auth", authRoutes);

// 🔐 [SECURITY] Middleware to Verify JWT Token & Auto-Refresh → 🔄 Keeps users logged in securely
const authenticateToken = (req, res, next) => {
  let token = req.headers["authorization"]?.split(" ")[1];

  console.log("📡 Received Token:", token); // ✅ Debugging: Ano ang token na natanggap?

  if (!token) {
    console.log("⛔ No token provided!");
    return res.status(403).json({ error: "Access Denied" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("❌ Token verification failed:", err.message);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    console.log("✅ Token Verified! User:", user); // ✅ Debugging: Ano ang laman ng token?
    req.user = user;
    next();
  });
};

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

console.log(process.env.DB_URL); // Test kung gumagana
console.log(process.env.REDIS_HOST); // Dapat mag-print ng 'localhost'

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
