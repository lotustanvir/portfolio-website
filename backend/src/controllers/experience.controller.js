import * as experienceService from "../services/experience.service.js";
import {
  successResponse,
  createdResponse,
  paginatedResponse,
} from "../helpers/response.js";

export async function getAll(req, res, next) {
  try {
    const result = await experienceService.getAllPublic(req.query);
    paginatedResponse(res, {
      data: result.data,
      total: result.pagination.total,
      page: result.pagination.page,
      limit: result.pagination.limit,
      message: "Experiences fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllAdmin(req, res, next) {
  try {
    const result = await experienceService.getAllAdmin(req.query);
    paginatedResponse(res, {
      data: result.data,
      total: result.pagination.total,
      page: result.pagination.page,
      limit: result.pagination.limit,
      message: "Experiences fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const experience = await experienceService.getByIdPublic(req.params.id);
    successResponse(res, {
      data: { experience },
      message: "Experience fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getByIdAdmin(req, res, next) {
  try {
    const experience = await experienceService.getById(req.params.id);
    successResponse(res, {
      data: { experience },
      message: "Experience fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const experience = await experienceService.create(req.body);
    createdResponse(res, {
      data: { experience },
      message: "Experience created successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const experience = await experienceService.update(req.params.id, req.body);
    successResponse(res, {
      data: { experience },
      message: "Experience updated successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    await experienceService.deleteExperience(req.params.id);
    successResponse(res, {
      message: "Experience deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function reorder(req, res, next) {
  try {
    await experienceService.reorder(req.body.orders);
    successResponse(res, {
      message: "Experiences reordered successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleVisibility(req, res, next) {
  try {
    const experience = await experienceService.toggleVisibility(req.params.id, req.body.isVisible);
    successResponse(res, {
      data: { experience },
      message: `Experience ${experience.isVisible ? "shown" : "hidden"} successfully`,
    });
  } catch (error) {
    next(error);
  }
}

export async function getStats(req, res, next) {
  try {
    const stats = await experienceService.getStats();
    successResponse(res, {
      data: { stats },
      message: "Experience statistics fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}
