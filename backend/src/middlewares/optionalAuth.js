import { verifyAccessToken } from "../utils/jwt.js";
import prisma from "../config/database.js";

export default async function optionalAuth(req, _res, next) {
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
      req.user = null;
      return next();
    }

    const decoded = verifyAccessToken(token);

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.sub },
      select: { id: true, name: true, email: true, role: true, profileImage: true },
    });

    req.user = admin || null;
  } catch {
    req.user = null;
  }

  next();
}
