import { PrismaClient } from "@prisma/client";
import env from "./env.js";
import logger from "./logger.js";

const prisma = new PrismaClient({
  log:
    env.isDevelopment
      ? [
          { level: "query", emit: "event" },
          { level: "info", emit: "event" },
          { level: "warn", emit: "event" },
          { level: "error", emit: "event" },
        ]
      : [{ level: "warn", emit: "event" }, { level: "error", emit: "event" }],
});

if (env.isDevelopment) {
  prisma.$on("query", (e) => {
    logger.debug({ query: e.query, params: e.params, duration: `${e.duration}ms` }, "database query");
  });
}

prisma.$on("info", (e) => {
  logger.info(e, "database info");
});

prisma.$on("warn", (e) => {
  logger.warn(e, "database warning");
});

prisma.$on("error", (e) => {
  logger.error(e, "database error");
});

export async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info("Database connected successfully");
  } catch (error) {
    logger.fatal(error, "Failed to connect to database");
    throw error;
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
  logger.info("Database disconnected");
}

export default prisma;
