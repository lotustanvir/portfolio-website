import { body, param, query } from "express-validator";

export const createCertificateRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),
  body("issuer")
    .trim()
    .notEmpty()
    .withMessage("Issuer is required")
    .isLength({ min: 1, max: 200 })
    .withMessage("Issuer must be between 1 and 200 characters"),
  body("description")
    .optional({ values: "falsy" })
    .trim()
    .isString()
    .withMessage("Description must be a string"),
  body("issueDate")
    .notEmpty()
    .withMessage("Issue date is required")
    .isISO8601()
    .withMessage("Issue date must be a valid ISO 8601 date"),
  body("expiryDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Expiry date must be a valid ISO 8601 date"),
  body("credentialLink")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("Credential link must be a valid URL"),
  body("image")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("Image must be a string"),
  body("pdfUrl")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("PDF URL must be a string"),
  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer"),
  body("isVisible")
    .optional()
    .isBoolean()
    .withMessage("isVisible must be a boolean"),
  body("skillIds")
    .optional()
    .isArray()
    .withMessage("Skill IDs must be an array"),
  body("skillIds.*")
    .optional()
    .isUUID()
    .withMessage("Each skill ID must be a valid UUID"),
];

export const updateCertificateRules = [
  param("id")
    .isUUID()
    .withMessage("Invalid certificate ID"),
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),
  body("issuer")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Issuer must be between 1 and 200 characters"),
  body("description")
    .optional({ values: "falsy" })
    .trim()
    .isString()
    .withMessage("Description must be a string"),
  body("issueDate")
    .optional()
    .isISO8601()
    .withMessage("Issue date must be a valid ISO 8601 date"),
  body("expiryDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Expiry date must be a valid ISO 8601 date"),
  body("credentialLink")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("Credential link must be a valid URL"),
  body("image")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("Image must be a string"),
  body("pdfUrl")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("PDF URL must be a string"),
  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer"),
  body("isVisible")
    .optional()
    .isBoolean()
    .withMessage("isVisible must be a boolean"),
  body("skillIds")
    .optional()
    .isArray()
    .withMessage("Skill IDs must be an array"),
  body("skillIds.*")
    .optional()
    .isUUID()
    .withMessage("Each skill ID must be a valid UUID"),
];

export const certificateQueryRules = [
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
    .isIn(["issueDate", "expiryDate", "createdAt", "updatedAt", "title", "issuer", "displayOrder"])
    .withMessage("Sort must be issueDate, expiryDate, createdAt, updatedAt, title, issuer, or displayOrder"),
  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Order must be asc or desc"),
  query("search")
    .optional()
    .trim()
    .isString()
    .withMessage("Search must be a string"),
  query("issuer")
    .optional()
    .trim()
    .isString()
    .withMessage("Issuer must be a string"),
  query("skillIds")
    .optional()
    .isString()
    .withMessage("Skill IDs must be a comma-separated string"),
];

export const certificateIdRule = [
  param("id").isUUID().withMessage("Invalid certificate ID"),
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
  param("id").isUUID().withMessage("Invalid certificate ID"),
  body("isVisible")
    .notEmpty()
    .withMessage("isVisible is required")
    .isBoolean()
    .withMessage("isVisible must be a boolean"),
];
