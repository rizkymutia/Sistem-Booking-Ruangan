"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function CheckinPage() {
  const { id: qrToken } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleCheckin() {
    if (loading || success) return;
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrToken }),
      });
      const data: { message?: string } = await res.json();
      const info = data.message ?? "Respons server tidak dikenal";
      setMessage(info);
      if (!res.ok) {
        toast.error(info);
        return;
      }
      setSuccess(true);
      toast.success(info);
    } catch {
      setMessage("Tidak dapat terhubung ke server");
      toast.error("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 p-8 text-center">
        <div className="mb-5 text-5xl">📍</div>
        <h1 className="text-3xl font-bold">Verifikasi QR Check-in</h1>
        <p className="mt-3 text-slate-400">
          Khusus petugas admin. Pastikan peserta hadir sebelum memvalidasi QR.
        </p>
        <button
          type="button"
          onClick={handleCheckin}
          disabled={loading || success}
          className="mt-8 w-full rounded-xl bg-cyan-500 py-3 font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
        >
          {loading ? "Memverifikasi..." : success ? "Sudah terverifikasi" : "Verifikasi Kehadiran"}
        </button>
        {message && (
          <p role="status" className={`mt-5 rounded-lg bg-slate-800 p-3 ${success ? "text-green-400" : "text-amber-400"}`}>
            {message}
          </p>
        )}
        <Link href="/admin/bookings" className="mt-6 inline-block text-sm text-cyan-300 underline">
          Kembali ke pengelolaan booking
        </Link>
      </div>
    </main>
  );
}
