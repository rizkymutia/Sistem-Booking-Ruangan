import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";

export async function GET() {
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

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="SpaceSync_Report.xlsx"',
    },
  });
}
