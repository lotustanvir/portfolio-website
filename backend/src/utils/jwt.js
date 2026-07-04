import jwt from "jsonwebtoken";
import env from "../config/env.js";

export function signAccessToken(payload) {
  return jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn,
    issuer: env.app.name,
  });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
    issuer: env.app.name,
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.accessSecret, {
    issuer: env.app.name,
  });
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwt.refreshSecret, {
    issuer: env.app.name,
  });
}

export function decodeToken(token) {
  return jwt.decode(token);
}
