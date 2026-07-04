export const API_PREFIX = "/api/v1";

export const AUTH = {
  LOGIN: `${API_PREFIX}/auth/login`,
  REGISTER: `${API_PREFIX}/auth/register`,
  LOGOUT: `${API_PREFIX}/auth/logout`,
  LOGOUT_ALL: `${API_PREFIX}/auth/logout-all`,
  REFRESH: `${API_PREFIX}/auth/refresh`,
  ME: `${API_PREFIX}/auth/me`,
  VERIFY: `${API_PREFIX}/auth/verify`,
  CHANGE_PASSWORD: `${API_PREFIX}/auth/change-password`,
  FORGOT_PASSWORD: `${API_PREFIX}/auth/forgot-password`,
  RESET_PASSWORD: `${API_PREFIX}/auth/reset-password`,
  UPDATE_PROFILE: `${API_PREFIX}/auth/profile`,
  UPDATE_PROFILE_IMAGE: `${API_PREFIX}/auth/profile-image`,
} as const;

export const DASHBOARD = `${API_PREFIX}/admin/dashboard`;

export const PROJECTS = `${API_PREFIX}/admin/projects`;
export const SKILLS = `${API_PREFIX}/admin/skills`;
export const EXPERIENCE = `${API_PREFIX}/admin/experience`;
export const EDUCATION = `${API_PREFIX}/admin/education`;
export const CERTIFICATES = `${API_PREFIX}/admin/certificates`;
export const RESUME = `${API_PREFIX}/admin/resume`;
export const MESSAGES = `${API_PREFIX}/admin/messages`;
export const SETTINGS = `${API_PREFIX}/admin/website-settings`;
