import { Router } from "express";
import * as certificateController from "../../../controllers/certificate.controller.js";
import { authenticate, authorize, validate } from "../../../middlewares/index.js";
import { uploadImage, uploadPdf, handleUploadError } from "../../../middlewares/upload.js";
import {
  createCertificateRules,
  updateCertificateRules,
  certificateQueryRules,
  certificateIdRule,
  reorderRules,
  visibilityRules,
} from "../../../validators/certificate.validator.js";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/v1/admin/certificates:
 *   get:
 *     summary: Get all certificates (Admin)
 *     description: Retrieve paginated list of all certificates including hidden
 *     tags: [Certificates]
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
 *         name: issuer
 *         schema:
 *           type: string
 *       - in: query
 *         name: skillIds
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated list of all certificates
 *       401:
 *         description: Authentication required
 */
router.get("/", authorize("EDITOR"), certificateQueryRules, validate, certificateController.getAllAdmin);

/**
 * @swagger
 * /api/v1/admin/certificates/stats:
 *   get:
 *     summary: Get certificate statistics
 *     description: Get aggregate statistics about certificates
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Certificate statistics
 */
router.get("/stats", authorize("ADMIN"), certificateController.getStats);

/**
 * @swagger
 * /api/v1/admin/certificates/{id}:
 *   get:
 *     summary: Get certificate by ID (Admin)
 *     description: Retrieve a single certificate by its ID
 *     tags: [Certificates]
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
 *         description: Certificate details
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Certificate not found
 */
router.get("/:id", authorize("EDITOR"), certificateIdRule, validate, certificateController.getByIdAdmin);

/**
 * @swagger
 * /api/v1/admin/certificates/reorder:
 *   patch:
 *     summary: Reorder certificates
 *     description: Batch update display order for multiple certificates
 *     tags: [Certificates]
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
 *         description: Certificates reordered successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.patch("/reorder", authorize("ADMIN"), reorderRules, validate, certificateController.reorder);

/**
 * @swagger
 * /api/v1/admin/certificates/upload/image:
 *   post:
 *     summary: Upload certificate image
 *     description: Upload an image file (jpg, jpeg, png, webp, gif) max 5MB
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Invalid file or validation error
 *       401:
 *         description: Authentication required
 */
router.post("/upload/image", authorize("ADMIN"), uploadImage, handleUploadError, certificateController.uploadImage);

/**
 * @swagger
 * /api/v1/admin/certificates/upload/pdf:
 *   post:
 *     summary: Upload certificate PDF
 *     description: Upload a PDF file max 10MB
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - pdf
 *             properties:
 *               pdf:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: PDF uploaded successfully
 *       400:
 *         description: Invalid file or validation error
 *       401:
 *         description: Authentication required
 */
router.post("/upload/pdf", authorize("ADMIN"), uploadPdf, handleUploadError, certificateController.uploadPdf);

/**
 * @swagger
 * /api/v1/admin/certificates:
 *   post:
 *     summary: Create a new certificate
 *     description: Create a new certificate entry
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCertificateInput'
 *     responses:
 *       201:
 *         description: Certificate created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.post("/", authorize("ADMIN"), createCertificateRules, validate, certificateController.create);

/**
 * @swagger
 * /api/v1/admin/certificates/{id}:
 *   put:
 *     summary: Update a certificate
 *     description: Update an existing certificate entry
 *     tags: [Certificates]
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
 *             $ref: '#/components/schemas/UpdateCertificateInput'
 *     responses:
 *       200:
 *         description: Certificate updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Certificate not found
 */
router.put("/:id", authorize("ADMIN"), updateCertificateRules, validate, certificateController.update);

/**
 * @swagger
 * /api/v1/admin/certificates/{id}/visibility:
 *   patch:
 *     summary: Toggle certificate visibility
 *     description: Show or hide a certificate from public APIs
 *     tags: [Certificates]
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
 *         description: Certificate visibility updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Certificate not found
 */
router.patch("/:id/visibility", authorize("ADMIN"), visibilityRules, validate, certificateController.toggleVisibility);

/**
 * @swagger
 * /api/v1/admin/certificates/{id}:
 *   delete:
 *     summary: Delete a certificate
 *     description: Permanently delete a certificate entry
 *     tags: [Certificates]
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
 *         description: Certificate deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Certificate not found
 */
router.delete("/:id", authorize("SUPER_ADMIN"), certificateIdRule, validate, certificateController.remove);

export default router;
