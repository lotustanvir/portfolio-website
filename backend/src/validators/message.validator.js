import { body, param, query } from "express-validator";

export const createMessageRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Name must be between 1 and 100 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address")
    .normalizeEmail(),
  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required")
    .isLength({ min: 1, max: 200 })
    .withMessage("Subject must be between 1 and 200 characters"),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 10, max: 5000 })
    .withMessage("Message must be between 10 and 5000 characters"),
];

export const updateMessageRules = [
  param("id")
    .isUUID()
    .withMessage("Invalid message ID"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Name must be between 1 and 100 characters"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Email must be a valid email address"),
  body("subject")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Subject must be between 1 and 200 characters"),
  body("message")
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage("Message must be between 10 and 5000 characters"),
];

export const messageQueryRules = [
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
    .isIn(["createdAt", "updatedAt", "name", "email", "subject"])
    .withMessage("Sort must be createdAt, updatedAt, name, email, or subject"),
  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Order must be asc or desc"),
  query("search")
    .optional()
    .trim()
    .isString()
    .withMessage("Search must be a string"),
  query("isRead")
    .optional()
    .isIn(["true", "false"])
    .withMessage("isRead must be true or false"),
  query("isArchived")
    .optional()
    .isIn(["true", "false"])
    .withMessage("isArchived must be true or false"),
  query("isReplied")
    .optional()
    .isIn(["true", "false"])
    .withMessage("isReplied must be true or false"),
];

export const messageIdRule = [
  param("id").isUUID().withMessage("Invalid message ID"),
];

export const replyRules = [
  param("id").isUUID().withMessage("Invalid message ID"),
  body("replyMessage")
    .trim()
    .notEmpty()
    .withMessage("Reply message is required")
    .isLength({ min: 1, max: 5000 })
    .withMessage("Reply message must be between 1 and 5000 characters"),
];

export const markReadRules = [
  param("id").isUUID().withMessage("Invalid message ID"),
  body("isRead")
    .notEmpty()
    .withMessage("isRead is required")
    .isBoolean()
    .withMessage("isRead must be a boolean"),
];

export const archiveRules = [
  param("id").isUUID().withMessage("Invalid message ID"),
  body("isArchived")
    .notEmpty()
    .withMessage("isArchived is required")
    .isBoolean()
    .withMessage("isArchived must be a boolean"),
];
