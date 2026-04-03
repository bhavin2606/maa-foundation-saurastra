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
