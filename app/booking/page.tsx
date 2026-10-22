import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/layout/Container";
import BookingCard from "@/components/rooms/BookingCard";

export default async function BookingPage() {
  const user = await getUser();

  if (!user) redirect("/login");

  const bookings = await prisma.booking.findMany({
    where: {
      userId: user.id,
    },
    include: {
      room: true,
    },
    orderBy: {
      startTime: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <Container>
        <div className="py-10">
          <h1 className="text-4xl font-bold">Riwayat Booking</h1>

          <p className="mt-2 text-slate-400">Semua reservasi ruangan yang pernah Anda buat.</p>

          <div className="mt-8 space-y-5">
            {bookings.length === 0 ? <div className="rounded-2xl bg-slate-900 p-10 text-center text-slate-400">Belum ada booking.</div> : bookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)}
          </div>
        </div>
      </Container>
    </main>
  );
}
