import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const result = await AuthService.login(username, password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  static async verifyOTP(req: Request, res: Response) {
    try {
      const { username, otp } = req.body;
      const result = await AuthService.verifyOTP(username, otp);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { email, newPassword } = req.body;
      const result = await AuthService.resetPassword(email, newPassword);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const result = await AuthService.logout();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
