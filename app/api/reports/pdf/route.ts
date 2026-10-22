import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const bookings = await prisma.booking.findMany({
    include: {
      room: true,
      user: true,
    },
    orderBy: {
      startTime: "desc",
    },
  });

  const doc = new PDFDocument({ margin: 40 });

  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => chunks.push(chunk));

  const endPromise = new Promise<Buffer>((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
  });

  doc.fontSize(22).text("SpaceSync Booking Report");
  doc.moveDown();

  doc.fontSize(11);

  bookings.forEach((b, index) => {
    doc.text(`${index + 1}. ${b.room.name}`);
    doc.text(`User   : ${b.user.name}`);
    doc.text(`Tanggal: ${b.startTime.toLocaleDateString("id-ID")}`);
    doc.text(
      `Jam    : ${b.startTime.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${b.endTime.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
    );
    doc.text(`Status : ${b.status}`);
    doc.moveDown();
  });

  doc.end();

  const pdf = await endPromise;

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="SpaceSync_Report.pdf"',
    },
  });
}
