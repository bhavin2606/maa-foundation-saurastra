import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = await prisma.contactQuery.create({
      data: {
        name: body.name,
        email: body.email,
        subject: body.subject,
        message: body.message,
      },
    });
    return NextResponse.json(query);
  } catch (error) {
    console.error("Error creating contact query:", error);
    return NextResponse.json({ error: "Failed to submit message" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const queries = await prisma.contactQuery.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(queries);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
