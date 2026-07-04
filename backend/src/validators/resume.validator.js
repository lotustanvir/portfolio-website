import { body, param, query } from "express-validator";

export const createResumeRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),
  body("version")
    .trim()
    .notEmpty()
    .withMessage("Version is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Version must be between 1 and 50 characters"),
  body("fileUrl")
    .trim()
    .notEmpty()
    .withMessage("File URL is required")
    .isString()
    .withMessage("File URL must be a string"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

export const updateResumeRules = [
  param("id")
    .isUUID()
    .withMessage("Invalid resume ID"),
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),
  body("version")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Version must be between 1 and 50 characters"),
  body("fileUrl")
    .optional()
    .trim()
    .isString()
    .withMessage("File URL must be a string"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

export const resumeQueryRules = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .toInt()
    .withMessage("Limit must be between 1 and 100"),
  query("sort")
    .optional()
    .isIn(["uploadedAt", "updatedAt", "title", "version", "downloadCount"])
    .withMessage("Sort must be uploadedAt, updatedAt, title, version, or downloadCount"),
  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Order must be asc or desc"),
  query("search")
    .optional()
    .trim()
    .isString()
    .withMessage("Search must be a string"),
];

export const resumeIdRule = [
  param("id").isUUID().withMessage("Invalid resume ID"),
];

export const activateRules = [
  param("id").isUUID().withMessage("Invalid resume ID"),
];
