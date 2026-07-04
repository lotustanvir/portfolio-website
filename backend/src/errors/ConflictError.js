import AppError from "./AppError.js";

export default class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, 409);
  }
}
