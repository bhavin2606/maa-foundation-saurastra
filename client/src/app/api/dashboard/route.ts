import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const totalDonations = await prisma.donation.aggregate({
      _sum: {
        amount: true,
      },
    });

    const totalDonors = await prisma.donation.groupBy({
      by: ['donorEmail'],
    });

    const activeCampaigns = await prisma.campaign.count();
    const activeReels = await prisma.reel.count();

    const recentDonations = await prisma.donation.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      stats: {
        totalRaised: totalDonations._sum.amount || 0,
        totalDonors: totalDonors.length,
        activeCampaigns,
        activeReels,
      },
      recentDonations,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
