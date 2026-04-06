import { prisma } from "../lib/prisma.js";

export class ContactService {
  static async getAll() {
    return await prisma.contactQuery.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getById(id: string) {
    return await prisma.contactQuery.findUnique({
      where: { id },
    });
  }

  static async delete(id: string) {
    return await prisma.contactQuery.delete({
      where: { id },
    });
  }

  static async create(data: any) {
    const { name, email, subject, message } = data;
    return await prisma.contactQuery.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });
  }

  static async updateStatus(id: string, status: string) {
    return await prisma.contactQuery.update({
      where: { id },
      data: { status },
    });
  }
}
