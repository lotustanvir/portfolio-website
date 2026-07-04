import AppError from "./AppError.js";

export default class InternalServerError extends AppError {
  constructor(message = "Internal server error") {
    super(message, 500, false);
  }
}
