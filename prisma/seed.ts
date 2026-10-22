import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.room.createMany({
    data: [
      {
        code: "R001",
        name: "Aster",
        floor: 1,
        capacity: 6,
        location: "Gedung A",
        facilities: 'TV 55", Whiteboard, WiFi',
        imageUrl: "/rooms/aster.jpg",
        description: "Ruang meeting kecil untuk diskusi tim.",
      },
      {
        code: "R002",
        name: "Lotus",
        floor: 1,
        capacity: 8,
        location: "Gedung A",
        facilities: "Projector, AC, WiFi",
        imageUrl: "/rooms/lotus.jpg",
        description: "Cocok untuk meeting harian.",
      },
      {
        code: "R003",
        name: "Sakura",
        floor: 2,
        capacity: 12,
        location: "Gedung B",
        facilities: "Smart TV, Whiteboard, AC",
        imageUrl: "/rooms/sakura.jpg",
        description: "Ruang presentasi dengan layar besar.",
      },
      {
        code: "R004",
        name: "Orion",
        floor: 2,
        capacity: 20,
        location: "Gedung B",
        facilities: "Projector, Sound System",
        imageUrl: "/rooms/orion.jpg",
        description: "Ruang rapat untuk divisi besar.",
      },
      {
        code: "R005",
        name: "Galaxy",
        floor: 3,
        capacity: 30,
        location: "Gedung C",
        facilities: "LED Display, Mic, WiFi",
        imageUrl: "/rooms/galaxy.jpg",
        description: "Conference room utama.",
      },
      {
        code: "R006",
        name: "Emerald",
        floor: 3,
        capacity: 10,
        location: "Gedung C",
        facilities: "TV, AC, Coffee Corner",
        imageUrl: "/rooms/emerald.jpg",
        description: "Ruang brainstorming yang nyaman.",
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Seeder selesai. ${result.count} ruangan baru ditambahkan.`);
}

// Jalankan seeder
main()
  .catch((error) => {
    console.error("Seeding gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
