import crypto from "crypto";
import * as authService from "../services/auth.service.js";
import { successResponse, errorResponse } from "../helpers/response.js";
import {
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  getClearCookieOptions,
} from "../utils/cookie.js";

function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie("accessToken", accessToken, getAccessTokenCookieOptions());
  res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());
}

function clearAuthCookies(res) {
  res.cookie("accessToken", "", getClearCookieOptions());
  res.cookie("refreshToken", "", getClearCookieOptions());
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    setAuthCookies(res, result.accessToken, result.refreshToken);
    successResponse(res, {
      statusCode: 201,
      message: "Admin registered successfully",
      data: { admin: result.admin },
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.login({
      email: req.body.email,
      password: req.body.password,
      deviceInfo: req.headers["user-agent"],
      ipAddress: req.ip,
    });
    setAuthCookies(res, result.accessToken, result.refreshToken);
    successResponse(res, {
      message: "Login successful",
      data: { admin: result.admin },
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const tokenHash = refreshToken ? hashToken(refreshToken) : null;
    await authService.logout(tokenHash);
    clearAuthCookies(res);
    successResponse(res, { message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
}

export async function logoutAllDevices(req, res, next) {
  try {
    await authService.logoutAllDevices(req.user.id);
    clearAuthCookies(res);
    successResponse(res, { message: "Logged out from all devices" });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req, res, next) {
  try {
    const refreshTokenValue = req.cookies?.refreshToken;
    if (!refreshTokenValue) {
      return errorResponse(res, { statusCode: 401, message: "Refresh token not found" });
    }
    const tokens = await authService.refreshAccessToken(
      refreshTokenValue,
      req.headers["user-agent"],
      req.ip
    );
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    successResponse(res, { message: "Token refreshed successfully" });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    const admin = await authService.getCurrentAdmin(req.user.id);
    successResponse(res, { data: { admin } });
  } catch (error) {
    next(error);
  }
}

export async function verify(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;
    if (!token) {
      return errorResponse(res, { statusCode: 401, message: "No token provided" });
    }
    const admin = await authService.verifyAccess(token);
    successResponse(res, { data: { valid: true, admin } });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req, res, next) {
  try {
    await authService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
    clearAuthCookies(res);
    successResponse(res, { message: "Password changed successfully. Please login again." });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const result = await authService.forgotPassword(req.body.email);
    successResponse(res, { message: result.message });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req, res, next) {
  try {
    await authService.resetPassword(req.body.token, req.body.password);
    successResponse(res, { message: "Password has been reset successfully" });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const admin = await authService.updateProfile(req.user.id, req.body);
    successResponse(res, { message: "Profile updated", data: { admin } });
  } catch (error) {
    next(error);
  }
}

export async function updateProfileImage(req, res, next) {
  try {
    const result = await authService.updateProfileImage(req.user.id, req.body.profileImage);
    successResponse(res, { message: "Profile image updated", data: result });
  } catch (error) {
    next(error);
  }
}
