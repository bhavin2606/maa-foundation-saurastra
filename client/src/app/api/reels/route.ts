import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reels = await prisma.reel.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reels);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reels" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reel = await prisma.reel.create({
      data: {
        organizer: body.organizer,
        avatarUrl: body.avatarUrl,
        reelUrl: body.reelUrl,
        videoUrl: body.videoUrl,
        posterUrl: body.posterUrl,
        caption: body.caption,
        itemLabel: body.itemLabel,
        itemPrice: parseFloat(body.itemPrice),
        category: body.category,
      },
    });
    return NextResponse.json(reel);
  } catch (error) {
    console.error("Error creating reel:", error);
    return NextResponse.json({ error: "Failed to create reel" }, { status: 500 });
  }
}
