import { prisma } from "../lib/prisma.js";

export class CampaignsService {
  static async getAll() {
    return await prisma.campaign.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getById(id: string) {
    return await prisma.campaign.findUnique({
      where: { id },
    });
  }

  static async create(data: any) {
    return await prisma.campaign.create({
      data: {
        ...data,
        goal: parseFloat(data.goal),
        raised: data.raised ? parseFloat(data.raised) : 0,
        status: data.status || "ACTIVE",
      },
    });
  }

  static async update(id: string, data: any) {
    return await prisma.campaign.update({
      where: { id },
      data: {
        ...data,
        goal: data.goal ? parseFloat(data.goal) : undefined,
        raised: data.raised ? parseFloat(data.raised) : undefined,
      },
    });
  }

  static async delete(id: string) {
    return await prisma.campaign.delete({
      where: { id },
    });
  }
}
