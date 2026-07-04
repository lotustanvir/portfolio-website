import crypto from "crypto";
import {
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/index.js";
import env from "../config/env.js";
import logger from "../config/logger.js";
import {
  AuthenticationError,
  ValidationError,
  ConflictError,
  NotFoundError,
} from "../errors/index.js";
import * as authRepository from "../repositories/auth.repository.js";
import * as emailService from "./email.service.js";

// ─────────────────────────────────────────────────
// Register
// ─────────────────────────────────────────────────

export async function register({ name, email, password }) {
  const existing = await authRepository.findAdminByEmail(email);
  if (existing) {
    throw new ConflictError("An admin with this email already exists");
  }

  const passwordErrors = validatePasswordStrength(password);
  if (passwordErrors.length > 0) {
    throw new ValidationError("Password validation failed", passwordErrors);
  }

  const hashedPassword = await hashPassword(password);

  const admin = await authRepository.createAdmin({
    name,
    email,
    password: hashedPassword,
    role: "ADMIN",
  });

  const tokens = await generateTokens(admin.id);

  logger.info({ adminId: admin.id, role: admin.role }, "Admin registered");

  return {
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
    ...tokens,
  };
}

// ─────────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────────

export async function login({ email, password, deviceInfo, ipAddress }) {
  const admin = await authRepository.findAdminByEmail(email);
  if (!admin) {
    throw new AuthenticationError("Invalid email or password");
  }

  if (admin.lockedUntil && new Date(admin.lockedUntil) > new Date()) {
    const remainingMs = new Date(admin.lockedUntil) - new Date();
    throw new AuthenticationError(
      `Account locked. Try again in ${Math.ceil(remainingMs / 60000)} minutes.`
    );
  }

  const isPasswordValid = await verifyPassword(password, admin.password);
  if (!isPasswordValid) {
    const attempts = admin.failedLoginAttempts + 1;
    await authRepository.incrementLoginAttempts(admin.id);

    if (attempts >= env.auth.maxLoginAttempts) {
      const lockedUntil = new Date(Date.now() + env.auth.lockoutDuration);
      await authRepository.lockAccount(admin.id, lockedUntil);
      logger.warn(
        { adminId: admin.id, attempts },
        "Account locked due to too many failed login attempts"
      );
      throw new AuthenticationError(
        `Account locked for ${env.auth.lockoutDuration / 60000} minutes due to too many failed attempts.`
      );
    }

    logger.warn(
      { adminId: admin.id, attempts },
      "Failed login attempt"
    );
    throw new AuthenticationError("Invalid email or password");
  }

  await authRepository.resetLoginAttempts(admin.id);

  const tokens = await generateTokens(admin.id, deviceInfo, ipAddress);

  logger.info({ adminId: admin.id }, "Admin logged in successfully");

  return {
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      profileImage: admin.profileImage,
    },
    ...tokens,
  };
}

// ─────────────────────────────────────────────────
// Logout
// ─────────────────────────────────────────────────

export async function logout(refreshTokenHash) {
  if (refreshTokenHash) {
    const token = await authRepository.findRefreshTokenByHash(refreshTokenHash);
    if (token) {
      await authRepository.revokeRefreshToken(token.id);
    }
  }
}

// ─────────────────────────────────────────────────
// Logout All Devices
// ─────────────────────────────────────────────────

export async function logoutAllDevices(adminId) {
  await authRepository.revokeAllRefreshTokensForAdmin(adminId);
}

// ─────────────────────────────────────────────────
// Refresh Access Token
// ─────────────────────────────────────────────────

export async function refreshAccessToken(refreshTokenValue, deviceInfo, ipAddress) {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshTokenValue);
  } catch {
    throw new AuthenticationError("Invalid or expired refresh token");
  }

  const tokenHash = hashToken(refreshTokenValue);
  const storedToken = await authRepository.findRefreshTokenByHash(tokenHash);

  if (!storedToken || storedToken.isRevoked) {
    if (storedToken) {
      // Token reuse detected — revoke entire family (potential theft)
      await authRepository.revokeAllRefreshTokensForFamily(storedToken.familyId);
      logger.warn(
        { familyId: storedToken.familyId, adminId: storedToken.adminId },
        "Refresh token reuse detected — family revoked"
      );
    }
    throw new AuthenticationError("Token has been revoked");
  }

  if (new Date(storedToken.expiresAt) < new Date()) {
    throw new AuthenticationError("Refresh token has expired");
  }

  // Rotate: revoke old, issue new
  await authRepository.revokeRefreshToken(storedToken.id);

  const tokens = await generateTokens(
    decoded.sub,
    deviceInfo,
    ipAddress,
    storedToken.familyId
  );

  return tokens;
}

// ─────────────────────────────────────────────────
// Get Current Admin
// ─────────────────────────────────────────────────

export async function getCurrentAdmin(adminId) {
  const admin = await authRepository.findAdminById(adminId);
  if (!admin) {
    throw new NotFoundError("Admin not found");
  }
  return admin;
}

// ─────────────────────────────────────────────────
// Change Password
// ─────────────────────────────────────────────────

