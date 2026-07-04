import prisma from "../config/database.js";

export async function findAdminByEmail(email) {
  return prisma.admin.findUnique({ where: { email } });
}

export async function findAdminById(id) {
  return prisma.admin.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profileImage: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });
}

export async function findAdminByIdWithPassword(id) {
  return prisma.admin.findUnique({ where: { id } });
}

export async function createAdmin(data) {
  return prisma.admin.create({ data });
}

export async function updateAdmin(id, data) {
  return prisma.admin.update({ where: { id }, data });
}

export async function incrementLoginAttempts(id) {
  return prisma.admin.update({
    where: { id },
    data: {
      failedLoginAttempts: { increment: 1 },
    },
  });
}

export async function resetLoginAttempts(id) {
  return prisma.admin.update({
    where: { id },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
    },
  });
}

export async function lockAccount(id, lockedUntil) {
  return prisma.admin.update({
    where: { id },
    data: { lockedUntil },
  });
}

export async function findAdminByResetToken(tokenHash) {
  return prisma.admin.findFirst({
    where: {
      passwordResetToken: tokenHash,
      passwordResetExpires: { gt: new Date() },
    },
  });
}

// ── Refresh Tokens ─────────────────────────────

export async function createRefreshToken(data) {
  return prisma.refreshToken.create({ data });
}

export async function findRefreshTokenByHash(tokenHash) {
  return prisma.refreshToken.findUnique({ where: { tokenHash } });
}

export async function revokeRefreshToken(id) {
  return prisma.refreshToken.update({
    where: { id },
    data: { isRevoked: true },
  });
}

export async function revokeAllRefreshTokensForFamily(familyId) {
  return prisma.refreshToken.updateMany({
    where: { familyId },
    data: { isRevoked: true },
  });
}

export async function revokeAllRefreshTokensForAdmin(adminId) {
  return prisma.refreshToken.updateMany({
    where: { adminId },
    data: { isRevoked: true },
  });
}

export async function countActiveRefreshTokens(adminId) {
  return prisma.refreshToken.count({
    where: {
      adminId,
      isRevoked: false,
      expiresAt: { gt: new Date() },
    },
  });
}
