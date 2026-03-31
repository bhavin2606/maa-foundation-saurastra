import { prisma } from "../lib/prisma.js";

export class DashboardService {
  static async getStats() {
    const [totalDonations, totalDonorsGroup, activeCampaigns, activeReels, recentDonations] = await Promise.all([
      prisma.donation.aggregate({
        _sum: {
          amount: true,
        },
      }),
      prisma.donation.groupBy({
        by: ['donorEmail'],
      }),
      prisma.campaign.count(),
      prisma.reel.count(),
      prisma.donation.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return {
      stats: {
        totalRaised: totalDonations._sum.amount || 0,
        totalDonors: totalDonorsGroup.length,
        activeCampaigns,
        activeReels,
      },
      recentDonations,
    };
  }
}
