import logger from "../config/logger.js";

// Placeholder — integrate nodemailer or SendGrid here
export async function sendEmail({ to, subject, html }) {
  logger.info(
    { to, subject },
    `[EMAIL PLACEHOLDER] Would send email to ${to}`
  );
  return { success: true, message: "Email logged (placeholder)" };
}

export function getPasswordResetTemplate(resetUrl) {
  return {
    subject: "Password Reset — Portfolio Admin",
    html: `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;">Reset Password</a>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };
}

export function getPasswordChangedTemplate(email) {
  return {
    subject: "Password Changed — Portfolio Admin",
    html: `
      <h1>Password Changed Successfully</h1>
      <p>Your password has been changed for account: ${email}</p>
      <p>If you didn't make this change, please contact support immediately.</p>
    `,
  };
}

export function getWelcomeTemplate(name, loginUrl) {
  return {
    subject: "Welcome to Portfolio Admin",
    html: `
      <h1>Welcome, ${name}!</h1>
      <p>Your admin account has been created.</p>
      <a href="${loginUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;">Login to Dashboard</a>
    `,
  };
}
