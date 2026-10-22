import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { z } from "zod";

const schema = z.object({
  bookingId: z.string().trim().min(1),
  status: z.enum(["APPROVED", "REJECTED"]),
});

export async function PATCH(req: Request) {
  try {
    const origin = req.headers.get("origin");
    if (origin && origin !== new URL(req.url).origin) {
      return NextResponse.json({ message: "Asal permintaan tidak diizinkan" }, { status: 403 });
    }

    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: "Silakan login terlebih dahulu" }, { status: 401 });
    }
    if (user.role !== "ADMIN") {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    const body: unknown = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: "Data booking tidak valid" }, { status: 400 });
    }

    const { bookingId, status } = parsed.data;
    const token = status === "APPROVED" ? randomBytes(32).toString("hex") : null;

    // Approval hanya boleh dari PENDING; QR dibuat sekaligus dalam update bersyarat.
    const updated = await prisma.booking.updateMany({
      where: { id: bookingId, status: "PENDING" },
      data: { status, qrToken: token },
    });

    if (updated.count !== 1) {
      const existing = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: { status: true },
      });
      return NextResponse.json(
        { message: existing ? "Booking sudah diproses" : "Booking tidak ditemukan" },
        { status: existing ? 409 : 404 },
      );
    }

    // Token sengaja TIDAK dikembalikan di respons API admin.
    return NextResponse.json({
      message: status === "APPROVED" ? "Booking disetujui" : "Booking ditolak",
      booking: { id: bookingId, status },
    });
  } catch (error) {
    console.error("Admin booking update failed:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
