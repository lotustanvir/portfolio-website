import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import env from "./env.js";

export function configureHelmet() {
  return helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
  });
}

export function configureCors() {
  return cors({
    origin: env.cors.origin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: env.cors.credentials,
  });
}

export function configureCompression() {
  return compression({
    level: 6,
    threshold: 1024,
  });
}

export function configureRateLimiter() {
  return rateLimit({
    windowMs: env.rateLimit.windowMs,
    max: env.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: { message: "Too many requests, please try again later." },
    },
  });
}

export function configureCookieParser() {
  return cookieParser(env.cookie.secret);
}

export function configureHpp() {
  return hpp({
    whitelist: ["page", "limit", "sort", "order", "category", "status"],
  });
}
