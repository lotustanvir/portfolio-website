import { body, param, query } from "express-validator";
import { PROJECT_CATEGORIES } from "../constants/index.js";

export const createProjectRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isIn(PROJECT_CATEGORIES)
    .withMessage(`Category must be one of: ${PROJECT_CATEGORIES.join(", ")}`),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  body("image")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("Image must be a valid URL"),
  body("liveDemo")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("Live demo must be a valid URL"),
  body("github")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("GitHub URL must be a valid URL"),
  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be a boolean"),
  body("status")
    .optional()
    .isIn(["DRAFT", "PUBLISHED", "ARCHIVED"])
    .withMessage("Status must be DRAFT, PUBLISHED, or ARCHIVED"),
  body("technologyIds")
    .optional()
    .isArray()
    .withMessage("Technology IDs must be an array"),
  body("technologyIds.*")
    .optional()
    .isUUID()
    .withMessage("Each technology ID must be a valid UUID"),
];

export const updateProjectRules = [
  param("id")
    .isUUID()
    .withMessage("Invalid project ID"),
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),
  body("category")
    .optional()
    .trim()
    .isIn(PROJECT_CATEGORIES)
    .withMessage(`Category must be one of: ${PROJECT_CATEGORIES.join(", ")}`),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  body("image")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("Image must be a valid URL"),
  body("liveDemo")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("Live demo must be a valid URL"),
  body("github")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("GitHub URL must be a valid URL"),
  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be a boolean"),
  body("status")
    .optional()
    .isIn(["DRAFT", "PUBLISHED", "ARCHIVED"])
    .withMessage("Status must be DRAFT, PUBLISHED, or ARCHIVED"),
  body("technologyIds")
    .optional()
    .isArray()
    .withMessage("Technology IDs must be an array"),
  body("technologyIds.*")
    .optional()
    .isUUID()
    .withMessage("Each technology ID must be a valid UUID"),
];

export const projectQueryRules = [
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
    .isIn(["createdAt", "updatedAt", "title"])
    .withMessage("Sort must be createdAt, updatedAt, or title"),
  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Order must be asc or desc"),
  query("search")
    .optional()
    .trim()
    .isString()
    .withMessage("Search must be a string"),
  query("status")
    .optional()
    .isIn(["DRAFT", "PUBLISHED", "ARCHIVED"])
    .withMessage("Status must be DRAFT, PUBLISHED, or ARCHIVED"),
  query("featured")
    .optional()
    .isIn(["true", "false"])
    .withMessage("Featured must be true or false"),
  query("category")
    .optional()
    .trim()
    .isIn(PROJECT_CATEGORIES)
    .withMessage(`Category must be one of: ${PROJECT_CATEGORIES.join(", ")}`),
  query("technologyIds")
    .optional()
    .isString()
    .withMessage("Technology IDs must be a comma-separated string"),
];

export const projectIdRule = [
  param("id").isUUID().withMessage("Invalid project ID"),
];

export const projectSlugRule = [
  param("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required")
    .isString()
    .withMessage("Slug must be a string"),
];
