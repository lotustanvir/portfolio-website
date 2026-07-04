import rateLimit from "express-rate-limit";
import env from "../config/env.js";

const contactRateLimiter = rateLimit({
  windowMs: env.contact.rateLimitWindowMs,
  max: env.contact.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: "Too many messages sent. Please try again later." },
    timestamp: new Date().toISOString(),
  },
});

export default contactRateLimiter;
