import "express-async-errors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import env from "./config/env.js";
import logger from "./config/logger.js";
import swaggerSpec from "./docs/swagger.js";
import {
  configureHelmet,
  configureCors,
  configureCompression,
  configureRateLimiter,
  configureCookieParser,
  configureHpp,
} from "./config/security.js";
import { requestId, requestLogger, errorHandler, notFoundHandler } from "./middlewares/index.js";
import { apiRouter } from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ─────────────────────────────────────────────────
// 1. Request ID — must be first for logging
// ─────────────────────────────────────────────────
app.use(requestId);

// ─────────────────────────────────────────────────
// 2. Security headers
// ─────────────────────────────────────────────────
app.use(configureHelmet());

// ─────────────────────────────────────────────────
// 3. CORS
// ─────────────────────────────────────────────────
app.use(configureCors());

// ─────────────────────────────────────────────────
// 4. Compression
// ─────────────────────────────────────────────────
app.use(configureCompression());

// ─────────────────────────────────────────────────
// 5. Body parsing — before rate limiter
// ─────────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ─────────────────────────────────────────────────
// 6. Cookie parser
// ─────────────────────────────────────────────────
app.use(configureCookieParser());

// ─────────────────────────────────────────────────
// 7. Rate limiting
// ─────────────────────────────────────────────────
app.use(configureRateLimiter());

// ─────────────────────────────────────────────────
// 8. Parameter pollution prevention
// ─────────────────────────────────────────────────
app.use(configureHpp());

// ─────────────────────────────────────────────────
// 9. Hide Express signature
// ─────────────────────────────────────────────────
app.disable("x-powered-by");

// ─────────────────────────────────────────────────
// 10. Request logging
// ─────────────────────────────────────────────────
app.use(requestLogger);

// ─────────────────────────────────────────────────
// 11. Swagger documentation
// ─────────────────────────────────────────────────
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Portfolio API Docs",
}));

// ─────────────────────────────────────────────────
// 12. Static files — uploaded certificates
// ─────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ─────────────────────────────────────────────────
// 13. API routes
// ─────────────────────────────────────────────────
apiRouter(app);

// ─────────────────────────────────────────────────
// 13. 404 handler — must be after all routes
// ─────────────────────────────────────────────────
app.use(notFoundHandler);

// ─────────────────────────────────────────────────
// 14. Global error handler — must be last
// ─────────────────────────────────────────────────
app.use(errorHandler);

// ─────────────────────────────────────────────────
// Unhandled rejection / exception handlers
// ─────────────────────────────────────────────────
process.on("unhandledRejection", (reason) => {
  logger.error({ err: reason }, "Unhandled Promise Rejection");
});

process.on("uncaughtException", (error) => {
  logger.fatal({ err: error }, "Uncaught Exception");
  process.exit(1);
});

export default app;
