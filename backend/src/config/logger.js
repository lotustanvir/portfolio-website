import pino from "pino";
import path from "path";
import { fileURLToPath } from "url";
import env from "./env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.resolve(__dirname, "../logs");

const transport = pino.transport({
  targets: [
    {
      target: "pino/file",
      level: env.log.level,
      options: {
        destination: path.resolve(__dirname, "../../", env.log.file),
        mkdir: true,
      },
    },
    {
      target: "pino/file",
      level: "error",
      options: {
        destination: path.resolve(__dirname, "../../", env.log.errorFile),
        mkdir: true,
      },
    },
    ...(env.isDevelopment
      ? [
          {
            target: "pino-pretty",
            level: env.log.level,
            options: {
              colorize: true,
              translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l",
              ignore: "pid,hostname",
            },
          },
        ]
      : []),
  ],
});

const logger = pino(
  {
    name: env.app.name,
    level: env.log.level,
    redact: {
      paths: ["req.headers.authorization", "req.headers.cookie", "body.password", "body.token"],
      censor: "[REDACTED]",
    },
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        requestId: req.id,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      }),
      res: (res) => ({
        statusCode: res.statusCode,
      }),
      err: pino.stdSerializers.err,
    },
  },
  transport
);

export default logger;
