import { Router } from "express";
import * as experienceController from "../../controllers/experience.controller.js";
import { validate } from "../../middlewares/index.js";
import { experienceQueryRules, experienceIdRule } from "../../validators/experience.validator.js";

const router = Router();

/**
 * @swagger
 * /api/v1/experience:
 *   get:
 *     summary: Get all visible experiences
 *     description: Retrieve paginated list of visible experiences with filtering, sorting, and search
 *     tags: [Experience]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [startDate, endDate, createdAt, updatedAt, company, displayOrder]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: isCurrent
 *         schema:
 *           type: string
 *           enum: [true, false]
 *       - in: query
 *         name: company
 *         schema:
 *           type: string
 *       - in: query
 *         name: employmentType
 *         schema:
 *           type: string
 *           enum: [FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, REMOTE, FREELANCE]
 *       - in: query
 *         name: technologyIds
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated list of visible experiences
 */
router.get("/", experienceQueryRules, validate, experienceController.getAll);

/**
 * @swagger
 * /api/v1/experience/{id}:
 *   get:
 *     summary: Get experience by ID
 *     description: Retrieve a single visible experience by its ID
 *     tags: [Experience]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Experience details
 *       404:
 *         description: Experience not found
 */
router.get("/:id", experienceIdRule, validate, experienceController.getById);

export default router;
