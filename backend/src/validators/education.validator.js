import { body, param, query } from "express-validator";

export const createEducationRules = [
  body("institution")
    .trim()
    .notEmpty()
    .withMessage("Institution is required")
    .isLength({ min: 1, max: 200 })
    .withMessage("Institution must be between 1 and 200 characters"),
  body("degree")
    .trim()
    .notEmpty()
    .withMessage("Degree is required")
    .isLength({ min: 1, max: 200 })
    .withMessage("Degree must be between 1 and 200 characters"),
  body("department")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 200 })
    .withMessage("Department must be at most 200 characters"),
  body("cgpa")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 20 })
    .withMessage("CGPA must be at most 20 characters"),
  body("startYear")
    .notEmpty()
    .withMessage("Start year is required")
    .isInt({ min: 1900, max: 2100 })
    .withMessage("Start year must be between 1900 and 2100"),
  body("endYear")
    .optional({ values: "falsy" })
    .isInt({ min: 1900, max: 2100 })
    .withMessage("End year must be between 1900 and 2100"),
  body("isCurrent")
    .optional()
    .isBoolean()
    .withMessage("isCurrent must be a boolean"),
  body("description")
    .optional({ values: "falsy" })
    .trim()
    .isString()
    .withMessage("Description must be a string"),
  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer"),
  body("isVisible")
    .optional()
    .isBoolean()
    .withMessage("isVisible must be a boolean"),
];

export const updateEducationRules = [
  param("id")
    .isUUID()
    .withMessage("Invalid education ID"),
  body("institution")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Institution must be between 1 and 200 characters"),
  body("degree")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Degree must be between 1 and 200 characters"),
  body("department")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 200 })
    .withMessage("Department must be at most 200 characters"),
  body("cgpa")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 20 })
    .withMessage("CGPA must be at most 20 characters"),
  body("startYear")
    .optional()
    .isInt({ min: 1900, max: 2100 })
    .withMessage("Start year must be between 1900 and 2100"),
  body("endYear")
    .optional({ values: "falsy" })
    .isInt({ min: 1900, max: 2100 })
    .withMessage("End year must be between 1900 and 2100"),
  body("isCurrent")
    .optional()
    .isBoolean()
    .withMessage("isCurrent must be a boolean"),
  body("description")
    .optional({ values: "falsy" })
    .trim()
    .isString()
    .withMessage("Description must be a string"),
  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer"),
  body("isVisible")
    .optional()
    .isBoolean()
    .withMessage("isVisible must be a boolean"),
];

export const educationQueryRules = [
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
    .isIn(["startYear", "endYear", "createdAt", "updatedAt", "institution", "degree", "displayOrder"])
    .withMessage("Sort must be startYear, endYear, createdAt, updatedAt, institution, degree, or displayOrder"),
  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Order must be asc or desc"),
  query("search")
    .optional()
    .trim()
    .isString()
    .withMessage("Search must be a string"),
  query("institution")
    .optional()
    .trim()
    .isString()
    .withMessage("Institution must be a string"),
  query("degree")
    .optional()
    .trim()
    .isString()
    .withMessage("Degree must be a string"),
];

export const educationIdRule = [
  param("id").isUUID().withMessage("Invalid education ID"),
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
  param("id").isUUID().withMessage("Invalid education ID"),
  body("isVisible")
    .notEmpty()
    .withMessage("isVisible is required")
    .isBoolean()
    .withMessage("isVisible must be a boolean"),
];
