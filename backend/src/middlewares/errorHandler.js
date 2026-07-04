import logger from "../config/logger.js";
import { AppError } from "../errors/index.js";
import env from "../config/env.js";

export default function errorHandler(err, req, res, _next) {
  if (err instanceof AppError) {
    logger.warn({ err, requestId: req.id }, "Operational error");
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        ...(err.errors && { errors: err.errors }),
      },
      requestId: req.id,
      timestamp: err.timestamp,
    });
  }

  if (err.code === "P2002") {
    logger.warn({ err, requestId: req.id }, "Database unique constraint violation");
    return res.status(409).json({
      success: false,
      error: { message: "Resource already exists" },
      requestId: req.id,
      timestamp: new Date().toISOString(),
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      error: { message: "Resource not found" },
      requestId: req.id,
      timestamp: new Date().toISOString(),
    });
  }

  logger.error({ err, requestId: req.id }, "Unhandled error");

  return res.status(500).json({
    success: false,
    error: {
      message: env.isProduction ? "Internal server error" : err.message,
      ...(env.isDevelopment && { stack: err.stack }),
    },
    requestId: req.id,
    timestamp: new Date().toISOString(),
  });
}
