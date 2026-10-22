import Navbar from "@/components/layout/Navbar";
import Container from "@/components/layout/Container";
import RoomCard from "@/components/rooms/RoomCard";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getUser();
  <pre className="text-xs text-white">{JSON.stringify(user, null, 2)}</pre>;

  if (!user) {
    redirect("/login");
  }

  const rooms = await prisma.room.findMany({
    orderBy: {
      code: "asc",
    },
  });

  const activeBookings = await prisma.booking.count({
    where: {
      userId: user.id,
      status: {
        in: ["PENDING", "APPROVED"],
      },
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <Container>
        {/* Header */}
        <div className="py-10">
          <p className="text-cyan-400 text-sm font-medium">Welcome back,</p>

          <h1 className="mt-2 text-4xl font-bold">{user.email}</h1>

          <p className="mt-3 text-slate-400">Kelola booking ruangan coworking dengan mudah melalui SpaceSync.</p>
        </div>

        {/* Statistik */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Booking Aktif</p>

            <h2 className="mt-3 text-5xl font-bold text-cyan-400">{activeBookings}</h2>

            <p className="mt-2 text-xs text-slate-500">Pending & Approved</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Ruangan Tersedia</p>

            <h2 className="mt-3 text-5xl font-bold text-green-400">{rooms.length}</h2>

            <p className="mt-2 text-xs text-slate-500">Total Meeting Room</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Role</p>

            <h2 className="mt-3 text-3xl font-bold text-orange-400">{user.role}</h2>

            <p className="mt-2 text-xs text-slate-500">User Permission</p>
          </div>
        </div>

        {/* Daftar Ruangan */}
        <div className="mt-14 pb-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold">Ruangan Tersedia</h2>

              <p className="mt-2 text-slate-400">Pilih ruangan untuk melakukan booking.</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
