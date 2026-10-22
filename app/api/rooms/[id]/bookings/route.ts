import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const bookings = await prisma.booking.findMany({
    where: {
      roomId: id,
      status: {
        in: ["PENDING", "APPROVED", "CHECKED_IN"],
      },
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      status: true,
    },
  });

  const events = bookings.map((b) => ({
    id: b.id,
    title: b.status,
    start: b.startTime,
    end: b.endTime,
  }));

  return NextResponse.json(events);
}
