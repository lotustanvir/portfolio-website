import bcrypt from "bcryptjs";
import env from "../config/env.js";

export async function hashPassword(password) {
  return bcrypt.hash(password, env.bcrypt.saltRounds);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function validatePasswordStrength(password) {
  const errors = [];
  if (password.length < 12) {
    errors.push("Password must be at least 12 characters");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain an uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain a lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain a number");
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push("Password must contain a special character");
  }
  return errors;
}
