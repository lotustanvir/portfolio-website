import { DEFAULT_PAGINATION } from "../constants/index.js";

export function getPaginationParams(query) {
  const page = Math.max(1, parseInt(query.page, 10) || DEFAULT_PAGINATION.page);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || DEFAULT_PAGINATION.limit));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function getSortParams(query, allowedFields = ["createdAt", "updatedAt", "name", "title"]) {
  const sort = allowedFields.includes(query.sort) ? query.sort : "createdAt";
  const order = query.order === "asc" ? "asc" : "desc";
  return { [sort]: order };
}

export function buildPaginationMeta(total, page, limit) {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
