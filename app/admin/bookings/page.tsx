import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/layout/Container";
import AdminBookingCard from "@/components/admin/AdminBookingCard";
import { requireAdmin } from "@/lib/requireAdmin";

export default async function AdminBookingsPage() {
  await requireAdmin();
  const bookings = await prisma.booking.findMany({
    include: {
      user: true,
      room: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <Container>
        <div className="py-10">
          <h1 className="text-4xl font-bold">Booking Management</h1>

          <p className="mt-2 text-slate-400">Approve atau reject seluruh reservasi ruangan.</p>

          <div className="mt-8 space-y-4">
            {bookings.map((booking) => (
              <AdminBookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
