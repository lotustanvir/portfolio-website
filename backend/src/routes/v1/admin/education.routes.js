import { Router } from "express";
import * as educationController from "../../../controllers/education.controller.js";
import { authenticate, authorize, validate } from "../../../middlewares/index.js";
import {
  createEducationRules,
  updateEducationRules,
  educationQueryRules,
  educationIdRule,
  reorderRules,
  visibilityRules,
} from "../../../validators/education.validator.js";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/v1/admin/education:
 *   get:
 *     summary: Get all education records (Admin)
 *     description: Retrieve paginated list of all education records including hidden
 *     tags: [Education]
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
 *         name: institution
 *         schema:
 *           type: string
 *       - in: query
 *         name: degree
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated list of all education records
 *       401:
 *         description: Authentication required
 */
router.get("/", authorize("EDITOR"), educationQueryRules, validate, educationController.getAllAdmin);

/**
 * @swagger
 * /api/v1/admin/education/stats:
 *   get:
 *     summary: Get education statistics
 *     description: Get aggregate statistics about education records
 *     tags: [Education]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Education statistics
 */
router.get("/stats", authorize("ADMIN"), educationController.getStats);

/**
 * @swagger
 * /api/v1/admin/education/{id}:
 *   get:
 *     summary: Get education record by ID (Admin)
 *     description: Retrieve a single education record by its ID
 *     tags: [Education]
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
 *         description: Education record details
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Education record not found
 */
router.get("/:id", authorize("EDITOR"), educationIdRule, validate, educationController.getByIdAdmin);

/**
 * @swagger
 * /api/v1/admin/education/reorder:
 *   patch:
 *     summary: Reorder education records
 *     description: Batch update display order for multiple education records
 *     tags: [Education]
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
 *         description: Education records reordered successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.patch("/reorder", authorize("ADMIN"), reorderRules, validate, educationController.reorder);

/**
 * @swagger
 * /api/v1/admin/education:
 *   post:
 *     summary: Create a new education record
 *     description: Create a new education entry
 *     tags: [Education]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEducationInput'
 *     responses:
 *       201:
 *         description: Education record created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.post("/", authorize("ADMIN"), createEducationRules, validate, educationController.create);

/**
 * @swagger
 * /api/v1/admin/education/{id}:
 *   put:
 *     summary: Update an education record
 *     description: Update an existing education entry
 *     tags: [Education]
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
 *             $ref: '#/components/schemas/UpdateEducationInput'
 *     responses:
 *       200:
 *         description: Education record updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Education record not found
 */
router.put("/:id", authorize("ADMIN"), updateEducationRules, validate, educationController.update);

/**
 * @swagger
 * /api/v1/admin/education/{id}/visibility:
 *   patch:
 *     summary: Toggle education record visibility
 *     description: Show or hide an education record from public APIs
 *     tags: [Education]
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
 *         description: Education record visibility updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Education record not found
 */
router.patch("/:id/visibility", authorize("ADMIN"), visibilityRules, validate, educationController.toggleVisibility);

/**
 * @swagger
 * /api/v1/admin/education/{id}:
 *   delete:
 *     summary: Delete an education record
 *     description: Permanently delete an education entry
 *     tags: [Education]
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
 *         description: Education record deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Education record not found
 */
router.delete("/:id", authorize("SUPER_ADMIN"), educationIdRule, validate, educationController.remove);

export default router;
