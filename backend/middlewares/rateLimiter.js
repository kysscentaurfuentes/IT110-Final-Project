const rateLimit = require("express-rate-limit");

// ✅ General API Rate Limiter (Prevents excessive requests)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 🔥 Itaas muna para sigurado
    message: { error: "Too many requests, please try again later." },
  });

// ✅ Limit login attempts to prevent brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 login attempts per IP per 15 minutes
  message: { error: "Too many login attempts. Please try again later." },
});

// ✅ Limit refresh token requests to prevent abuse
const refreshLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Only 10 refresh attempts per IP per hour
  message: {
    error: "Too many refresh token requests. Please try again later.",
  },
});

module.exports = { apiLimiter, loginLimiter, refreshLimiter };
