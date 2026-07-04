import { Router } from "express";
import * as settingController from "../../controllers/setting.controller.js";

const router = Router();

/**
 * @swagger
 * /api/v1/settings:
 *   get:
 *     summary: Get public website settings
 *     description: Retrieve all publicly visible website settings (cached for 5 minutes)
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Website settings
 */
router.get("/", settingController.getPublic);

export default router;
