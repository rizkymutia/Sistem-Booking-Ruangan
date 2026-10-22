import { prisma } from "@/lib/prisma";
import AnalyticsChart from "@/components/charts/AnalyticsChart";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/layout/Container";
import { requireAdmin } from "@/lib/requireAdmin";

export default async function AdminPage() {
  await requireAdmin();
  const totalBookings = await prisma.booking.count();

  const totalRooms = await prisma.room.count();

  const roomStats = await prisma.room.findMany({
    include: {
      bookings: true,
    },
  });

  const chartData = roomStats.map((room) => ({
    name: room.name,
    bookings: room.bookings.length,
  }));

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <Container>
        <div className="py-10">
          <h1 className="text-4xl font-bold">Analytics Dashboard</h1>

          <p className="mt-2 text-slate-400">Monitoring penggunaan ruang meeting SpaceSync</p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-900 p-6">
              <p className="text-slate-400">Total Booking</p>

              <h2 className="mt-3 text-5xl font-bold text-cyan-400">{totalBookings}</h2>
            </div>

            <div className="rounded-2xl bg-slate-900 p-6">
              <p className="text-slate-400">Total Ruangan</p>

              <h2 className="mt-3 text-5xl font-bold text-green-400">{totalRooms}</h2>
            </div>

            <div className="rounded-2xl bg-slate-900 p-6">
              <p className="text-slate-400">Utilisasi</p>

              <h2 className="mt-3 text-5xl font-bold text-orange-400">{Math.round((totalBookings / (totalRooms || 1)) * 100)}%</h2>
            </div>
          </div>

          <div className="mt-10 rounded-2xl bg-slate-900 p-6">
            <h3 className="mb-4 text-2xl font-bold">Booking per Ruangan</h3>

            <AnalyticsChart data={chartData} />
          </div>
        </div>
      </Container>
    </main>
  );
}
