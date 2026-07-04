import rateLimit from "express-rate-limit";
import env from "../config/env.js";

const authRateLimiter = rateLimit({
  windowMs: env.authRateLimit.windowMs,
  max: env.authRateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: "Too many authentication attempts. Please try again later." },
  },
});

export default authRateLimiter;
