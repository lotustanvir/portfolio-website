import * as projectService from "../services/project.service.js";
import {
  successResponse,
  createdResponse,
  paginatedResponse,
} from "../helpers/response.js";

export async function getAll(req, res, next) {
  try {
    const result = await projectService.getAll(req.query);
    paginatedResponse(res, {
      data: result.data,
      total: result.pagination.total,
      page: result.pagination.page,
      limit: result.pagination.limit,
      message: "Projects fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getBySlug(req, res, next) {
  try {
    const project = await projectService.getBySlug(req.params.slug);
    successResponse(res, {
      data: { project },
      message: "Project fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const project = await projectService.getById(req.params.id);
    successResponse(res, {
      data: { project },
      message: "Project fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const project = await projectService.create(req.body);
    createdResponse(res, {
      data: { project },
      message: "Project created successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const project = await projectService.update(req.params.id, req.body);
    successResponse(res, {
      data: { project },
      message: "Project updated successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    await projectService.deleteProject(req.params.id);
    successResponse(res, {
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getStats(req, res, next) {
  try {
    const stats = await projectService.getStats();
    successResponse(res, {
      data: { stats },
      message: "Project statistics fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}
