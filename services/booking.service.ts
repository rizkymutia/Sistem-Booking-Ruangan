import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getRecommendations } from "@/lib/recommendation";

type CreateBookingInput = {
  userId: string;
  roomId: string;
  startTime: Date;
  endTime: Date;
};

const MAX_ATTEMPTS = 3;

export async function createBooking(data: CreateBookingInput) {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const result = await prisma.$transaction(
        async (tx) => {
          // Cari booking aktif yang jadwalnya bertabrakan
          const conflict = await tx.booking.findFirst({
            where: {
              roomId: data.roomId,
              status: {
                in: ["PENDING", "APPROVED", "CHECKED_IN"],
              },
              startTime: { lt: data.endTime },
              endTime: { gt: data.startTime },
            },
            select: { id: true },
          });

          if (conflict) {
            return { kind: "conflict" as const };
          }

          const booking = await tx.booking.create({
            data: {
              roomId: data.roomId,
              userId: data.userId,
              startTime: data.startTime,
              endTime: data.endTime,
              status: "PENDING",
            },
          });

          return {
            kind: "created" as const,
            booking,
          };
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          maxWait: 5000,
          timeout: 10000,
        },
      );

      if (result.kind === "created") {
        return {
          success: true as const,
          booking: result.booking,
        };
      }

      const recommendations = await getRecommendations(data.roomId, data.startTime, data.endTime);

      return {
        success: false as const,
        status: 409 as const,
        message: "Jadwal bentrok dengan booking lain",
        recommendations,
      };
    } catch (error) {
      // Konflik transaksi: ulangi pemeriksaan jadwal
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
        continue;
      }

      throw error;
    }
  }

  return {
    success: false as const,
    status: 503 as const,
    message: "Sistem sedang sibuk. Silakan coba lagi.",
    recommendations: [],
  };
}
