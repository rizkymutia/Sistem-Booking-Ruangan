import { prisma } from "@/lib/prisma";
import { getRecommendations } from "@/lib/recommendation";

type CreateBookingInput = {
  userId: string;
  roomId: string;
  startTime: Date;
  endTime: Date;
};

export async function createBooking(data: CreateBookingInput) {
  const conflict = await prisma.booking.findFirst({
    where: {
      roomId: data.roomId,
      status: {
        in: ["PENDING", "APPROVED", "CHECKED_IN"],
      },
      AND: [{ startTime: { lt: data.endTime } }, { endTime: { gt: data.startTime } }],
    },
  });

  if (conflict) {
    const recommendations = await getRecommendations(data.roomId, data.startTime, data.endTime);

    return {
      success: false,
      message: "Jadwal bentrok dengan booking lain",
      recommendations,
    };
  }

  const booking = await prisma.booking.create({
    data: {
      roomId: data.roomId,
      userId: data.userId,
      startTime: data.startTime,
      endTime: data.endTime,
      status: "PENDING",
    },
  });

  return {
    success: true,
    booking,
  };
}
