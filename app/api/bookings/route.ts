import { NextResponse } from "next/server";
import { getUser } from "@/lib/getUser";
import { createBooking } from "@/services/booking.service";

export async function POST(req: Request) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const result = await createBooking({
    userId: user.id,
    roomId: body.roomId,
    startTime: new Date(body.startTime),
    endTime: new Date(body.endTime),
  });

  if (!result.success) {
    return NextResponse.json(
      {
        message: result.message,
        recommendations: result.recommendations,
      },
      { status: 409 },
    );
  }

  return NextResponse.json({
    message: "Booking berhasil",
    booking: result.booking,
  });
}
