import { Request, Response } from "express";
import { ContactService } from "../services/contact.service.js";

export class ContactController {
  static async getAll(req: Request, res: Response) {
    try {
      const queries = await ContactService.getAll();
      res.json(queries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const query = await ContactService.create(req.body);
      res.json(query);
    } catch (error) {
      console.error("Error creating contact query:", error);
      res.status(500).json({ error: "Failed to submit message" });
    }
  }
}
