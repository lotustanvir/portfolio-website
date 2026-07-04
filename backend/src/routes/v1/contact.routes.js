import { Router } from "express";
import * as messageController from "../../controllers/message.controller.js";
import { validate } from "../../middlewares/index.js";
import { createMessageRules } from "../../validators/message.validator.js";
import contactRateLimiter from "../../middlewares/contactRateLimiter.js";

const router = Router();

/**
 * @swagger
 * /api/v1/contact:
 *   post:
 *     summary: Submit a contact message
 *     description: Send a message through the contact form. Rate limited to 5 messages per 15 minutes.
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMessageInput'
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Validation error
 *       429:
 *         description: Too many messages. Rate limit exceeded.
 */
router.post("/", contactRateLimiter, createMessageRules, validate, messageController.create);

export default router;
