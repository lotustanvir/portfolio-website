import logger from "../config/logger.js";

export default function requestLogger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      {
        req,
        res,
        duration: `${duration}ms`,
      },
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
    );
  });
  next();
}
