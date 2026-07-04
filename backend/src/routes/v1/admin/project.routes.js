import { Router } from "express";
import * as projectController from "../../../controllers/project.controller.js";
import { authenticate, authorize, validate } from "../../../middlewares/index.js";
import {
  createProjectRules,
  updateProjectRules,
  projectQueryRules,
  projectIdRule,
} from "../../../validators/project.validator.js";

const router = Router();

// All admin project routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/admin/projects:
 *   get:
 *     summary: Get all projects (Admin)
 *     description: Retrieve paginated list of all projects including drafts and archived
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
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
 *         description: Paginated list of all projects
 *       401:
 *         description: Authentication required
 */
router.get("/", authorize("EDITOR"), projectQueryRules, validate, projectController.getAll);

/**
 * @swagger
 * /api/v1/admin/projects/stats:
 *   get:
 *     summary: Get project statistics
 *     description: Get aggregate statistics about projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Project statistics
 *       401:
 *         description: Authentication required
 */
router.get("/stats", authorize("ADMIN"), projectController.getStats);

/**
 * @swagger
 * /api/v1/admin/projects/{id}:
 *   get:
 *     summary: Get project by ID (Admin)
 *     description: Retrieve a single project by its ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Project details
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Project not found
 */
router.get("/:id", authorize("EDITOR"), projectIdRule, validate, projectController.getById);

/**
 * @swagger
 * /api/v1/admin/projects:
 *   post:
 *     summary: Create a new project
 *     description: Create a new project with optional technology associations
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProjectInput'
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 */
router.post("/", authorize("ADMIN"), createProjectRules, validate, projectController.create);

/**
 * @swagger
 * /api/v1/admin/projects/{id}:
 *   put:
 *     summary: Update a project
 *     description: Update an existing project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProjectInput'
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Project not found
 */
router.put("/:id", authorize("ADMIN"), updateProjectRules, validate, projectController.update);

/**
 * @swagger
 * /api/v1/admin/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     description: Delete a project permanently
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Project not found
 */
router.delete("/:id", authorize("ADMIN"), projectIdRule, validate, projectController.remove);

export default router;
