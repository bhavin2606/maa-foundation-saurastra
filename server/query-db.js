import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const donation = await prisma.donation.findFirst({
    orderBy: { createdAt: 'desc' }
  });
  console.log(donation.receiptUrl);
}
main().finally(() => prisma.$disconnect());
