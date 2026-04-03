import { Request, Response } from "express";
import { ContactService } from "../services/contact.service.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     ContactQuery:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - subject
 *         - message
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         subject:
 *           type: string
 *         message:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

export class ContactController {
  /**
   * @swagger
   * /api/contact:
   *   get:
   *     summary: Returns the list of all contact messages
   *     tags: [Contact]
   *     responses:
   *       200:
   *         description: The list of contact messages
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/ContactQuery'
   */
  static async getAll(req: Request, res: Response) {
    try {
      const queries = await ContactService.getAll();
      res.json(queries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  }

  /**
   * @swagger
   * /api/contact/{id}:
   *   get:
   *     summary: Get a contact message by id
   *     tags: [Contact]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The message id
   *     responses:
   *       200:
   *         description: The contact message details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ContactQuery'
   *       404:
   *         description: Message not found
   */
  static async getById(req: Request, res: Response) {
    try {
      const query = await ContactService.getById(req.params.id);
      if (!query) {
        return res.status(404).json({ error: "Message not found" });
      }
      res.json(query);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch message" });
    }
  }

  /**
   * @swagger
   * /api/contact:
   *   post:
   *     summary: Submit a new contact message
   *     tags: [Contact]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ContactQuery'
   *     responses:
   *       200:
   *         description: The message was successfully submitted
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ContactQuery'
   */
  static async create(req: Request, res: Response) {
    try {
      const query = await ContactService.create(req.body);
      res.json(query);
    } catch (error) {
      console.error("Error creating contact query:", error);
      res.status(500).json({ error: "Failed to submit message" });
    }
  }

  /**
   * @swagger
   * /api/contact/{id}:
   *   delete:
   *     summary: Delete a contact message by id
   *     tags: [Contact]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The message id
   *     responses:
   *       200:
   *         description: Message deleted successfully
   *       404:
   *         description: Message not found
   */
  static async delete(req: Request, res: Response) {
    try {
      await ContactService.delete(req.params.id);
      res.json({ message: "Message deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete message" });
    }
  }
}
