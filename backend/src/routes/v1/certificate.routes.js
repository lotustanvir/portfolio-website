import { Router } from "express";
import * as certificateController from "../../controllers/certificate.controller.js";
import { validate } from "../../middlewares/index.js";
import { certificateQueryRules, certificateIdRule } from "../../validators/certificate.validator.js";

const router = Router();

/**
 * @swagger
 * /api/v1/certificates:
 *   get:
 *     summary: Get all visible certificates
 *     description: Retrieve paginated list of visible certificates with filtering, sorting, and search
 *     tags: [Certificates]
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
 *           enum: [issueDate, expiryDate, createdAt, updatedAt, title, issuer, displayOrder]
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
 *         name: issuer
 *         schema:
 *           type: string
 *       - in: query
 *         name: skillIds
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated list of visible certificates
 */
router.get("/", certificateQueryRules, validate, certificateController.getAll);

/**
 * @swagger
 * /api/v1/certificates/{id}:
 *   get:
 *     summary: Get certificate by ID
 *     description: Retrieve a single visible certificate by its ID
 *     tags: [Certificates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Certificate details
 *       404:
 *         description: Certificate not found
 */
router.get("/:id", certificateIdRule, validate, certificateController.getById);

export default router;
