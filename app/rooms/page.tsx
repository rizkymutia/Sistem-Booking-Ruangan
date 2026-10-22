import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/layout/Container";
import RoomCard from "@/components/rooms/RoomCard";

export default async function RoomsPage() {
  const rooms = await prisma.room.findMany({
    orderBy: { code: "asc" },
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <Container>
        <div className="py-10">
          <h1 className="text-4xl font-bold">Daftar Ruangan</h1>
          <p className="mt-2 text-slate-400">Pilih ruangan yang tersedia untuk melakukan booking.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </Container>
    </main>
  );
}
