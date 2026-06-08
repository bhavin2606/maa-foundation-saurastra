import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { EmailService } from "../services/email.service.js";
import { ReceiptService } from "../services/receipt.service.js";
import { logger } from "../lib/logger.js";

export class AdminPaymentsController {
  static async getManualPayments(req: Request, res: Response) {
    try {
      const payments = await prisma.donation.findMany({
        where: {
          paymentMethod: "manual",
          paymentStatus: "waiting_for_admin",
        },
        orderBy: { createdAt: "desc" },
      });
      res.json(payments);
    } catch (error) {
      logger.error("Failed to fetch manual payments", error);
      res.status(500).json({ error: "Failed to fetch manual payments" });
    }
  }

  static async approveManualPayment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const donation = await prisma.donation.update({
        where: { id },
        data: {
          paymentStatus: "success",
          adminApproved: true,
          adminApprovedAt: new Date(),
        },
      });

      // Update campaign raised amount if applicable
      if (donation.campaignId) {
        await prisma.campaign.update({
          where: { id: donation.campaignId },
          data: {
            raised: {
              increment: donation.amount,
            },
          },
        });
      }

      // Generate Receipt
      let receiptBuffer: Buffer | undefined;
      try {
        const generated = await ReceiptService.generateReceipt(donation);
        const receiptUrl = generated.url;
        receiptBuffer = generated.buffer;
        const updatedDonation = await prisma.donation.update({
          where: { id: donation.id },
          data: { receiptUrl },
        });
        Object.assign(donation, updatedDonation);
        logger.info("Receipt generated for manual payment", { donationId: donation.id, receiptUrl });
      } catch (receiptError) {
        logger.error("Failed to generate receipt during manual verification", receiptError, { donationId: donation.id });
      }

      // Send success email asynchronously
      EmailService.sendPaymentSuccessEmail(donation.donorEmail, donation, receiptBuffer).catch(err => {
        logger.error("Background email delivery failed", err);
      });

      logger.info("Manual payment approved", {
        donationId: donation.id,
        campaignId: donation.campaignId,
      });

      res.json({
        success: true,
        message: "Manual payment approved successfully"
      });
    } catch (error) {
      logger.error("Failed to approve manual payment", error, {
        donationId: req.params.id,
      });
      res.status(500).json({ error: "Failed to approve manual payment" });
    }
  }

  static async rejectManualPayment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      await prisma.donation.update({
        where: { id },
        data: {
          paymentStatus: "failed",
          adminApproved: false,
        },
      });

      res.json({
        success: true,
        message: "Manual payment rejected"
      });
    } catch (error) {
      logger.error("Failed to reject manual payment", error, {
        donationId: req.params.id,
      });
      res.status(500).json({ error: "Failed to reject manual payment" });
    }
  }
}
