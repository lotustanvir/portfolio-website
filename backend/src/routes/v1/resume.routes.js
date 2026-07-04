import { Router } from "express";
import * as resumeController from "../../controllers/resume.controller.js";

const router = Router();

/**
 * @swagger
 * /api/v1/resume:
 *   get:
 *     summary: Get active resume metadata
 *     description: Retrieve metadata of the currently active resume
 *     tags: [Resume]
 *     responses:
 *       200:
 *         description: Active resume metadata
 *       404:
 *         description: No active resume found
 */
router.get("/", resumeController.getActive);

/**
 * @swagger
 * /api/v1/resume/download:
 *   get:
 *     summary: Download active resume PDF
 *     description: Download the currently active resume PDF and increment download counter
 *     tags: [Resume]
 *     responses:
 *       302:
 *         description: Redirects to the resume PDF file
 *       404:
 *         description: No active resume found
 */
router.get("/download", resumeController.download);

export default router;
