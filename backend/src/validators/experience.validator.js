import { body, param, query } from "express-validator";

const EMPLOYMENT_TYPES = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "REMOTE",
  "FREELANCE",
];

export const createExperienceRules = [
  body("company")
    .trim()
    .notEmpty()
    .withMessage("Company is required")
    .isLength({ min: 1, max: 200 })
    .withMessage("Company must be between 1 and 200 characters"),
  body("position")
    .trim()
    .notEmpty()
    .withMessage("Position is required")
    .isLength({ min: 1, max: 200 })
    .withMessage("Position must be between 1 and 200 characters"),
  body("employmentType")
    .trim()
    .notEmpty()
    .withMessage("Employment type is required")
    .isIn(EMPLOYMENT_TYPES)
    .withMessage(`Employment type must be one of: ${EMPLOYMENT_TYPES.join(", ")}`),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  body("responsibilities")
    .optional({ values: "falsy" })
    .trim()
    .isString()
    .withMessage("Responsibilities must be a string"),
  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ min: 1, max: 200 })
    .withMessage("Location must be between 1 and 200 characters"),
  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),
  body("endDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date"),
  body("isCurrent")
    .optional()
    .isBoolean()
    .withMessage("isCurrent must be a boolean"),
  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer"),
  body("isVisible")
    .optional()
    .isBoolean()
    .withMessage("isVisible must be a boolean"),
  body("technologyIds")
    .optional()
    .isArray()
    .withMessage("Technology IDs must be an array"),
  body("technologyIds.*")
    .optional()
    .isUUID()
    .withMessage("Each technology ID must be a valid UUID"),
];

export const updateExperienceRules = [
  param("id")
    .isUUID()
    .withMessage("Invalid experience ID"),
  body("company")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Company must be between 1 and 200 characters"),
  body("position")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Position must be between 1 and 200 characters"),
  body("employmentType")
    .optional()
    .trim()
    .isIn(EMPLOYMENT_TYPES)
    .withMessage(`Employment type must be one of: ${EMPLOYMENT_TYPES.join(", ")}`),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  body("responsibilities")
    .optional({ values: "falsy" })
    .trim()
    .isString()
    .withMessage("Responsibilities must be a string"),
  body("location")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Location must be between 1 and 200 characters"),
  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),
  body("endDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date"),
  body("isCurrent")
    .optional()
    .isBoolean()
    .withMessage("isCurrent must be a boolean"),
  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer"),
  body("isVisible")
    .optional()
    .isBoolean()
    .withMessage("isVisible must be a boolean"),
  body("technologyIds")
    .optional()
    .isArray()
    .withMessage("Technology IDs must be an array"),
  body("technologyIds.*")
    .optional()
    .isUUID()
    .withMessage("Each technology ID must be a valid UUID"),
];

export const experienceQueryRules = [
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
    .isIn(["startDate", "endDate", "createdAt", "updatedAt", "company", "displayOrder"])
    .withMessage("Sort must be startDate, endDate, createdAt, updatedAt, company, or displayOrder"),
  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Order must be asc or desc"),
  query("search")
    .optional()
    .trim()
    .isString()
    .withMessage("Search must be a string"),
  query("isCurrent")
    .optional()
    .isIn(["true", "false"])
    .withMessage("isCurrent must be true or false"),
  query("company")
    .optional()
    .trim()
    .isString()
    .withMessage("Company must be a string"),
  query("employmentType")
    .optional()
    .trim()
    .isIn(EMPLOYMENT_TYPES)
    .withMessage(`Employment type must be one of: ${EMPLOYMENT_TYPES.join(", ")}`),
  query("technologyIds")
    .optional()
    .isString()
    .withMessage("Technology IDs must be a comma-separated string"),
];

export const experienceIdRule = [
  param("id").isUUID().withMessage("Invalid experience ID"),
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
  param("id").isUUID().withMessage("Invalid experience ID"),
  body("isVisible")
    .notEmpty()
    .withMessage("isVisible is required")
    .isBoolean()
    .withMessage("isVisible must be a boolean"),
];
