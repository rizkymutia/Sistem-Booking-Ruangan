import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const { bookingId, status } = await req.json();

  if (!bookingId || !status) {
    return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
  }

  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  return NextResponse.json({
    message: `Booking ${status}`,
    booking,
  });
}
