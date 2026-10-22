import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    // Tolak request lintas-origin dari browser untuk mengurangi risiko CSRF.
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) {
      return NextResponse.json(
        { message: "Asal permintaan tidak diizinkan." },
        { status: 403 },
      );
    }

    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu." },
        { status: 401 },
      );
    }

    const { id } = await params;
    if (!id || id.length > 128) {
      return NextResponse.json(
        { message: "ID booking tidak valid." },
        { status: 400 },
      );
    }

    // Cari booking berdasarkan ID sekaligus pemiliknya.
    // Pengguna tidak dapat melihat detail booking milik orang lain.
    const booking = await prisma.booking.findFirst({
      where: { id, userId: user.id },
      select: { id: true, status: true, startTime: true },
    });

    if (!booking) {
      return NextResponse.json(
        { message: "Booking tidak ditemukan." },
        { status: 404 },
      );
    }

    if (booking.status !== "PENDING" && booking.status !== "APPROVED") {
      return NextResponse.json(
        { message: "Booking dengan status ini tidak dapat dibatalkan." },
        { status: 409 },
      );
    }

    if (booking.startTime <= new Date()) {
      return NextResponse.json(
        { message: "Jadwal sudah dimulai; booking tidak dapat dibatalkan." },
        { status: 409 },
      );
    }

    // Pembaruan bersyarat: tetap aman ketika admin/check-in/request lain
    // mengubah status booking pada saat yang hampir bersamaan.
    const updated = await prisma.booking.updateMany({
      where: {
        id: booking.id,
        userId: user.id,
        status: { in: ["PENDING", "APPROVED"] },
        startTime: { gt: new Date() },
      },
      data: {
        status: "CANCELLED",
        qrToken: null,
      },
    });

    if (updated.count !== 1) {
      return NextResponse.json(
        { message: "Status booking sudah berubah. Muat ulang halaman." },
        { status: 409 },
      );
    }

    return NextResponse.json({
      message: "Booking berhasil dibatalkan.",
      booking: { id: booking.id, status: "CANCELLED" },
    });
  } catch (error) {
    console.error("Booking cancellation failed:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server." },
      { status: 500 },
    );
  }
}
