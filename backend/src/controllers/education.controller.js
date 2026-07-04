import * as educationService from "../services/education.service.js";
import {
  successResponse,
  createdResponse,
  paginatedResponse,
} from "../helpers/response.js";

export async function getAll(req, res, next) {
  try {
    const result = await educationService.getAllPublic(req.query);
    paginatedResponse(res, {
      data: result.data,
      total: result.pagination.total,
      page: result.pagination.page,
      limit: result.pagination.limit,
      message: "Education records fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllAdmin(req, res, next) {
  try {
    const result = await educationService.getAllAdmin(req.query);
    paginatedResponse(res, {
      data: result.data,
      total: result.pagination.total,
      page: result.pagination.page,
      limit: result.pagination.limit,
      message: "Education records fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const education = await educationService.getByIdPublic(req.params.id);
    successResponse(res, {
      data: { education },
      message: "Education record fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getByIdAdmin(req, res, next) {
  try {
    const education = await educationService.getById(req.params.id);
    successResponse(res, {
      data: { education },
      message: "Education record fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const education = await educationService.create(req.body);
    createdResponse(res, {
      data: { education },
      message: "Education record created successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const education = await educationService.update(req.params.id, req.body);
    successResponse(res, {
      data: { education },
      message: "Education record updated successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    await educationService.deleteEducation(req.params.id);
    successResponse(res, {
      message: "Education record deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function reorder(req, res, next) {
  try {
    await educationService.reorder(req.body.orders);
    successResponse(res, {
      message: "Education records reordered successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleVisibility(req, res, next) {
  try {
    const education = await educationService.toggleVisibility(req.params.id, req.body.isVisible);
    successResponse(res, {
      data: { education },
      message: `Education record ${education.isVisible ? "shown" : "hidden"} successfully`,
    });
  } catch (error) {
    next(error);
  }
}

export async function getStats(req, res, next) {
  try {
    const stats = await educationService.getStats();
    successResponse(res, {
      data: { stats },
      message: "Education statistics fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}
