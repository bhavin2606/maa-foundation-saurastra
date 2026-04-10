import { prisma } from "../lib/prisma.js";
import { razorpay } from "../lib/razorpay.js";
import crypto from "crypto";

export class DonationsService {
  static async getAll() {
    return await prisma.donation.findMany({
      include: {
        reel: true,
        campaign: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getById(id: string) {
    return await prisma.donation.findUnique({
      where: { id },
      include: {
        reel: true,
        campaign: true,
      },
    });
  }

  static async delete(id: string) {
    return await prisma.donation.delete({
      where: { id },
    });
  }

  static async create(data: any) {
    const { 
      amount, quantity, itemLabel, donorName, donorEmail, phone, 
      message, paymentMethod, screenshotUrl, reelId, campaignId, 
      paymentStatus, razorpayOrderId, razorpayPaymentId, razorpaySignature 
    } = data;
    
    return await prisma.donation.create({
      data: {
        amount: parseFloat(amount),
        quantity: parseInt(quantity) || 1,
        itemLabel,
        donorName,
        donorEmail,
        phone,
        message,
        paymentMethod,
        screenshotUrl,
        reelId,
        campaignId,
        paymentStatus: paymentStatus || "pending",
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      },
    });
  }

  static async createRazorpayOrder(donationData: any) {
    const { amount } = donationData;
    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    try {
      const order = await razorpay.orders.create(options);
      
      // Save pending donation
      const donation = await this.create({
        ...donationData,
        paymentMethod: "razorpay",
        paymentStatus: "pending",
        razorpayOrderId: order.id
      });

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        donationId: donation.id
      };
    } catch (error) {
      console.error("Razorpay order creation failed:", error);
      throw new Error("Failed to create Razorpay order");
    }
  }

  static async verifyRazorpayPayment(paymentData: any) {
    const { 
      donationId,
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = paymentData;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Payment is valid, update donation
      const donation = await prisma.donation.update({
        where: { id: donationId },
        data: {
          paymentStatus: "success",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
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

      // Send success email
      const { EmailService } = await import("./email.service.js");
      await EmailService.sendPaymentSuccessEmail(donation.donorEmail, donation);

      return donation;
    } else {
      throw new Error("Invalid payment signature");
    }
  }

  static async createManualPayment(data: any) {
    const { amount, donorName, donorEmail, phone, message, screenshotUrl, reelId, campaignId } = data;
    
    return await prisma.donation.create({
      data: {
        amount: parseFloat(amount),
        donorName,
        donorEmail,
        phone,
        message,
        paymentMethod: "manual",
        paymentStatus: "waiting_for_admin",
        screenshotUrl,
        reelId,
        campaignId,
      },
    });
  }
}
