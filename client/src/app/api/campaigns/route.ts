import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(campaigns);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const campaign = await prisma.campaign.create({
      data: {
        title: body.title,
        description: body.description,
        image: body.image,
        goal: parseFloat(body.goal),
        raised: body.raised ? parseFloat(body.raised) : 0,
        category: body.category,
        organizer: body.organizer,
        status: body.status || "ACTIVE",
      },
    });
    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}
