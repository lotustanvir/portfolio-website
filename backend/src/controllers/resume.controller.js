import * as resumeService from "../services/resume.service.js";
import {
  successResponse,
  createdResponse,
  paginatedResponse,
} from "../helpers/response.js";

export async function getActive(req, res, next) {
  try {
    const resume = await resumeService.getActivePublic();
    successResponse(res, {
      data: { resume },
      message: "Active resume fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function download(req, res, next) {
  try {
    const result = await resumeService.downloadActive();
    res.redirect(result.fileUrl);
  } catch (error) {
    next(error);
  }
}

export async function getAllAdmin(req, res, next) {
  try {
    const result = await resumeService.getAllAdmin(req.query);
    paginatedResponse(res, {
      data: result.data,
      total: result.pagination.total,
      page: result.pagination.page,
      limit: result.pagination.limit,
      message: "Resumes fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getActiveAdmin(req, res, next) {
  try {
    const resume = await resumeService.getActive();
    successResponse(res, {
      data: { resume },
      message: "Active resume fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const resume = await resumeService.getById(req.params.id);
    successResponse(res, {
      data: { resume },
      message: "Resume fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const resume = await resumeService.create(req.body);
    createdResponse(res, {
      data: { resume },
      message: "Resume created successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const resume = await resumeService.update(req.params.id, req.body);
    successResponse(res, {
      data: { resume },
      message: "Resume updated successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    await resumeService.deleteResume(req.params.id);
    successResponse(res, {
      message: "Resume deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function activate(req, res, next) {
  try {
    const resume = await resumeService.activate(req.params.id);
    successResponse(res, {
      data: { resume },
      message: "Resume activated successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getStats(req, res, next) {
  try {
    const stats = await resumeService.getStats();
    successResponse(res, {
      data: { stats },
      message: "Resume statistics fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadResume(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: "No PDF file provided" },
        timestamp: new Date().toISOString(),
      });
    }
    const fileUrl = `/uploads/resumes/${req.file.filename}`;
    successResponse(res, {
      data: { url: fileUrl, filename: req.file.filename, originalname: req.file.originalname },
      message: "Resume PDF uploaded successfully",
    });
  } catch (error) {
    next(error);
  }
}
