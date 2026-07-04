import * as settingService from "../services/setting.service.js";
import { successResponse } from "../helpers/response.js";

export async function getPublic(req, res, next) {
  try {
    const settings = await settingService.getPublic();
    successResponse(res, {
      data: { settings },
      message: "Settings fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdmin(req, res, next) {
  try {
    const settings = await settingService.getAdmin();
    successResponse(res, {
      data: { settings },
      message: "Settings fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const settings = await settingService.update(req.body);
    successResponse(res, {
      data: { settings },
      message: "Settings updated successfully",
    });
  } catch (error) {
    next(error);
  }
}
