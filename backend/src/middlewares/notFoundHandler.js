import { NotFoundError } from "../errors/index.js";

export default function notFoundHandler(_req, _res, next) {
  next(new NotFoundError("Route not found"));
}
