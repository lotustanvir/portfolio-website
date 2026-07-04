import env from "../config/env.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: "strict",
  path: "/",
};

export function getAccessTokenCookieOptions() {
  const maxAge = parseDurationToMs(env.jwt.accessExpiresIn);
  return { ...COOKIE_OPTIONS, maxAge };
}

export function getRefreshTokenCookieOptions() {
  const maxAge = parseDurationToMs(env.jwt.refreshExpiresIn);
  return { ...COOKIE_OPTIONS, maxAge, path: "/api/v1/auth" };
}

export function getClearCookieOptions() {
  return { ...COOKIE_OPTIONS, maxAge: 0 };
}

function parseDurationToMs(duration) {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return value * (multipliers[unit] || 86400000);
}
