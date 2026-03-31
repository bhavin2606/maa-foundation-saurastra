import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service.js";

export class DashboardController {
  static async getDashboardData(req: Request, res: Response) {
    try {
      const data = await DashboardService.getStats();
      res.json(data);
    } catch (error) {
      console.error("Dashboard API Error:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  }
}
