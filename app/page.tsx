import Navbar from "@/components/layout/Navbar";
import Container from "@/components/layout/Container";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <Container>
        <section className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-32 text-center">
          <span className="mb-4 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1 text-sm text-cyan-400">Smart Room Booking System</span>

          <h1 className="mb-6 text-6xl font-bold tracking-tight">
            Space<span className="text-cyan-400">Sync</span>
          </h1>

          <p className="mb-10 max-w-2xl text-lg text-slate-300">Booking ruangan coworking dan kantor hybrid dengan kalender interaktif, smart conflict resolution, QR check-in, dan analytics dashboard.</p>

          <div className="mt-10 flex justify-center gap-4">
            <Link href="/rooms" className="rounded-xl bg-cyan-500 px-8 py-4 font-semibold text-slate-950 transition hover:bg-cyan-400">
              Mulai Booking
            </Link>

            <Link href="/rooms" className="rounded-xl border border-slate-700 px-8 py-4 font-semibold text-white transition hover:border-cyan-400">
              Lihat Ruangan
            </Link>
          </div>
        </section>
      </Container>
    </main>
  );
}
