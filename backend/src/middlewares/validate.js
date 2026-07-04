import { validationResult } from "express-validator";
import { ValidationError } from "../errors/index.js";

export default function validate(req, _res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));
    throw new ValidationError("Validation failed", formatted);
  }
  next();
}
