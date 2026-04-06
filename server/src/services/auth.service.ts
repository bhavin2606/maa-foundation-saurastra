import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { EmailService } from "./email.service.js";

const JWT_SECRET = process.env.JWT_SECRET || "maa-foundation-admin-secret-key-2026";
const OTP_EXPIRY_MINUTES = 10;

export class AuthService {
  static async login(username: string, password: string) {
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) throw new Error("Invalid credentials");

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await prisma.admin.update({
      where: { id: admin.id },
      data: { otp, otpExpires },
    });

    // Send OTP via Email
    await EmailService.sendOTP(admin.email, otp);

    return { message: "OTP sent to your email", email: admin.email };
  }

  static async verifyOTP(username: string, otp: string) {
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin || !admin.otp || !admin.otpExpires) throw new Error("Invalid request");

    if (new Date() > admin.otpExpires) throw new Error("OTP expired");
    if (admin.otp !== otp) throw new Error("Invalid OTP");

    // Clear OTP after successful verification
    await prisma.admin.update({
      where: { id: admin.id },
      data: { otp: null, otpExpires: null },
    });

    // Generate JWT
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: "1d" });

    return { token, admin: { id: admin.id, username: admin.username, email: admin.email } };
  }

  static async resetPassword(email: string, newPassword: string) {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) throw new Error("Admin not found");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: hashedPassword },
    });

    await EmailService.sendPasswordResetConfirmation(admin.email);

    return { message: "Password reset successful" };
  }

  static async logout() {
    // Standard logout: The client should discard the token.
    // For enhanced security, we could blacklist tokens if using a cache/DB.
    return { message: "Logged out successfully" };
  }
}
