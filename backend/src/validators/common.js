import { body, param, query } from "express-validator";

export const mongoIdRule = (field = "id") =>
  param(field).isUUID().withMessage(`Invalid ${field}: must be a valid UUID`);

export const emailRule = (field = "email") =>
  body(field).isEmail().normalizeEmail().withMessage(`Invalid ${field}: must be a valid email address`);

export const stringRule = (field, { min = 1, max = 255, optional = false } = {}) => {
  const chain = body(field).trim();
  if (optional) {
    chain.optional();
  } else {
    chain.notEmpty().withMessage(`${field} is required`);
  }
  return chain
    .isLength({ min, max })
    .withMessage(`${field} must be between ${min} and ${max} characters`);
};

export const paginationRules = () => [
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
    .isString()
    .trim()
    .withMessage("Sort must be a string"),
  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Order must be 'asc' or 'desc'"),
];

export const booleanRule = (field, { optional = false } = {}) => {
  const chain = body(field);
  if (optional) chain.optional();
  return chain.isBoolean().withMessage(`${field} must be a boolean`);
};

export const urlRule = (field, { optional = false } = {}) => {
  const chain = body(field);
  if (optional) chain.optional();
  return chain.isURL().withMessage(`${field} must be a valid URL`);
};
