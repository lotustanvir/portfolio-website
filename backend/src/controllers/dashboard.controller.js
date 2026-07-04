import * as dashboardService from "../services/dashboard.service.js";
import { successResponse } from "../helpers/response.js";

export async function getDashboard(req, res, next) {
  try {
    const data = await dashboardService.getDashboard();
    successResponse(res, {
      data,
      message: "Dashboard data fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}