export async function changePassword(adminId, currentPassword, newPassword) {
  const admin = await authRepository.findAdminByIdWithPassword(adminId);
  if (!admin) {
    throw new NotFoundError("Admin not found");
  }

  const isPasswordValid = await verifyPassword(currentPassword, admin.password);
  if (!isPasswordValid) {
    throw new AuthenticationError("Current password is incorrect");
  }

  const isSamePassword = await verifyPassword(newPassword, admin.password);
  if (isSamePassword) {
    throw new ValidationError("New password must be different from current password");
  }

  const passwordErrors = validatePasswordStrength(newPassword);
  if (passwordErrors.length > 0) {
    throw new ValidationError("Password validation failed", passwordErrors);
  }

  const hashedPassword = await hashPassword(newPassword);

  await authRepository.updateAdmin(adminId, {
    password: hashedPassword,
    passwordChangedAt: new Date(),
  });

  // Revoke all existing sessions
  await authRepository.revokeAllRefreshTokensForAdmin(adminId);

  logger.info({ adminId }, "Password changed successfully");
}

// ─────────────────────────────────────────────────
// Forgot Password
// ─────────────────────────────────────────────────

export async function forgotPassword(email) {
  const admin = await authRepository.findAdminByEmail(email);
  if (!admin) {
    return { message: "If the email exists, a reset link has been sent." };
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

  await authRepository.updateAdmin(admin.id, {
    passwordResetToken: resetTokenHash,
    passwordResetExpires: new Date(Date.now() + env.auth.passwordResetExpires),
  });

  const resetUrl = `${env.app.frontendUrl}/reset-password?token=${resetToken}`;
  const template = emailService.getPasswordResetTemplate(resetUrl);

  await emailService.sendEmail({
    to: admin.email,
    subject: template.subject,
    html: template.html,
  });

  logger.info({ adminId: admin.id }, "Password reset email sent");

  return { message: "If the email exists, a reset link has been sent." };
}

// ─────────────────────────────────────────────────
// Reset Password
// ─────────────────────────────────────────────────

export async function resetPassword(token, newPassword) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const admin = await authRepository.findAdminByResetToken(tokenHash);

  if (!admin) {
    throw new AuthenticationError("Invalid or expired reset token");
  }

  const passwordErrors = validatePasswordStrength(newPassword);
  if (passwordErrors.length > 0) {
    throw new ValidationError("Password validation failed", passwordErrors);
  }

  const hashedPassword = await hashPassword(newPassword);

  await authRepository.updateAdmin(admin.id, {
    password: hashedPassword,
    passwordResetToken: null,
    passwordResetExpires: null,
    passwordChangedAt: new Date(),
  });

  await authRepository.revokeAllRefreshTokensForAdmin(admin.id);

  const template = emailService.getPasswordChangedTemplate(admin.email);
  await emailService.sendEmail({
    to: admin.email,
    subject: template.subject,
    html: template.html,
  });

  logger.info({ adminId: admin.id }, "Password reset completed");
}

// ─────────────────────────────────────────────────
// Update Profile
// ─────────────────────────────────────────────────

export async function updateProfile(adminId, data) {
  const admin = await authRepository.findAdminById(adminId);
  if (!admin) {
    throw new NotFoundError("Admin not found");
  }

  if (data.email && data.email !== admin.email) {
    const existing = await authRepository.findAdminByEmail(data.email);
    if (existing) {
      throw new ConflictError("Email is already in use");
    }
  }

  const updated = await authRepository.updateAdmin(adminId, data);

  logger.info({ adminId }, "Profile updated");

  return {
    id: updated.id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    profileImage: updated.profileImage,
  };
}

// ─────────────────────────────────────────────────
// Update Profile Image
// ─────────────────────────────────────────────────

export async function updateProfileImage(adminId, profileImage) {
  const admin = await authRepository.updateAdmin(adminId, { profileImage });

  logger.info({ adminId }, "Profile image updated");

  return {
    id: admin.id,
    profileImage: admin.profileImage,
  };
}

// ─────────────────────────────────────────────────
// Verify Access Token
// ─────────────────────────────────────────────────

export async function verifyAccess(token) {
  const decoded = verifyAccessToken(token);
  const admin = await authRepository.findAdminById(decoded.sub);
  if (!admin) {
    throw new NotFoundError("Admin not found");
  }
  return admin;
}

// ─────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────

async function generateTokens(adminId, deviceInfo = null, ipAddress = null, familyId = null) {
  const jti = crypto.randomUUID();
  const payload = { sub: adminId, jti };

  const accessToken = signAccessToken(payload);
  const refreshTokenValue = signRefreshToken(payload);

  if (!familyId) {
    familyId = crypto.randomUUID();
  }

  const tokenHash = hashToken(refreshTokenValue);
  const decodedRefresh = verifyRefreshToken(refreshTokenValue);

  await authRepository.createRefreshToken({
    adminId,
    tokenHash,
    familyId,
    deviceInfo,
    ipAddress,
    expiresAt: new Date(decodedRefresh.exp * 1000),
  });

  return { accessToken, refreshToken: refreshTokenValue };
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
