import nodemailer from "nodemailer";
import "../lib/env.js";
import { logger } from "../lib/logger.js";

type EmailPayload = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export class EmailService {
  private static createTransporter() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.ethereal.email",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER || "placeholder",
        pass: process.env.SMTP_PASS || "placeholder",
      },
    });
  }

  private static resolveRecipient(email: string) {
    const trimmedEmail = email.trim().toLowerCase();
    const redirectEmail = process.env.EMAIL_REDIRECT_TO?.trim();
    const blockMailinator = (process.env.EMAIL_BLOCK_MAILINATOR || "true").toLowerCase() !== "false";

    if (redirectEmail) {
      logger.info("Redirecting outgoing email", {
        originalRecipient: trimmedEmail,
        redirectedRecipient: redirectEmail,
      });

      return {
        recipient: redirectEmail,
        originalRecipient: trimmedEmail,
        skipped: false,
      };
    }

    if (blockMailinator && trimmedEmail.endsWith("@mailinator.com")) {
      logger.warn("Skipping email delivery to unsupported Mailinator inbox", {
        recipient: trimmedEmail,
        reason: "Remote SMTP rejected the recipient address",
      });

      return {
        recipient: trimmedEmail,
        originalRecipient: trimmedEmail,
        skipped: true,
      };
    }

    return {
      recipient: trimmedEmail,
      originalRecipient: trimmedEmail,
      skipped: false,
    };
  }

  private static async sendEmail(payload: EmailPayload) {
    const fromAddress = process.env.SMTP_USER || "no-reply@maafoundation.org";
    const resolvedRecipient = this.resolveRecipient(payload.to);

    if (resolvedRecipient.skipped) {
      return {
        skipped: true,
        accepted: [],
        rejected: [resolvedRecipient.originalRecipient],
      };
    }

    try {
      const transporter = this.createTransporter();
      const result = await transporter.sendMail({
        from: `"Maa Foundation" <${fromAddress}>`,
        to: resolvedRecipient.recipient,
        replyTo: resolvedRecipient.originalRecipient,
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
      });

      logger.info("Email sent", {
        to: resolvedRecipient.recipient,
        originalRecipient: resolvedRecipient.originalRecipient,
        subject: payload.subject,
        messageId: result.messageId,
      });

      return result;
    } catch (error) {
      logger.error("Email delivery failed", error, {
        to: resolvedRecipient.recipient,
        originalRecipient: resolvedRecipient.originalRecipient,
        subject: payload.subject,
      });
      return null;
    }
  }

  static async sendOTP(email: string, otp: string) {
    const mailOptions = {
      to: email,
      subject: "Admin Login OTP - Maa Foundation",
      text: `Your OTP for admin login is: ${otp}. It will expire in 10 minutes.`,
      html: `<b>Your OTP for admin login is: ${otp}</b><p>It will expire in 10 minutes.</p>`,
    };

    try {
      return await this.sendEmail(mailOptions);
    } catch (error) {
      logger.error("Error sending OTP email", error, { email });
      logger.info("OTP fallback for development", { email, otp });
      return null;
    }
  }

  static async sendPasswordResetConfirmation(email: string) {
    const mailOptions = {
      to: email,
      subject: "Password Changed - Maa Foundation",
      text: `Your admin password has been successfully changed.`,
      html: `<p>Your admin password has been successfully changed.</p>`,
    };

    try {
      return await this.sendEmail(mailOptions);
    } catch (error) {
      logger.error("Error sending password reset confirmation email", error, { email });
      return null;
    }
  }

  static async sendPaymentSuccessEmail(email: string, donationData: any) {
    const mailOptions = {
      to: email,
      subject: "Donation Successful - Maa Foundation",
      text: `Thank you for your donation of ₹${donationData.amount}. Your donation ID is ${donationData.id}.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4CAF50;">Thank You for Your Donation!</h2>
          <p>Dear ${donationData.donorName},</p>
          <p>We have successfully received your donation of <b>₹${donationData.amount}</b>.</p>
          <p><b>Donation Details:</b></p>
          <ul>
            <li><b>Donation ID:</b> ${donationData.id}</li>
            <li><b>Amount:</b> ₹${donationData.amount}</li>
            <li><b>Date:</b> ${new Date().toLocaleDateString()}</li>
          </ul>
          <p>Your contribution helps us continue our mission. We truly appreciate your support!</p>
          <p>Best regards,<br/>Maa Foundation Team</p>
        </div>
      `,
    };

    try {
      return await this.sendEmail(mailOptions);
    } catch (error) {
      logger.error("Error sending payment success email", error, {
        email,
        donationId: donationData?.id,
      });
      return null;
    }
  }
}
