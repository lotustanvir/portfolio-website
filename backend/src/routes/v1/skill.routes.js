import { Router } from "express";
import * as skillController from "../../controllers/skill.controller.js";
import { validate } from "../../middlewares/index.js";
import { skillQueryRules, skillSlugRule } from "../../validators/skill.validator.js";

const router = Router();

/**
 * @swagger
 * /api/v1/skills:
 *   get:
 *     summary: Get all visible skills
 *     description: Retrieve paginated list of visible skills with filtering and sorting
 *     tags: [Skills]
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
 *           enum: [displayOrder, createdAt, updatedAt, name, percentage]
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
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated list of visible skills
 */
router.get("/", skillQueryRules, validate, skillController.getAll);

/**
 * @swagger
 * /api/v1/skills/categories:
 *   get:
 *     summary: Get all skill categories
 *     description: Retrieve a list of distinct skill categories
 *     tags: [Skills]
 *     responses:
 *       200:
 *         description: List of skill categories
 */
router.get("/categories", skillController.getCategories);

/**
 * @swagger
 * /api/v1/skills/{slug}:
 *   get:
 *     summary: Get skill by slug
 *     description: Retrieve a single visible skill by its slug
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skill details
 *       404:
 *         description: Skill not found
 */
router.get("/:slug", skillSlugRule, validate, skillController.getBySlug);

export default router;
