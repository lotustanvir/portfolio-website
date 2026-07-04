import { Router } from "express";
import * as experienceController from "../../../controllers/experience.controller.js";
import { authenticate, authorize, validate } from "../../../middlewares/index.js";
import {
  createExperienceRules,
  updateExperienceRules,
  experienceQueryRules,
  experienceIdRule,
  reorderRules,
  visibilityRules,
} from "../../../validators/experience.validator.js";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/v1/admin/experience:
 *   get:
 *     summary: Get all experiences (Admin)
 *     description: Retrieve paginated list of all experiences including hidden
 *     tags: [Experience]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: isCurrent
 *         schema:
 *           type: string
 *       - in: query
 *         name: company
 *         schema:
 *           type: string
 *       - in: query
 *         name: employmentType
 *         schema:
 *           type: string
 *       - in: query
 *         name: technologyIds
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated list of all experiences
 *       401:
 *         description: Authentication required
 */
router.get("/", authorize("EDITOR"), experienceQueryRules, validate, experienceController.getAllAdmin);

/**
 * @swagger
 * /api/v1/admin/experience/stats:
 *   get:
 *     summary: Get experience statistics
 *     description: Get aggregate statistics about experiences
 *     tags: [Experience]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Experience statistics
 */
router.get("/stats", authorize("ADMIN"), experienceController.getStats);

/**
 * @swagger
 * /api/v1/admin/experience/{id}:
 *   get:
 *     summary: Get experience by ID (Admin)
 *     description: Retrieve a single experience by its ID
 *     tags: [Experience]
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
 *         description: Experience details
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Experience not found
 */
router.get("/:id", authorize("EDITOR"), experienceIdRule, validate, experienceController.getByIdAdmin);

/**
 * @swagger
 * /api/v1/admin/experience/reorder:
 *   patch:
 *     summary: Reorder experiences
 *     description: Batch update display order for multiple experiences
 *     tags: [Experience]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orders
 *             properties:
 *               orders:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     displayOrder:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Experiences reordered successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.patch("/reorder", authorize("ADMIN"), reorderRules, validate, experienceController.reorder);

/**
 * @swagger
 * /api/v1/admin/experience:
 *   post:
 *     summary: Create a new experience
 *     description: Create a new experience entry
 *     tags: [Experience]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateExperienceInput'
 *     responses:
 *       201:
 *         description: Experience created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.post("/", authorize("ADMIN"), createExperienceRules, validate, experienceController.create);

/**
 * @swagger
 * /api/v1/admin/experience/{id}:
 *   put:
 *     summary: Update an experience
 *     description: Update an existing experience entry
 *     tags: [Experience]
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
 *             $ref: '#/components/schemas/UpdateExperienceInput'
 *     responses:
 *       200:
 *         description: Experience updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Experience not found
 */
router.put("/:id", authorize("ADMIN"), updateExperienceRules, validate, experienceController.update);

/**
 * @swagger
 * /api/v1/admin/experience/{id}/visibility:
 *   patch:
 *     summary: Toggle experience visibility
 *     description: Show or hide an experience from public APIs
 *     tags: [Experience]
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
 *             type: object
 *             required:
 *               - isVisible
 *             properties:
 *               isVisible:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Experience visibility updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Experience not found
 */
router.patch("/:id/visibility", authorize("ADMIN"), visibilityRules, validate, experienceController.toggleVisibility);

/**
 * @swagger
 * /api/v1/admin/experience/{id}:
 *   delete:
 *     summary: Delete an experience
 *     description: Permanently delete an experience entry
 *     tags: [Experience]
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
 *         description: Experience deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Experience not found
 */
router.delete("/:id", authorize("SUPER_ADMIN"), experienceIdRule, validate, experienceController.remove);

export default router;
