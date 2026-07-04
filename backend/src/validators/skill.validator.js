import { body, param, query } from "express-validator";
import { SKILL_CATEGORIES } from "../constants/index.js";

export const createSkillRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Name must be between 1 and 100 characters"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isIn(SKILL_CATEGORIES)
    .withMessage(`Category must be one of: ${SKILL_CATEGORIES.join(", ")}`),
  body("percentage")
    .notEmpty()
    .withMessage("Percentage is required")
    .isInt({ min: 0, max: 100 })
    .withMessage("Percentage must be between 0 and 100"),
  body("icon")
    .optional({ values: "falsy" })
    .trim()
    .isString()
    .withMessage("Icon must be a string"),
  body("color")
    .optional({ values: "falsy" })
    .trim()
    .matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)
    .withMessage("Color must be a valid hex color (e.g., #FF5733)"),
  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer"),
  body("isVisible")
    .optional()
    .isBoolean()
    .withMessage("isVisible must be a boolean"),
];

export const updateSkillRules = [
  param("id")
    .isUUID()
    .withMessage("Invalid skill ID"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Name must be between 1 and 100 characters"),
  body("category")
    .optional()
    .trim()
    .isIn(SKILL_CATEGORIES)
    .withMessage(`Category must be one of: ${SKILL_CATEGORIES.join(", ")}`),
  body("percentage")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Percentage must be between 0 and 100"),
  body("icon")
    .optional({ values: "falsy" })
    .trim()
    .isString()
    .withMessage("Icon must be a string"),
  body("color")
    .optional({ values: "falsy" })
    .trim()
    .matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)
    .withMessage("Color must be a valid hex color (e.g., #FF5733)"),
  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer"),
  body("isVisible")
    .optional()
    .isBoolean()
    .withMessage("isVisible must be a boolean"),
];

export const skillQueryRules = [
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
    .isIn(["displayOrder", "createdAt", "updatedAt", "name", "percentage"])
    .withMessage("Sort must be displayOrder, createdAt, updatedAt, name, or percentage"),
  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Order must be asc or desc"),
  query("search")
    .optional()
    .trim()
    .isString()
    .withMessage("Search must be a string"),
  query("category")
    .optional()
    .trim()
    .isIn(SKILL_CATEGORIES)
    .withMessage(`Category must be one of: ${SKILL_CATEGORIES.join(", ")}`),
];

export const skillIdRule = [
  param("id").isUUID().withMessage("Invalid skill ID"),
];

export const skillSlugRule = [
  param("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required")
    .isString()
    .withMessage("Slug must be a string"),
];

export const reorderRules = [
  body("orders")
    .isArray({ min: 1 })
    .withMessage("Orders must be a non-empty array"),
  body("orders.*.id")
    .isUUID()
    .withMessage("Each order entry must have a valid UUID id"),
  body("orders.*.displayOrder")
    .isInt({ min: 0 })
    .withMessage("Each order entry must have a non-negative displayOrder"),
];

export const visibilityRules = [
  param("id").isUUID().withMessage("Invalid skill ID"),
  body("isVisible")
    .notEmpty()
    .withMessage("isVisible is required")
    .isBoolean()
    .withMessage("isVisible must be a boolean"),
];
