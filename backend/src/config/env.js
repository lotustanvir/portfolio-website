import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const requiredVars = ["DATABASE_URL", "NODE_ENV", "COOKIE_SECRET", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];

const missing = requiredVars.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}`
  );
}

const env = {
  nodeEnv: process.env.NODE_ENV,
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
  port: parseInt(process.env.PORT, 10) || 4000,
  databaseUrl: process.env.DATABASE_URL,
  app: {
    name: "tanvirul-portfolio-api",
    version: "1.0.0",
    apiPrefix: "/api/v1",
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },
  throttle: {
    windowMs: parseInt(process.env.THROTTLE_WINDOW_MS, 10) || 60000,
    max: parseInt(process.env.THROTTLE_MAX_REQUESTS, 10) || 10,
  },
  authRateLimit: {
    windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 10) || 900000,
    max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS, 10) || 20,
  },
  cookie: {
    secret: process.env.COOKIE_SECRET,
  },
  log: {
    level: process.env.LOG_LEVEL || "info",
    file: process.env.LOG_FILE || "src/logs/app.log",
    errorFile: process.env.ERROR_LOG_FILE || "src/logs/error.log",
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,
  },
  auth: {
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS, 10) || 5,
    lockoutDuration: parseInt(process.env.LOCKOUT_DURATION_MS, 10) || 900000,
    passwordResetExpires: parseInt(process.env.PASSWORD_RESET_EXPIRES_MS, 10) || 3600000,
  },
  contact: {
    rateLimitWindowMs: parseInt(process.env.CONTACT_RATE_LIMIT_WINDOW_MS, 10) || 900000,
    rateLimitMax: parseInt(process.env.CONTACT_RATE_LIMIT_MAX, 10) || 5,
  },
};

export default env;
