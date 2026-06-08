import { Request, Response } from "express";
import { CampaignsService } from "../services/campaigns.service.js";
import { ImageStorageService } from "../services/image-storage.service.js";
import { logger } from "../lib/logger.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Campaign:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - image
 *         - goal
 *         - category
 *         - organizer
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the campaign
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         image:
 *           type: string
 *         goal:
 *           type: number
 *         raised:
 *           type: number
 *         category:
 *           type: string
 *         organizer:
 *           type: string
 *         status:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export class CampaignsController {
  /**
   * @swagger
   * /api/campaigns:
   *   get:
   *     summary: Returns the list of all the campaigns
   *     tags: [Campaigns]
   *     responses:
   *       200:
   *         description: The list of the campaigns
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Campaign'
   */
  static async getAll(req: Request, res: Response) {
    try {
      const campaigns = await CampaignsService.getAll();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch campaigns" });
    }
  }

  /**
   * @swagger
   * /api/campaigns/{id}:
   *   get:
   *     summary: Get the campaign by id
   *     tags: [Campaigns]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The campaign id
   *     responses:
   *       200:
   *         description: The campaign description by id
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Campaign'
   *       404:
   *         description: The campaign was not found
   */
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

  /**
   * @swagger
   * /api/campaigns:
   *   post:
   *     summary: Create a new campaign
   *     tags: [Campaigns]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Campaign'
   *     responses:
   *       200:
   *         description: The campaign was successfully created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Campaign'
   *       500:
   *         description: Some server error
   */
  static async create(req: Request, res: Response) {
    try {
      let imageUrl = req.body.image;

      if (req.file) {
        const uploadResult = await ImageStorageService.uploadCampaignImage({
          file: req.file,
          campaignTitle: req.body.title || "campaign",
        });
        imageUrl = uploadResult.url;
      }

      if (!imageUrl) {
        return res.status(400).json({ error: "Image URL or Image file is required" });
      }

      const campaignData = {
        ...req.body,
        image: imageUrl,
      };

      const campaign = await CampaignsService.create(campaignData);
      res.json(campaign);
    } catch (error) {
      logger.error("Error creating campaign:", error);
      res.status(500).json({ error: "Failed to create campaign" });
    }
  }

  /**
   * @swagger
   * /api/campaigns/{id}:
   *   put:
   *     summary: Update the campaign by the id
   *     tags: [Campaigns]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The campaign id
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Campaign'
   *     responses:
   *       200:
   *         description: The campaign was updated
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Campaign'
   *       404:
   *         description: The campaign was not found
   *       500:
   *         description: Some error happened
   */
  static async update(req: Request, res: Response) {
    try {
      let imageUrl = req.body.image;

      if (req.file) {
        const uploadResult = await ImageStorageService.uploadCampaignImage({
          file: req.file,
          campaignTitle: req.body.title || "campaign",
        });
        imageUrl = uploadResult.url;
      }

      const campaignData = {
        ...req.body,
        ...(imageUrl && { image: imageUrl }), // only override if a new URL is provided or an image is uploaded
      };

      const campaign = await CampaignsService.update(req.params.id, campaignData);
      res.json(campaign);
    } catch (error) {
      logger.error("Error updating campaign:", error);
      res.status(500).json({ error: "Failed to update campaign" });
    }
  }

  /**
   * @swagger
   * /api/campaigns/{id}:
   *   delete:
   *     summary: Remove the campaign by id
   *     tags: [Campaigns]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The campaign id
   *     responses:
   *       200:
   *         description: The campaign was deleted
   *       404:
   *         description: The campaign was not found
   */
  static async delete(req: Request, res: Response) {
    try {
      await CampaignsService.delete(req.params.id);
      res.json({ message: "Campaign deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete campaign" });
    }
  }
}
