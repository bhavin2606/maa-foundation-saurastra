import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const donation = await prisma.donation.create({
      data: {
        amount: parseFloat(body.amount),
        quantity: parseInt(body.quantity) || 1,
        itemLabel: body.itemLabel,
        donorName: body.donorName,
        donorEmail: body.donorEmail,
        reelId: body.reelId,
        campaignId: body.campaignId,
        status: "SUCCESS", // Mocking success for now
      },
    });

    // Update the campaign's raised amount if campaignId is present
    if (body.campaignId) {
      await prisma.campaign.update({
        where: { id: body.campaignId },
        data: {
          raised: {
            increment: parseFloat(body.amount),
          },
        },
      });
    }

    return NextResponse.json(donation);
  } catch (error) {
    console.error("Error creating donation:", error);
    return NextResponse.json({ error: "Failed to process donation" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const donations = await prisma.donation.findMany({
      include: {
        reel: true,
        campaign: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(donations);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 });
  }
}
