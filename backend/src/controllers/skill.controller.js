import * as skillService from "../services/skill.service.js";
import {
  successResponse,
  createdResponse,
  paginatedResponse,
} from "../helpers/response.js";

export async function getAll(req, res, next) {
  try {
    const result = await skillService.getAllPublic(req.query);
    paginatedResponse(res, {
      data: result.data,
      total: result.pagination.total,
      page: result.pagination.page,
      limit: result.pagination.limit,
      message: "Skills fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllAdmin(req, res, next) {
  try {
    const result = await skillService.getAllAdmin(req.query);
    paginatedResponse(res, {
      data: result.data,
      total: result.pagination.total,
      page: result.pagination.page,
      limit: result.pagination.limit,
      message: "Skills fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getBySlug(req, res, next) {
  try {
    const skill = await skillService.getBySlug(req.params.slug);
    successResponse(res, {
      data: { skill },
      message: "Skill fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const skill = await skillService.getById(req.params.id);
    successResponse(res, {
      data: { skill },
      message: "Skill fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getCategories(req, res, next) {
  try {
    const categories = await skillService.getCategories();
    successResponse(res, {
      data: { categories },
      message: "Skill categories fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const skill = await skillService.create(req.body);
    createdResponse(res, {
      data: { skill },
      message: "Skill created successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const skill = await skillService.update(req.params.id, req.body);
    successResponse(res, {
      data: { skill },
      message: "Skill updated successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    await skillService.deleteSkill(req.params.id);
    successResponse(res, {
      message: "Skill deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function reorder(req, res, next) {
  try {
    await skillService.reorder(req.body.orders);
    successResponse(res, {
      message: "Skills reordered successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleVisibility(req, res, next) {
  try {
    const skill = await skillService.toggleVisibility(req.params.id, req.body.isVisible);
    successResponse(res, {
      data: { skill },
      message: `Skill ${skill.isVisible ? "shown" : "hidden"} successfully`,
    });
  } catch (error) {
    next(error);
  }
}

export async function getStats(req, res, next) {
  try {
    const stats = await skillService.getStats();
    successResponse(res, {
      data: { stats },
      message: "Skill statistics fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}
