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
    const { amount, quantity, itemLabel, donorName, donorEmail, phone, message, paymentMethod, screenshotUrl, reelId, campaignId, status } = data;
    
    const donation = await prisma.donation.create({
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
        status: status || (paymentMethod === "SCAN_AND_PAY" ? "PENDING" : "SUCCESS"),
      },
    });

    if (donation.status === "SUCCESS" && campaignId) {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          raised: {
            increment: parseFloat(amount),
          },
        },
      });
    }

    return donation;
  }

  static async createRazorpayOrder(amount: number) {
    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    try {
      const order = await razorpay.orders.create(options);
      return order;
    } catch (error) {
      console.error("Razorpay order creation failed:", error);
      throw new Error("Failed to create Razorpay order");
    }
  }

  static async verifyRazorpayPayment(paymentData: any) {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      donationData 
    } = paymentData;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Payment is valid, create/update donation
      return await this.create({
        ...donationData,
        status: "SUCCESS",
        paymentMethod: "GATEWAY"
      });
    } else {
      throw new Error("Invalid payment signature");
    }
  }
}
