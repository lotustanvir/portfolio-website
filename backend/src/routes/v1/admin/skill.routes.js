import { Router } from "express";
import * as skillController from "../../../controllers/skill.controller.js";
import { authenticate, authorize, validate } from "../../../middlewares/index.js";
import {
  createSkillRules,
  updateSkillRules,
  skillQueryRules,
  skillIdRule,
  reorderRules,
  visibilityRules,
} from "../../../validators/skill.validator.js";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/v1/admin/skills:
 *   get:
 *     summary: Get all skills (Admin)
 *     description: Retrieve paginated list of all skills including hidden
 *     tags: [Skills]
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
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated list of all skills
 *       401:
 *         description: Authentication required
 */
router.get("/", authorize("EDITOR"), skillQueryRules, validate, skillController.getAllAdmin);

/**
 * @swagger
 * /api/v1/admin/skills/stats:
 *   get:
 *     summary: Get skill statistics
 *     description: Get aggregate statistics about skills
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Skill statistics
 */
router.get("/stats", authorize("ADMIN"), skillController.getStats);

/**
 * @swagger
 * /api/v1/admin/skills/categories:
 *   get:
 *     summary: Get all skill categories (Admin)
 *     description: Retrieve a list of distinct skill categories
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of skill categories
 */
router.get("/categories", authorize("EDITOR"), skillController.getCategories);

/**
 * @swagger
 * /api/v1/admin/skills/{id}:
 *   get:
 *     summary: Get skill by ID (Admin)
 *     description: Retrieve a single skill by its ID
 *     tags: [Skills]
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
 *         description: Skill details
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Skill not found
 */
router.get("/:id", authorize("EDITOR"), skillIdRule, validate, skillController.getById);

/**
 * @swagger
 * /api/v1/admin/skills/reorder:
 *   patch:
 *     summary: Reorder skills
 *     description: Batch update display order for multiple skills
 *     tags: [Skills]
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
 *         description: Skills reordered successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.patch("/reorder", authorize("ADMIN"), reorderRules, validate, skillController.reorder);

/**
 * @swagger
 * /api/v1/admin/skills:
 *   post:
 *     summary: Create a new skill
 *     description: Create a new skill with auto-generated slug
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSkillInput'
 *     responses:
 *       201:
 *         description: Skill created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       409:
 *         description: Skill with this name already exists
 */
router.post("/", authorize("ADMIN"), createSkillRules, validate, skillController.create);

/**
 * @swagger
 * /api/v1/admin/skills/{id}:
 *   put:
 *     summary: Update a skill
 *     description: Update an existing skill
 *     tags: [Skills]
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
 *             $ref: '#/components/schemas/UpdateSkillInput'
 *     responses:
 *       200:
 *         description: Skill updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Skill not found
 *       409:
 *         description: Skill with this name already exists
 */
router.put("/:id", authorize("ADMIN"), updateSkillRules, validate, skillController.update);

/**
 * @swagger
 * /api/v1/admin/skills/{id}/visibility:
 *   patch:
 *     summary: Toggle skill visibility
 *     description: Show or hide a skill from public APIs
 *     tags: [Skills]
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
 *         description: Skill visibility updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Skill not found
 */
router.patch("/:id/visibility", authorize("ADMIN"), visibilityRules, validate, skillController.toggleVisibility);

/**
 * @swagger
 * /api/v1/admin/skills/{id}:
 *   delete:
 *     summary: Delete a skill
 *     description: Permanently delete a skill (SUPER_ADMIN only)
 *     tags: [Skills]
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
 *         description: Skill deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only SUPER_ADMIN can delete skills
 *       404:
 *         description: Skill not found
 */
router.delete("/:id", authorize("SUPER_ADMIN"), skillIdRule, validate, skillController.remove);

export default router;
