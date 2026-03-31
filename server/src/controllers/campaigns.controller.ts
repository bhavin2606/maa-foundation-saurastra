import { Request, Response } from "express";
import { CampaignsService } from "../services/campaigns.service.js";

export class CampaignsController {
  static async getAll(req: Request, res: Response) {
    try {
      const campaigns = await CampaignsService.getAll();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch campaigns" });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const campaign = await CampaignsService.getById(req.params.id);
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch campaign" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const campaign = await CampaignsService.create(req.body);
      res.json(campaign);
    } catch (error) {
      console.error("Error creating campaign:", error);
      res.status(500).json({ error: "Failed to create campaign" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const campaign = await CampaignsService.update(req.params.id, req.body);
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ error: "Failed to update campaign" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await CampaignsService.delete(req.params.id);
      res.json({ message: "Campaign deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete campaign" });
    }
  }
}
