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

  static async sendPaymentSuccessEmail(email: string, donationData: any) {
    const fromAddress = process.env.SMTP_USER || "no-reply@maafoundation.org";
    const mailOptions = {
      from: `"Maa Foundation" <${fromAddress}>`,
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
      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending payment success email:", error);
      return null;
    }
  }
}
