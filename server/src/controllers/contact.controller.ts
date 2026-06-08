import { Request, Response } from "express";
import { ContactService } from "../services/contact.service.js";
import { EmailService } from "../services/email.service.js";

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
  /**
   * @swagger
   * /api/contact/{id}/status:
   *   patch:
   *     summary: Update the status of a contact message
   *     tags: [Contact]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The message id
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [PENDING, RESOLVED, REJECTED]
   *     responses:
   *       200:
   *         description: Status updated successfully
   *       404:
   *         description: Message not found
   */
  static async updateStatus(req: Request, res: Response) {
    try {
      const { status, replyMessage } = req.body;
      const query = await ContactService.updateStatus(req.params.id, status);

      if (status === "RESOLVED") {
        const messageToSend = replyMessage || "Your inquiry has been successfully resolved. Thank you for reaching out!";
        await EmailService.sendContactReply(
          query.email,
          query.name,
          query.subject,
          messageToSend
        );
      }

      res.json(query);
    } catch (error) {
      res.status(500).json({ error: "Failed to update status" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await ContactService.delete(req.params.id);
      res.json({ message: "Message deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete message" });
    }
  }
}
