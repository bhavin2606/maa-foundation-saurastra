import { Request, Response } from "express";
import { DonationsService } from "../services/donations.service.js";

export class DonationsController {
  static async getAll(req: Request, res: Response) {
    try {
      const donations = await DonationsService.getAll();
      res.json(donations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch donations" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const donation = await DonationsService.create(req.body);
      res.json(donation);
    } catch (error) {
      console.error("Error creating donation:", error);
      res.status(500).json({ error: "Failed to process donation" });
    }
  }
}
