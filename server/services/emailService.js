// ============================================================
// services/emailService.js — Email Service
// ============================================================
// Sends password reset emails using Nodemailer.
// Falls back to console logging in development mode.
// ============================================================

const nodemailer = require('nodemailer');

/**
 * Send a password reset email to the user.
 *
 * @param {string} to - Recipient email address
 * @param {string} resetToken - The password reset token
 */
async function sendResetEmail(to, resetToken) {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // In development without email config, just log the link
  if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_USER) {
    console.log('========================================');
    console.log('🔑 PASSWORD RESET LINK (Dev Mode):');
    console.log(resetUrl);
    console.log('========================================');
    return;
  }

  // Create transporter with SMTP config
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"AI Startup Validator" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Password Reset - AI Startup Validator',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #6366f1;">Password Reset Request</h2>
        <p>You requested a password reset for your AI Startup Validator account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #64748b; font-size: 12px;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendResetEmail };
