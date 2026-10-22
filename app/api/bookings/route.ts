import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { createBooking } from "@/services/booking.service";

const bookingSchema = z.object({
  roomId: z.string().trim().min(1),
  startTime: z.iso.datetime({ offset: true }),
  endTime: z.iso.datetime({ offset: true }),
});

export async function POST(req: Request) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: "Silakan login terlebih dahulu" }, { status: 401 });
    }

    const body: unknown = await req.json().catch(() => null);
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Data booking tidak valid" }, { status: 400 });
    }

    const { roomId } = parsed.data;
    const startTime = new Date(parsed.data.startTime);
    const endTime = new Date(parsed.data.endTime);

    if (!Number.isFinite(startTime.getTime()) || !Number.isFinite(endTime.getTime()) || startTime <= new Date() || endTime <= startTime) {
      return NextResponse.json({ message: "Waktu booking tidak valid" }, { status: 400 });
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { id: true },
    });

    if (!room) {
      return NextResponse.json({ message: "Ruangan tidak ditemukan" }, { status: 404 });
    }

    const result = await createBooking({
      userId: user.id,
      roomId,
      startTime,
      endTime,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          message: result.message,
          recommendations: result.recommendations,
        },
        { status: result.status },
      );
    }

    return NextResponse.json(
      {
        message: "Booking berhasil",
        booking: result.booking,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create booking failed:", error);

    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
