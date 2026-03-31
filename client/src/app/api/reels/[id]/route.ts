import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reel = await prisma.reel.findUnique({
      where: { id },
    });
    if (!reel) return NextResponse.json({ error: "Reel not found" }, { status: 404 });
    return NextResponse.json(reel);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reel" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const reel = await prisma.reel.update({
      where: { id },
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
    return NextResponse.json({ error: "Failed to update reel" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.reel.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Reel deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete reel" }, { status: 500 });
  }
}
