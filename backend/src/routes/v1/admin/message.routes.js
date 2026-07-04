import { Router } from "express";
import * as messageController from "../../../controllers/message.controller.js";
import { authenticate, authorize, validate } from "../../../middlewares/index.js";
import {
  updateMessageRules,
  messageQueryRules,
  messageIdRule,
  replyRules,
  markReadRules,
  archiveRules,
} from "../../../validators/message.validator.js";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/v1/admin/messages:
 *   get:
 *     summary: Get all messages (Admin)
 *     description: Retrieve paginated list of all contact messages with filtering
 *     tags: [Messages]
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
 *         name: isRead
 *         schema:
 *           type: string
 *           enum: [true, false]
 *       - in: query
 *         name: isArchived
 *         schema:
 *           type: string
 *           enum: [true, false]
 *       - in: query
 *         name: isReplied
 *         schema:
 *           type: string
 *           enum: [true, false]
 *     responses:
 *       200:
 *         description: Paginated list of messages
 *       401:
 *         description: Authentication required
 */
router.get("/", authorize("EDITOR"), messageQueryRules, validate, messageController.getAllAdmin);

/**
 * @swagger
 * /api/v1/admin/messages/stats:
 *   get:
 *     summary: Get message statistics
 *     description: Get aggregate statistics about contact messages
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Message statistics
 */
router.get("/stats", authorize("EDITOR"), messageController.getStats);

/**
 * @swagger
 * /api/v1/admin/messages/export:
 *   get:
 *     summary: Export messages as CSV
 *     description: Download all messages as a CSV file with optional filters
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: string
 *           enum: [true, false]
 *       - in: query
 *         name: isArchived
 *         schema:
 *           type: string
 *           enum: [true, false]
 *     responses:
 *       200:
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Authentication required
 */
router.get("/export", authorize("ADMIN"), messageController.exportCSV);

/**
 * @swagger
 * /api/v1/admin/messages/{id}:
 *   get:
 *     summary: Get message by ID (Admin)
 *     description: Retrieve a single message by its ID
 *     tags: [Messages]
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
 *         description: Message details
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Message not found
 */
router.get("/:id", authorize("EDITOR"), messageIdRule, validate, messageController.getById);

/**
 * @swagger
 * /api/v1/admin/messages/{id}/read:
 *   patch:
 *     summary: Mark message as read/unread
 *     description: Toggle the read status of a message
 *     tags: [Messages]
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
 *               - isRead
 *             properties:
 *               isRead:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Message read status updated
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Message not found
 */
router.patch("/:id/read", authorize("EDITOR"), markReadRules, validate, messageController.markRead);

/**
 * @swagger
 * /api/v1/admin/messages/{id}/archive:
 *   patch:
 *     summary: Archive/unarchive a message
 *     description: Toggle the archive status of a message
 *     tags: [Messages]
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
 *               - isArchived
 *             properties:
 *               isArchived:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Message archive status updated
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Message not found
 */
router.patch("/:id/archive", authorize("EDITOR"), archiveRules, validate, messageController.archive);

/**
 * @swagger
 * /api/v1/admin/messages/{id}/reply:
 *   post:
 *     summary: Reply to a message
 *     description: Mark message as replied with a reply message
 *     tags: [Messages]
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
 *               - replyMessage
 *             properties:
 *               replyMessage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reply sent successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Message not found
 */
router.post("/:id/reply", authorize("ADMIN"), replyRules, validate, messageController.reply);

/**
 * @swagger
 * /api/v1/admin/messages/{id}:
 *   put:
 *     summary: Update a message
 *     description: Update message details
 *     tags: [Messages]
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
 *             $ref: '#/components/schemas/UpdateMessageInput'
 *     responses:
 *       200:
 *         description: Message updated successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Message not found
 */
router.put("/:id", authorize("ADMIN"), updateMessageRules, validate, messageController.updateMessage);

/**
 * @swagger
 * /api/v1/admin/messages/{id}:
 *   delete:
 *     summary: Delete a message
 *     description: Permanently delete a message
 *     tags: [Messages]
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
 *         description: Message deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Message not found
 */
router.delete("/:id", authorize("ADMIN"), messageIdRule, validate, messageController.remove);

export default router;
