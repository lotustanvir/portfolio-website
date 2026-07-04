import app from "./src/app.js";
import env from "./src/config/env.js";
import logger from "./src/config/logger.js";
import { connectDatabase, disconnectDatabase } from "./src/config/database.js";

async function start() {
  // Connect to database
  await connectDatabase();

  // Start HTTP server
  const server = app.listen(env.port, () => {
    logger.info(
      {
        port: env.port,
        environment: env.nodeEnv,
        apiDocs: `http://localhost:${env.port}/api/docs`,
      },
      `
  ┌──────────────────────────────────────┐
  │   Portfolio API Server               │
  │   Port:      ${String(env.port).padEnd(30)}│
  │   Environment: ${env.nodeEnv.padEnd(22)}│
  │   Docs:      /api/docs               │
  └──────────────────────────────────────┘
  `
    );
  });

  // ─────────────────────────────────────────────────
  // Graceful Shutdown
  // ─────────────────────────────────────────────────
  function gracefulShutdown(signal) {
    logger.info(`${signal} received. Starting graceful shutdown...`);

    server.close(async () => {
      logger.info("HTTP server closed.");
      await disconnectDatabase();
      logger.info("Database disconnected.");
      process.exit(0);
    });

    setTimeout(() => {
      logger.error("Forced shutdown after 10s timeout.");
      process.exit(1);
    }, 10000);
  }

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}

start().catch((error) => {
  logger.fatal({ err: error }, "Failed to start server");
  process.exit(1);
});
