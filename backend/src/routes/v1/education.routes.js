import { Router } from "express";
import * as educationController from "../../controllers/education.controller.js";
import { validate } from "../../middlewares/index.js";
import { educationQueryRules, educationIdRule } from "../../validators/education.validator.js";

const router = Router();

/**
 * @swagger
 * /api/v1/education:
 *   get:
 *     summary: Get all visible education records
 *     description: Retrieve paginated list of visible education records with filtering, sorting, and search
 *     tags: [Education]
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
 *           enum: [startYear, endYear, createdAt, updatedAt, institution, degree, displayOrder]
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
 *         name: institution
 *         schema:
 *           type: string
 *       - in: query
 *         name: degree
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated list of visible education records
 */
router.get("/", educationQueryRules, validate, educationController.getAll);

/**
 * @swagger
 * /api/v1/education/{id}:
 *   get:
 *     summary: Get education record by ID
 *     description: Retrieve a single visible education record by its ID
 *     tags: [Education]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Education record details
 *       404:
 *         description: Education record not found
 */
router.get("/:id", educationIdRule, validate, educationController.getById);

export default router;
