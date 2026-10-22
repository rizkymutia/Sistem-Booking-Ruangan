import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        code: "asc",
      },
    });

    return NextResponse.json(rooms);
  } catch {
    return NextResponse.json({ message: "Gagal mengambil data ruangan" }, { status: 500 });
  }
}
