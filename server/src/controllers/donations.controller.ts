import { Request, Response } from "express";
import { DonationsService } from "../services/donations.service.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Donation:
 *       type: object
 *       required:
 *         - amount
 *         - donorName
 *         - donorEmail
 *       properties:
 *         id:
 *           type: string
 *         amount:
 *           type: number
 *         quantity:
 *           type: integer
 *         itemLabel:
 *           type: string
 *         donorName:
 *           type: string
 *         donorEmail:
 *           type: string
 *         phone:
 *           type: string
 *         message:
 *           type: string
 *         status:
 *           type: string
 *         paymentMethod:
 *           type: string
 *         screenshotUrl:
 *           type: string
 *         reelId:
 *           type: string
 *         campaignId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

export class DonationsController {
  /**
   * @swagger
   * /api/donations:
   *   get:
   *     summary: Returns the list of all donations
   *     tags: [Donations]
   *     responses:
   *       200:
   *         description: The list of donations
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Donation'
   */
  static async getAll(req: Request, res: Response) {
    try {
      const donations = await DonationsService.getAll();
      res.json(donations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch donations" });
    }
  }

  /**
   * @swagger
   * /api/donations/{id}:
   *   get:
   *     summary: Get a donation by id
   *     tags: [Donations]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The donation id
   *     responses:
   *       200:
   *         description: The donation details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Donation'
   *       404:
   *         description: Donation not found
   */
  static async getById(req: Request, res: Response) {
    try {
      const donation = await DonationsService.getById(req.params.id);
      if (!donation) {
        return res.status(404).json({ error: "Donation not found" });
      }
      res.json(donation);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch donation" });
    }
  }

  /**
   * @swagger
   * /api/donations:
   *   post:
   *     summary: Create a new donation
   *     tags: [Donations]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Donation'
   *     responses:
   *       200:
   *         description: The donation was successfully created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Donation'
   */
  static async create(req: Request, res: Response) {
    try {
      const donation = await DonationsService.create(req.body);
      res.json(donation);
    } catch (error) {
      console.error("Error creating donation:", error);
      res.status(500).json({ error: "Failed to process donation" });
    }
  }



  /**
   * @swagger
   * /api/donations/{id}:
   *   delete:
   *     summary: Delete a donation by id
   *     tags: [Donations]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The donation id
   *     responses:
   *       200:
   *         description: Donation deleted successfully
   *       404:
   *         description: Donation not found
   */
  static async delete(req: Request, res: Response) {
    try {
      await DonationsService.delete(req.params.id);
      res.json({ message: "Donation deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete donation" });
    }
  }

  /**
   * @swagger
   * /api/donations/create-order:
   *   post:
   *     summary: Create a new Razorpay order
   *     tags: [Donations]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               amount:
   *                 type: number
   *     responses:
   *       200:
   *         description: The Razorpay order was successfully created
   */
  static async createOrder(req: Request, res: Response) {
    try {
      const { amount } = req.body;
      if (!amount) {
        return res.status(400).json({ error: "Amount is required" });
      }
      const order = await DonationsService.createRazorpayOrder(amount);
      res.json(order);
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      res.status(500).json({ error: "Failed to create payment order" });
    }
  }

  /**
   * @swagger
   * /api/donations/verify-payment:
   *   post:
   *     summary: Verify Razorpay payment signature
   *     tags: [Donations]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: Payment verified and donation recorded
   */
  static async verifyPayment(req: Request, res: Response) {
    try {
      const donation = await DonationsService.verifyRazorpayPayment(req.body);
      res.json(donation);
    } catch (error) {
      console.error("Payment verification failed:", error);
      res.status(400).json({ error: "Payment verification failed" });
    }
  }
}
