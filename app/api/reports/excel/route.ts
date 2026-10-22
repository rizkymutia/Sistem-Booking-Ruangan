import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function GET() {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Booking Report");

  sheet.columns = [
    { header: "Ruangan", key: "room", width: 20 },
    { header: "User", key: "user", width: 25 },
    { header: "Tanggal", key: "date", width: 18 },
    { header: "Jam", key: "time", width: 18 },
    { header: "Status", key: "status", width: 18 },
  ];

  const bookings = await prisma.booking.findMany({
    include: {
      user: true,
      room: true,
    },
    orderBy: {
      startTime: "desc",
    },
  });

  bookings.forEach((b) => {
    sheet.addRow({
      room: b.room.name,
      user: b.user.name,
      date: b.startTime.toLocaleDateString("id-ID"),
      time: `${b.startTime.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${b.endTime.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      status: b.status,
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="SpaceSync_Report.xlsx"',
    },
  });
}
