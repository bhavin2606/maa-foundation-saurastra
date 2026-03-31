import { Request, Response } from "express";
import { ReelsService } from "../services/reels.service.js";

export class ReelsController {
  static async getAll(req: Request, res: Response) {
    try {
      const reels = await ReelsService.getAll();
      res.json(reels);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reels" });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const reel = await ReelsService.getById(req.params.id);
      if (!reel) {
        return res.status(404).json({ error: "Reel not found" });
      }
      res.json(reel);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reel" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const reel = await ReelsService.create(req.body);
      res.json(reel);
    } catch (error) {
      console.error("Error creating reel:", error);
      res.status(500).json({ error: "Failed to create reel" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const reel = await ReelsService.update(req.params.id, req.body);
      res.json(reel);
    } catch (error) {
      res.status(500).json({ error: "Failed to update reel" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await ReelsService.delete(req.params.id);
      res.json({ message: "Reel deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete reel" });
    }
  }
}
