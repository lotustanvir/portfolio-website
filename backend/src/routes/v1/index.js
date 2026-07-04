import { Router } from "express";
import { successResponse } from "../../helpers/response.js";
import authRoutes from "./auth.routes.js";
import projectRoutes from "./project.routes.js";
import skillRoutes from "./skill.routes.js";
import experienceRoutes from "./experience.routes.js";
import educationRoutes from "./education.routes.js";
import certificateRoutes from "./certificate.routes.js";
import resumeRoutes from "./resume.routes.js";
import contactRoutes from "./contact.routes.js";
import settingRoutes from "./setting.routes.js";
import adminRoutes from "./admin/index.js";

const router = Router();

// Health check
router.get("/health", (_req, res) => {
  successResponse(res, {
    message: "API v1 is running",
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

// Auth routes
router.use("/auth", authRoutes);

// Public resource routes
router.use("/projects", projectRoutes);
router.use("/skills", skillRoutes);
router.use("/experience", experienceRoutes);
router.use("/education", educationRoutes);
router.use("/certificates", certificateRoutes);
router.use("/resume", resumeRoutes);
router.use("/contact", contactRoutes);
router.use("/settings", settingRoutes);

// Admin routes
router.use("/admin", adminRoutes);

export default router;
