import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { z } from "zod";

const updateBookingSchema = z.object({
  bookingId: z.string().trim().min(1),
  status: z.enum(["APPROVED", "REJECTED"]),
});

export async function PATCH(req: Request) {
  try {
    // 1. Pastikan pengguna sudah login
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: "Silakan login terlebih dahulu" }, { status: 401 });
    }

    // 2. Pastikan pengguna adalah ADMIN
    if (user.role !== "ADMIN") {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    // 3. Validasi request
    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ message: "Format JSON tidak valid" }, { status: 400 });
    }

    const parsed = updateBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Data booking tidak valid" }, { status: 400 });
    }

    const { bookingId, status } = parsed.data;

    // 4. Hanya booking PENDING yang boleh diproses
    const result = await prisma.booking.updateMany({
      where: {
        id: bookingId,
        status: "PENDING",
      },
      data: {
        status,
      },
    });

    if (result.count === 0) {
      const existing = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: { status: true },
      });

      return NextResponse.json(
        {
          message: existing ? "Booking sudah diproses atau status tidak sesuai" : "Booking tidak ditemukan",
        },
        { status: existing ? 409 : 404 },
      );
    }

    return NextResponse.json({
      message: `Booking berhasil diubah menjadi ${status}`,
      booking: {
        id: bookingId,
        status,
      },
    });
  } catch (error) {
    console.error("Admin booking update failed:", error);

    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
