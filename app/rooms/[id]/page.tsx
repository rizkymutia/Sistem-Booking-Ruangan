import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Container from "@/components/layout/Container";
import RoomBookingSection from "@/components/rooms/RoomBookingSection";

export default async function RoomDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const room = await prisma.room.findUnique({
    where: { id },
  });

  if (!room) notFound();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <Container>
        <div className="py-8">
          {/* Hero */}
          <div className="flex h-72 items-center justify-center rounded-3xl border border-slate-700 bg-slate-800">
            <h1 className="text-6xl font-bold text-slate-600">{room.code}</h1>
          </div>

          {/* Judul */}
          <div className="mt-8 flex items-center gap-3">
            <h2 className="text-4xl font-bold">{room.name}</h2>

            <span className="rounded bg-cyan-500/20 px-3 py-1 text-sm text-cyan-400">{room.code}</span>
          </div>

          <p className="mt-3 max-w-3xl text-slate-400">{room.description}</p>

          {/* Informasi */}
          <div className="mt-8 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">Kapasitas</p>
                <h3 className="mt-2 text-3xl font-bold">{room.capacity} Orang</h3>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">Lantai</p>
                <h3 className="mt-2 text-3xl font-bold">{room.floor}</h3>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">Fasilitas</p>
              <p className="mt-3 text-lg">{room.facilities}</p>
            </div>
          </div>

          {/* Booking + Kalender */}
          <div className="mt-10">
            <RoomBookingSection roomId={room.id} />
          </div>
        </div>
      </Container>
    </main>
  );
}
