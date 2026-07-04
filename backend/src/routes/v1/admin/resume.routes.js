import { Router } from "express";
import * as resumeController from "../../../controllers/resume.controller.js";
import { authenticate, authorize, validate } from "../../../middlewares/index.js";
import { uploadResumePdf, handleUploadError } from "../../../middlewares/upload.js";
import {
  createResumeRules,
  updateResumeRules,
  resumeQueryRules,
  resumeIdRule,
  activateRules,
} from "../../../validators/resume.validator.js";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/v1/admin/resume:
 *   get:
 *     summary: Get all resume versions (Admin)
 *     description: Retrieve paginated list of all resume versions
 *     tags: [Resume]
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
 *           enum: [uploadedAt, updatedAt, title, version, downloadCount]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated list of all resume versions
 *       401:
 *         description: Authentication required
 */
router.get("/", authorize("EDITOR"), resumeQueryRules, validate, resumeController.getAllAdmin);

/**
 * @swagger
 * /api/v1/admin/resume/active:
 *   get:
 *     summary: Get active resume (Admin)
 *     description: Retrieve the currently active resume with full details
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active resume details
 *       401:
 *         description: Authentication required
 *       404:
 *         description: No active resume found
 */
router.get("/active", authorize("EDITOR"), resumeController.getActiveAdmin);

/**
 * @swagger
 * /api/v1/admin/resume/stats:
 *   get:
 *     summary: Get resume statistics
 *     description: Get aggregate statistics about resumes
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resume statistics
 */
router.get("/stats", authorize("ADMIN"), resumeController.getStats);

/**
 * @swagger
 * /api/v1/admin/resume/upload:
 *   post:
 *     summary: Upload resume PDF
 *     description: Upload a PDF file for a resume (max 10MB)
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - resume
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Resume PDF uploaded successfully
 *       400:
 *         description: Invalid file
 *       401:
 *         description: Authentication required
 */
router.post("/upload", authorize("ADMIN"), uploadResumePdf, handleUploadError, resumeController.uploadResume);

/**
 * @swagger
 * /api/v1/admin/resume:
 *   post:
 *     summary: Create a new resume version
 *     description: Create a new resume entry with uploaded PDF URL
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateResumeInput'
 *     responses:
 *       201:
 *         description: Resume created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.post("/", authorize("ADMIN"), createResumeRules, validate, resumeController.create);

/**
 * @swagger
 * /api/v1/admin/resume/{id}:
 *   get:
 *     summary: Get resume by ID (Admin)
 *     description: Retrieve a single resume version by its ID
 *     tags: [Resume]
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
 *         description: Resume details
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Resume not found
 */
router.get("/:id", authorize("EDITOR"), resumeIdRule, validate, resumeController.getById);

/**
 * @swagger
 * /api/v1/admin/resume/{id}/activate:
 *   patch:
 *     summary: Activate a resume version
 *     description: Set a resume version as the active one (deactivates others)
 *     tags: [Resume]
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
 *         description: Resume activated successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Resume not found
 */
router.patch("/:id/activate", authorize("ADMIN"), activateRules, validate, resumeController.activate);

/**
 * @swagger
 * /api/v1/admin/resume/{id}:
 *   put:
 *     summary: Update a resume version
 *     description: Update metadata of an existing resume version
 *     tags: [Resume]
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
 *             $ref: '#/components/schemas/UpdateResumeInput'
 *     responses:
 *       200:
 *         description: Resume updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Resume not found
 */
router.put("/:id", authorize("ADMIN"), updateResumeRules, validate, resumeController.update);

/**
 * @swagger
 * /api/v1/admin/resume/{id}:
 *   delete:
 *     summary: Delete a resume version
 *     description: Permanently delete a resume version
 *     tags: [Resume]
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
 *         description: Resume deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Resume not found
 */
router.delete("/:id", authorize("SUPER_ADMIN"), resumeIdRule, validate, resumeController.remove);

export default router;
