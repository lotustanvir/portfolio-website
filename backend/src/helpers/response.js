export function successResponse(res, { data = null, message = "Success", statusCode = 200 } = {}) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
}

export function createdResponse(res, { data = null, message = "Created successfully" } = {}) {
  return successResponse(res, { data, message, statusCode: 201 });
}

export function errorResponse(res, { message = "Error", statusCode = 500, errors = null } = {}) {
  const body = {
    success: false,
    error: { message },
    timestamp: new Date().toISOString(),
  };
  if (errors) {
    body.error.errors = errors;
  }
  return res.status(statusCode).json(body);
}

export function paginatedResponse(res, { data = [], total = 0, page = 1, limit = 10, message = "Success" } = {}) {
  const totalPages = Math.ceil(total / limit) || 1;
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
    timestamp: new Date().toISOString(),
  });
}
