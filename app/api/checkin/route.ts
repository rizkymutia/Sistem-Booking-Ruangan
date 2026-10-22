import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { z } from "zod";

const schema = z.object({
  qrToken: z.string().regex(/^[a-f0-9]{64}$/),
});

const EARLY_CHECKIN_MINUTES = 15;

export async function POST(req: Request) {
  try {
    const origin = req.headers.get("origin");
    if (origin && origin !== new URL(req.url).origin) {
      return NextResponse.json({ message: "Asal permintaan tidak diizinkan" }, { status: 403 });
    }

    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: "Silakan login sebagai petugas" }, { status: 401 });
    }
    if (user.role !== "ADMIN") {
      return NextResponse.json({ message: "Hanya petugas yang dapat memvalidasi QR" }, { status: 403 });
    }

    const body: unknown = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: "QR token tidak valid" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { qrToken: parsed.data.qrToken },
      select: { id: true, status: true, startTime: true, endTime: true },
    });
    if (!booking) {
      return NextResponse.json({ message: "QR tidak dikenal atau sudah digunakan" }, { status: 404 });
    }
    if (booking.status !== "APPROVED") {
      return NextResponse.json({ message: "Booking belum dapat di-check-in" }, { status: 409 });
    }

    const now = new Date();
    const earliest = new Date(booking.startTime.getTime() - EARLY_CHECKIN_MINUTES * 60_000);
    if (now < earliest) {
      return NextResponse.json(
        { message: "Check-in hanya tersedia 15 menit sebelum jadwal dimulai" },
        { status: 409 },
      );
    }
    if (now >= booking.endTime) {
      return NextResponse.json({ message: "Waktu check-in sudah berakhir" }, { status: 409 });
    }

    // Kondisi dicek ulang saat menulis untuk mencegah reuse/race dengan cancel.
    const result = await prisma.booking.updateMany({
      where: {
        id: booking.id,
        qrToken: parsed.data.qrToken,
        status: "APPROVED",
        startTime: { lte: new Date(now.getTime() + EARLY_CHECKIN_MINUTES * 60_000) },
        endTime: { gt: now },
      },
      data: {
        status: "CHECKED_IN",
        qrToken: null,
      },
    });
    if (result.count !== 1) {
      return NextResponse.json({ message: "Status atau jadwal booking sudah berubah" }, { status: 409 });
    }

    return NextResponse.json({ message: "Check-in berhasil" });
  } catch (error) {
    console.error("QR check-in failed:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
