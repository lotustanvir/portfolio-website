import * as messageService from "../services/message.service.js";
import {
  successResponse,
  createdResponse,
  paginatedResponse,
} from "../helpers/response.js";

export async function create(req, res, next) {
  try {
    const message = await messageService.create(req.body);
    createdResponse(res, {
      data: { message },
      message: "Message sent successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllAdmin(req, res, next) {
  try {
    const result = await messageService.getAllAdmin(req.query);
    paginatedResponse(res, {
      data: result.data,
      total: result.pagination.total,
      page: result.pagination.page,
      limit: result.pagination.limit,
      message: "Messages fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const message = await messageService.getById(req.params.id);
    successResponse(res, {
      data: { message },
      message: "Message fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMessage(req, res, next) {
  try {
    const message = await messageService.update(req.params.id, req.body);
    successResponse(res, {
      data: { message },
      message: "Message updated successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function markRead(req, res, next) {
  try {
    const message = await messageService.markRead(req.params.id, req.body.isRead);
    successResponse(res, {
      data: { message },
      message: `Message marked as ${message.isRead ? "read" : "unread"}`,
    });
  } catch (error) {
    next(error);
  }
}

export async function archive(req, res, next) {
  try {
    const message = await messageService.archive(req.params.id, req.body.isArchived);
    successResponse(res, {
      data: { message },
      message: `Message ${message.isArchived ? "archived" : "unarchived"} successfully`,
    });
  } catch (error) {
    next(error);
  }
}

export async function reply(req, res, next) {
  try {
    const adminName = req.user ? req.user.name : "Admin";
    const message = await messageService.reply(req.params.id, req.body.replyMessage, adminName);
    successResponse(res, {
      data: { message },
      message: "Reply sent successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    await messageService.deleteMessage(req.params.id);
    successResponse(res, {
      message: "Message deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getStats(req, res, next) {
  try {
    const stats = await messageService.getStats();
    successResponse(res, {
      data: { stats },
      message: "Message statistics fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function exportCSV(req, res, next) {
  try {
    const csv = await messageService.exportCSV(req.query);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=messages-export.csv");
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
}
