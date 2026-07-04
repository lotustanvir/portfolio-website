import { Router } from "express";
import * as dashboardController from "../../../controllers/dashboard.controller.js";
import { authenticate, authorize } from "../../../middlewares/index.js";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/v1/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard data
 *     description: Retrieve aggregated dashboard data including totals, latest items, and statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardResponse'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 */
router.get("/", authorize("ADMIN"), dashboardController.getDashboard);

export default router;
