import Navbar from "@/components/layout/Navbar";
import Container from "@/components/layout/Container";
import { requireAdmin } from "@/lib/requireAdmin";

export default async function ReportsPage() {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <Container>
        <div className="py-10">
          <h1 className="text-4xl font-bold">Laporan Booking</h1>
          <p className="mt-2 text-slate-400">Export seluruh data reservasi ke Excel atau PDF.</p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <a href="/api/reports/excel" className="rounded-2xl bg-green-600 p-6 text-center hover:bg-green-500">
              <div className="text-5xl">📗</div>
              <h2 className="mt-3 text-2xl font-bold">Export Excel</h2>
              <p className="mt-2 text-green-100">Format .xlsx siap diedit</p>
            </a>

            <a href="/api/reports/pdf" className="rounded-2xl bg-red-600 p-6 text-center hover:bg-red-500">
              <div className="text-5xl">📄</div>
              <h2 className="mt-3 text-2xl font-bold">Export PDF</h2>
              <p className="mt-2 text-red-100">Format siap cetak</p>
            </a>
          </div>
        </div>
      </Container>
    </main>
  );
}
