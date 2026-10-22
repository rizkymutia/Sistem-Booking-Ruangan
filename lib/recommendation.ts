import { prisma } from "@/lib/prisma";

export async function getRecommendations(roomId: string, start: Date, end: Date) {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!room) return [];

  const duration = end.getTime() - start.getTime();

  const rooms = await prisma.room.findMany({
    where: {
      capacity: {
        gte: room.capacity,
      },
    },
  });

  const recommendations = [];

  for (const r of rooms) {
    // cek apakah jam yang diminta kosong
    const conflict = await prisma.booking.findFirst({
      where: {
        roomId: r.id,
        status: {
          in: ["PENDING", "APPROVED", "CHECKED_IN"],
        },
        AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }],
      },
    });

    if (!conflict) {
      recommendations.push({
        roomId: r.id,
        roomName: r.name,
        start: start.toISOString(),
        end: end.toISOString(),
      });
      continue;
    }

    // rekomendasi setelah booking selesai
    const newStart = conflict.endTime;
    const newEnd = new Date(newStart.getTime() + duration);

    const nextConflict = await prisma.booking.findFirst({
      where: {
        roomId: r.id,
        status: {
          in: ["PENDING", "APPROVED", "CHECKED_IN"],
        },
        AND: [{ startTime: { lt: newEnd } }, { endTime: { gt: newStart } }],
      },
    });

    if (!nextConflict) {
      recommendations.push({
        roomId: r.id,
        roomName: r.name,
        start: newStart.toISOString(),
        end: newEnd.toISOString(),
      });
    }
  }

  return recommendations.slice(0, 3);
}
