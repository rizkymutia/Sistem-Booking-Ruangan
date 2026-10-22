import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { z } from "zod";

const checkinSchema = z.object({
  bookingId: z.string().trim().min(1),
});

export async function POST(req: Request) {
  try {
    // Pastikan pengguna sudah login
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: "Silakan login terlebih dahulu" }, { status: 401 });
    }

    // Validasi request
    const body: unknown = await req.json().catch(() => null);
    const parsed = checkinSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Data check-in tidak valid" }, { status: 400 });
    }

    const { bookingId } = parsed.data;

    // Cari booking dan pemiliknya
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        userId: true,
        status: true,
      },
    });

    // Jangan bocorkan informasi booking pengguna lain
    if (!booking || (user.role !== "ADMIN" && booking.userId !== user.id)) {
      return NextResponse.json({ message: "Booking tidak ditemukan" }, { status: 404 });
    }

    // Booking harus disetujui terlebih dahulu
    if (booking.status !== "APPROVED") {
      return NextResponse.json({ message: "Booking belum dapat di-check-in" }, { status: 409 });
    }

    // Update bersyarat untuk mencegah check-in ganda
    const result = await prisma.booking.updateMany({
      where: {
        id: bookingId,
        status: "APPROVED",
        ...(user.role === "ADMIN" ? {} : { userId: user.id }),
      },
      data: {
        status: "CHECKED_IN",
      },
    });

    if (result.count !== 1) {
      return NextResponse.json({ message: "Status booking sudah berubah" }, { status: 409 });
    }

    return NextResponse.json({
      message: "Check-in berhasil",
    });
  } catch (error) {
    console.error("Check-in failed:", error);

    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
