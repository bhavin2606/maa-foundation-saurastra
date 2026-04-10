import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    console.log("Seeding database...");
    await prisma.reel.createMany({
        data: [
            {
                organizer: "Maa Foundation",
                avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=maa1",
                reelUrl: "https://www.instagram.com/reel/example1",
                videoUrl: "https://example.com/videos/reel1.mp4",
                posterUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400",
                caption: "Help us feed families in need",
                itemLabel: "Meal Kit",
                itemPrice: 500,
                category: "Food",
            },
        ],
    });
    await prisma.campaign.createMany({
        data: [
            {
                title: "Emergency Food Relief",
                description: "Providing food packages to families affected by natural disasters",
                image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800",
                goal: 100000,
                raised: 25000,
                category: "Food Security",
                organizer: "Maa Foundation",
                status: "ACTIVE",
            },
        ],
    });
    // Admin Seeding
    const adminExists = await prisma.admin.findUnique({
        where: { username: "admin" }
    });
    if (!adminExists) {
        const bcrypt = await import("bcryptjs");
        const hashedPassword = await bcrypt.default.hash("Maa@admin1234", 10);
        await prisma.admin.create({
            data: {
                username: "admin",
                email: "adminmaa@mailinator.com",
                password: hashedPassword,
            },
        });
        console.log("Admin user created: admin / Maa@admin1234");
    }
    console.log("Database seeded successfully");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
