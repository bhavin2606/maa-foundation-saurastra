import nodemailer from "nodemailer";

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || "placeholder",
      pass: process.env.SMTP_PASS || "placeholder",
    },
  });

  static async sendOTP(email: string, otp: string) {
    const fromAddress = process.env.SMTP_USER || "no-reply@maafoundation.org";
    const mailOptions = {
      from: `"Maa Foundation" <${fromAddress}>`,
      to: email,
      subject: "Admin Login OTP - Maa Foundation",
      text: `Your OTP for admin login is: ${otp}. It will expire in 10 minutes.`,
      html: `<b>Your OTP for admin login is: ${otp}</b><p>It will expire in 10 minutes.</p>`,
    };

    try {
      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending OTP email:", error);
      // In development, we can log the OTP to the console if email fails
      console.log(`[DEV] OTP for ${email}: ${otp}`);
      return null;
    }
  }

  static async sendPasswordResetConfirmation(email: string) {
    const fromAddress = process.env.SMTP_USER || "no-reply@maafoundation.org";
    const mailOptions = {
      from: `"Maa Foundation" <${fromAddress}>`,
      to: email,
      subject: "Password Changed - Maa Foundation",
      text: `Your admin password has been successfully changed.`,
      html: `<p>Your admin password has been successfully changed.</p>`,
    };

    try {
      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending password reset confirmation email:", error);
      return null;
    }
  }
}
