import { Router } from "express";
import env from "../config/env.js";
import v1Routes from "./v1/index.js";

const router = Router();

router.use("/v1", v1Routes);

// Future versions
// router.use("/v2", v2Routes);

export function apiRouter(app) {
  app.use(env.app.apiPrefix.replace("/v1", ""), router);
}
