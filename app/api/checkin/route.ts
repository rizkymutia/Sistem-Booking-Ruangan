import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { bookingId } = await req.json();

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    return NextResponse.json({ message: "Booking tidak ditemukan" }, { status: 404 });
  }

  if (booking.status === "CHECKED_IN") {
    return NextResponse.json({
      message: "Booking sudah pernah check-in",
    });
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "CHECKED_IN",
    },
  });

  return NextResponse.json({
    message: "Check-in berhasil",
  });
}
