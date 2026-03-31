import { prisma } from "../lib/prisma.js";

export class ContactService {
  static async getAll() {
    return await prisma.contactQuery.findMany({
      orderBy: { createdAt: "desc" },
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
}
