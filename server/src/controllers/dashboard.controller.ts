import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service.js";

export class DashboardController {
  /**
   * @swagger
   * /api/dashboard:
   *   get:
   *     summary: Get dashboard statistics and recent donations
   *     tags: [Dashboard]
   *     responses:
   *       200:
   *         description: General statistics and recent donations
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 stats:
   *                   type: object
   *                   properties:
   *                     totalRaised:
   *                       type: number
   *                     totalDonors:
   *                       type: number
   *                     activeCampaigns:
   *                       type: number
   *                     activeReels:
   *                       type: number
   *                 recentDonations:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Donation'
   */
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
