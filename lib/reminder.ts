import cron from "node-cron";
import { prisma } from "@/lib/prisma";
import { sendBookingEmail } from "@/lib/mail";

export function startReminderJob() {
  cron.schedule("0 9 * * *", async () => {
    console.log("⏰ Menjalankan reminder H-1...");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const start = new Date(tomorrow);
    start.setHours(0, 0, 0, 0);

    const end = new Date(tomorrow);
    end.setHours(23, 59, 59, 999);

    const bookings = await prisma.booking.findMany({
      where: {
        status: "APPROVED",
        startTime: {
          gte: start,
          lte: end,
        },
      },
      include: {
        user: true,
        room: true,
      },
    });

    for (const booking of bookings) {
      await sendBookingEmail({
        to: booking.user.email,
        room: booking.room.name,
        date: booking.startTime.toLocaleDateString("id-ID"),
        start: booking.startTime.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        end: booking.endTime.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        reminder: true,
      });

      console.log(`Reminder terkirim ke ${booking.user.email}`);
    }
  });
}
