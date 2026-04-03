import { Request, Response } from "express";
import { ReelsService } from "../services/reels.service.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Reel:
 *       type: object
 *       required:
 *         - organizer
 *         - reelUrl
 *         - caption
 *         - itemLabel
 *         - itemPrice
 *         - category
 *       properties:
 *         id:
 *           type: string
 *         organizer:
 *           type: string
 *         avatarUrl:
 *           type: string
 *         reelUrl:
 *           type: string
 *         videoUrl:
 *           type: string
 *         posterUrl:
 *           type: string
 *         caption:
 *           type: string
 *         itemLabel:
 *           type: string
 *         itemPrice:
 *           type: number
 *         category:
 *           type: string
 *         likes:
 *           type: string
 *         comments:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export class ReelsController {
  /**
   * @swagger
   * /api/reels:
   *   get:
   *     summary: Returns the list of all reels
   *     tags: [Reels]
   *     responses:
   *       200:
   *         description: The list of reels
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Reel'
   */
  static async getAll(req: Request, res: Response) {
    try {
      const reels = await ReelsService.getAll();
      res.json(reels);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reels" });
    }
  }

  /**
   * @swagger
   * /api/reels/{id}:
   *   get:
   *     summary: Get the reel by id
   *     tags: [Reels]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The reel id
   *     responses:
   *       200:
   *         description: The reel description by id
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Reel'
   *       404:
   *         description: The reel was not found
   */
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

  /**
   * @swagger
   * /api/reels:
   *   post:
   *     summary: Create a new reel
   *     tags: [Reels]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Reel'
   *     responses:
   *       200:
   *         description: The reel was successfully created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Reel'
   */
  static async create(req: Request, res: Response) {
    try {
      const reel = await ReelsService.create(req.body);
      res.json(reel);
    } catch (error) {
      console.error("Error creating reel:", error);
      res.status(500).json({ error: "Failed to create reel" });
    }
  }

  /**
   * @swagger
   * /api/reels/{id}:
   *   put:
   *     summary: Update the reel by id
   *     tags: [Reels]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The reel id
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Reel'
   *     responses:
   *       200:
   *         description: The reel was updated
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Reel'
   *       404:
   *         description: The reel was not found
   */
  static async update(req: Request, res: Response) {
    try {
      const reel = await ReelsService.update(req.params.id, req.body);
      res.json(reel);
    } catch (error) {
      res.status(500).json({ error: "Failed to update reel" });
    }
  }

  /**
   * @swagger
   * /api/reels/{id}:
   *   delete:
   *     summary: Remove the reel by id
   *     tags: [Reels]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The reel id
   *     responses:
   *       200:
   *         description: The reel was deleted
   *       404:
   *         description: The reel was not found
   */
  static async delete(req: Request, res: Response) {
    try {
      await ReelsService.delete(req.params.id);
      res.json({ message: "Reel deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete reel" });
    }
  }
}
