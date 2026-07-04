import { body } from "express-validator";

export const registerRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 12 })
    .withMessage("Password must be at least 12 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain a lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain a number")
    .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/)
    .withMessage("Password must contain a special character"),
];

export const loginRules = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

export const changePasswordRules = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 12 })
    .withMessage("New password must be at least 12 characters")
    .matches(/[A-Z]/)
    .withMessage("New password must contain an uppercase letter")
    .matches(/[a-z]/)
    .withMessage("New password must contain a lowercase letter")
    .matches(/[0-9]/)
    .withMessage("New password must contain a number")
    .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/)
    .withMessage("New password must contain a special character"),
];

export const forgotPasswordRules = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
];

export const resetPasswordRules = [
  body("token")
    .notEmpty()
    .withMessage("Reset token is required"),
  body("password")
    .isLength({ min: 12 })
    .withMessage("Password must be at least 12 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain a lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain a number")
    .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/)
    .withMessage("Password must contain a special character"),
];

export const updateProfileRules = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
];

export const updateProfileImageRules = [
  body("profileImage")
    .notEmpty()
    .withMessage("Profile image URL is required")
    .isURL()
    .withMessage("Profile image must be a valid URL"),
];
