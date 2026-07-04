import * as certificateService from "../services/certificate.service.js";
import {
  successResponse,
  createdResponse,
  paginatedResponse,
} from "../helpers/response.js";

export async function getAll(req, res, next) {
  try {
    const result = await certificateService.getAllPublic(req.query);
    paginatedResponse(res, {
      data: result.data,
      total: result.pagination.total,
      page: result.pagination.page,
      limit: result.pagination.limit,
      message: "Certificates fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllAdmin(req, res, next) {
  try {
    const result = await certificateService.getAllAdmin(req.query);
    paginatedResponse(res, {
      data: result.data,
      total: result.pagination.total,
      page: result.pagination.page,
      limit: result.pagination.limit,
      message: "Certificates fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const certificate = await certificateService.getByIdPublic(req.params.id);
    successResponse(res, {
      data: { certificate },
      message: "Certificate fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getByIdAdmin(req, res, next) {
  try {
    const certificate = await certificateService.getById(req.params.id);
    successResponse(res, {
      data: { certificate },
      message: "Certificate fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const certificate = await certificateService.create(req.body);
    createdResponse(res, {
      data: { certificate },
      message: "Certificate created successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const certificate = await certificateService.update(req.params.id, req.body);
    successResponse(res, {
      data: { certificate },
      message: "Certificate updated successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    await certificateService.deleteCertificate(req.params.id);
    successResponse(res, {
      message: "Certificate deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function reorder(req, res, next) {
  try {
    await certificateService.reorder(req.body.orders);
    successResponse(res, {
      message: "Certificates reordered successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleVisibility(req, res, next) {
  try {
    const certificate = await certificateService.toggleVisibility(req.params.id, req.body.isVisible);
    successResponse(res, {
      data: { certificate },
      message: `Certificate ${certificate.isVisible ? "shown" : "hidden"} successfully`,
    });
  } catch (error) {
    next(error);
  }
}

export async function getStats(req, res, next) {
  try {
    const stats = await certificateService.getStats();
    successResponse(res, {
      data: { stats },
      message: "Certificate statistics fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: "No image file provided" },
        timestamp: new Date().toISOString(),
      });
    }
    const imageUrl = `/uploads/certificates/${req.file.filename}`;
    successResponse(res, {
      data: { url: imageUrl, filename: req.file.filename },
      message: "Image uploaded successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadPdf(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: "No PDF file provided" },
        timestamp: new Date().toISOString(),
      });
    }
    const pdfUrl = `/uploads/certificates/${req.file.filename}`;
    successResponse(res, {
      data: { url: pdfUrl, filename: req.file.filename },
      message: "PDF uploaded successfully",
    });
  } catch (error) {
    next(error);
  }
}
