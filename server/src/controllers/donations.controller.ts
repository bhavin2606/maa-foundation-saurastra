import { Request, Response } from "express";
import { DonationsService } from "../services/donations.service.js";
import { logger } from "../lib/logger.js";
import { ImageStorageService } from "../services/image-storage.service.js";
import { prisma } from "../lib/prisma.js";
import { EmailService } from "../services/email.service.js";
import { ReceiptService } from "../services/receipt.service.js";

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
      logger.error("Failed to fetch donations", error);
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
      logger.error("Failed to fetch donation", error, {
        donationId: req.params.id,
      });
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
      logger.error("Failed to create donation", error, {
        donorEmail: req.body?.donorEmail,
        paymentMethod: req.body?.paymentMethod,
      });
      res.status(500).json({ error: "Failed to process donation" });
    }
  }

  /**
   * @swagger
   * /api/donations/admin-create:
   *   post:
   *     summary: Create an already approved manual donation as admin
   *     tags: [Donations]
   *     responses:
   *       200:
   *         description: Donation created successfully
   */
  static async adminCreate(req: Request, res: Response) {
    try {
      const { donorName, donorEmail, phone, amount, campaignId, itemLabel, message } = req.body;
      
      if (!donorName || !donorEmail || !amount) {
        return res.status(400).json({ error: "Name, email, and amount are required" });
      }

      const donationData = {
        amount: parseFloat(amount),
        donorName,
        donorEmail,
        phone,
        message,
        itemLabel,
        paymentMethod: "manual",
        paymentStatus: "success",
        adminApproved: true,
        adminApprovedAt: new Date(),
        campaignId: campaignId || null,
      };

      const donation = await prisma.donation.create({
        data: donationData
      });

      if (donation.campaignId) {
        await prisma.campaign.update({
          where: { id: donation.campaignId },
          data: {
            raised: { increment: donation.amount },
          },
        });
      }

      let receiptBuffer: Buffer | undefined;
      try {
        const generated = await ReceiptService.generateReceipt(donation);
        const receiptUrl = generated.url;
        receiptBuffer = generated.buffer;
        
        await prisma.donation.update({
          where: { id: donation.id },
          data: { receiptUrl },
        });
        Object.assign(donation, { receiptUrl });
      } catch (receiptError) {
        logger.error("Failed to generate receipt during admin creation", receiptError);
      }

      // Send email asynchronously in the background so it doesn't block the UI
      EmailService.sendPaymentSuccessEmail(donation.donorEmail, donation, receiptBuffer).catch((err) => {
        logger.error("Background email delivery failed", err);
      });

      res.json({
        success: true,
        donation,
        message: "Manual donation successfully recorded and emailed."
      });
    } catch (error) {
      logger.error("Failed to admin-create donation", error);
      res.status(500).json({ error: "Failed to create manual donation" });
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
      logger.error("Failed to delete donation", error, {
        donationId: req.params.id,
      });
      res.status(500).json({ error: "Failed to delete donation" });
    }
  }

  /**
   * @swagger
   * /api/donations/create-order:
   *   post:
   *     summary: Create a new Razorpay order and pending donation
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
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *     responses:
   *       200:
   *         description: The Razorpay order was successfully created
   */
  static async createOrder(req: Request, res: Response) {
    try {
      const { amount, name, email, ...otherData } = req.body;
      if (!amount || !name || !email) {
        return res.status(400).json({ error: "Amount, name, and email are required" });
      }
      
      const order = await DonationsService.createRazorpayOrder({
        amount,
        donorName: name,
        donorEmail: email,
        ...otherData
      });

      res.json({
        success: true,
        ...order
      });
    } catch (error) {
      logger.error("Failed to create Razorpay order", error, {
        donorEmail: req.body?.email,
        amount: req.body?.amount,
      });
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
      
      return res.status(200).json({
        success: true,
        message: "Payment successful",
        paymentId: req.body.razorpay_payment_id,
        donationId: donation.id,
        receiptUrl: donation.receiptUrl
      });
    } catch (error) {
      logger.error("Payment verification failed", error, {
        donationId: req.body?.donationId,
        razorpayOrderId: req.body?.razorpay_order_id,
      });
      res.status(400).json({ 
        success: false,
        message: "Payment verification failed" 
      });
    }
  }

  /**
   * @swagger
   * /api/donations/manual:
   *   post:
   *     summary: Submit manual payment with screenshot
   *     tags: [Donations]
   *     responses:
   *       200:
   *         description: Screenshot submitted
   */
  static async manualPayment(req: Request, res: Response) {
    try {
      const { name, email, amount, ...otherData } = req.body;
      const screenshot = req.file;

      if (!name || !email || !amount) {
        return res.status(400).json({ error: "Name, email, and amount are required" });
      }

      if (!screenshot) {
        return res.status(400).json({ error: "Screenshot is required" });
      }

      // Upload the payment proof before creating the donation so the record always points to a durable asset URL.
      const uploadedScreenshot = await ImageStorageService.uploadDonationScreenshot({
        file: screenshot,
        donorEmail: email,
        donorName: name,
      });

      await DonationsService.createManualPayment({
        donorName: name,
        donorEmail: email,
        amount,
        screenshotUrl: uploadedScreenshot.url,
        ...otherData
      });

      res.json({
        success: true,
        message: "Payment screenshot submitted. Waiting for admin approval."
      });
    } catch (error) {
      logger.error("Failed to submit manual payment", error, {
        donorEmail: req.body?.email,
        amount: req.body?.amount,
      });
      res.status(500).json({ error: "Failed to submit manual payment" });
    }
  }

}
