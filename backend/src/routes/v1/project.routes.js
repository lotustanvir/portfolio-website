import { Router } from "express";
import * as projectController from "../../controllers/project.controller.js";
import { validate } from "../../middlewares/index.js";
import { projectQueryRules, projectSlugRule } from "../../validators/project.validator.js";

const router = Router();

/**
 * @swagger
 * /api/v1/projects:
 *   get:
 *     summary: Get all projects
 *     description: Retrieve paginated list of projects with filtering, sorting, and search
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, title]
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort direction
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PUBLISHED, ARCHIVED]
 *         description: Filter by status
 *       - in: query
 *         name: featured
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter featured projects
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: technologyIds
 *         schema:
 *           type: string
 *         description: Comma-separated technology IDs
 *     responses:
 *       200:
 *         description: Paginated list of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get("/", projectQueryRules, validate, projectController.getAll);

/**
 * @swagger
 * /api/v1/projects/{slug}:
 *   get:
 *     summary: Get project by slug
 *     description: Retrieve a single project by its slug
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Project slug
 *     responses:
 *       200:
 *         description: Project details
 *       404:
 *         description: Project not found
 */
router.get("/:slug", projectSlugRule, validate, projectController.getBySlug);

export default router;
