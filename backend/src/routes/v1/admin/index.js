import { Router } from "express";
import projectRoutes from "./project.routes.js";
import skillRoutes from "./skill.routes.js";
import experienceRoutes from "./experience.routes.js";
import educationRoutes from "./education.routes.js";
import certificateRoutes from "./certificate.routes.js";
import resumeRoutes from "./resume.routes.js";
import messageRoutes from "./message.routes.js";
import settingRoutes from "./setting.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

const router = Router();

router.use("/projects", projectRoutes);
router.use("/skills", skillRoutes);
router.use("/experience", experienceRoutes);
router.use("/education", educationRoutes);
router.use("/certificates", certificateRoutes);
router.use("/resume", resumeRoutes);
router.use("/messages", messageRoutes);
router.use("/settings", settingRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
