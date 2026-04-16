import { prisma } from "../lib/prisma.js";

export class ReelsService {
  static async getAll() {
    return await prisma.reel.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getById(id: string) {
    return await prisma.reel.findUnique({
      where: { id },
    });
  }

  static async create(data: any) {
    return await prisma.reel.create({
      data: {
        ...data,
        itemPrice: parseFloat(data.itemPrice),
      },
    });
  }

  static async update(id: string, data: any) {
    return await prisma.reel.update({
      where: { id },
      data: {
        ...data,
        itemPrice: data.itemPrice ? parseFloat(data.itemPrice) : undefined,
      },
    });
  }

  static async delete(id: string) {
    return await prisma.reel.delete({
      where: { id },
    });
  }

  static async incrementView(id: string) {
    return await prisma.reel.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }
}
