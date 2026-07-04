import { verifyAccessToken } from "../utils/jwt.js";
import { AuthenticationError } from "../errors/index.js";
import prisma from "../config/database.js";
import logger from "../config/logger.js";

export default async function authenticate(req, _res, next) {
  try {
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      token = req.cookies?.accessToken;
    }

    if (!token) {
      throw new AuthenticationError("Authentication required. No token provided.");
    }

    const decoded = verifyAccessToken(token);

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.sub },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileImage: true,
        passwordChangedAt: true,
      },
    });

    if (!admin) {
      throw new AuthenticationError("User no longer exists.");
    }

    if (admin.passwordChangedAt) {
      const changedAt = Math.floor(admin.passwordChangedAt.getTime() / 1000);
      if (decoded.iat < changedAt) {
        throw new AuthenticationError("Token expired after password change. Please login again.");
      }
    }

    req.user = admin;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      logger.warn({ err: error, requestId: req.id }, "JWT validation failed");
      throw new AuthenticationError("Invalid or expired token.");
    }
    throw error;
  }
}
