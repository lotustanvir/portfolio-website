import { Router } from "express";
import * as settingController from "../../../controllers/setting.controller.js";
import { authenticate, authorize, validate } from "../../../middlewares/index.js";
import { updateSettingsRules } from "../../../validators/setting.validator.js";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/v1/admin/settings:
 *   get:
 *     summary: Get website settings (Admin)
 *     description: Retrieve all website settings including all fields
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Website settings
 *       401:
 *         description: Authentication required
 */
router.get("/", authorize("EDITOR"), settingController.getAdmin);

/**
 * @swagger
 * /api/v1/admin/settings:
 *   put:
 *     summary: Update website settings
 *     description: Update website settings. This is a singleton — settings are upserted.
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSettingsInput'
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.put("/", authorize("ADMIN"), updateSettingsRules, validate, settingController.update);

export default router;
