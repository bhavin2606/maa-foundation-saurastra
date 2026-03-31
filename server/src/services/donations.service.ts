import { prisma } from "../lib/prisma.js";

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

  static async create(data: any) {
    const { amount, quantity, itemLabel, donorName, donorEmail, reelId, campaignId } = data;
    
    const donation = await prisma.donation.create({
      data: {
        amount: parseFloat(amount),
        quantity: parseInt(quantity) || 1,
        itemLabel,
        donorName,
        donorEmail,
        reelId,
        campaignId,
        status: "SUCCESS",
      },
    });

    if (campaignId) {
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
}
