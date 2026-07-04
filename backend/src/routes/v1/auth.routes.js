import { Router } from "express";
import { authenticate, authorize, authRateLimiter, validate } from "../../middlewares/index.js";
import {
  registerRules,
  loginRules,
  changePasswordRules,
  forgotPasswordRules,
  resetPasswordRules,
  updateProfileRules,
  updateProfileImageRules,
} from "../../validators/index.js";
import * as authController from "../../controllers/auth.controller.js";

const router = Router();

// Public routes (rate limited)
router.post("/register", authRateLimiter, registerRules, validate, authController.register);
router.post("/login", authRateLimiter, loginRules, validate, authController.login);
router.post("/forgot-password", authRateLimiter, forgotPasswordRules, validate, authController.forgotPassword);
router.post("/reset-password", authRateLimiter, resetPasswordRules, validate, authController.resetPassword);

// Protected routes
router.post("/refresh", authController.refresh);
router.get("/verify", authController.verify);

router.use(authenticate);

router.get("/me", authController.getMe);
router.post("/logout", authController.logout);
router.post("/logout-all", authController.logoutAllDevices);
router.patch("/change-password", changePasswordRules, validate, authController.changePassword);
router.patch("/profile", updateProfileRules, validate, authController.updateProfile);
router.patch("/profile-image", updateProfileImageRules, validate, authController.updateProfileImage);

export default router;
