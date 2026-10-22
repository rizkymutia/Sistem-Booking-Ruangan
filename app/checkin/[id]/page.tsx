"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CheckinPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleCheckin() {
    if (loading) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId: id }),
      });

      const data = await res.json();
      setMessage(data.message ?? "");

      if (!res.ok) {
        toast.error(data.message ?? "Check-in gagal");
        return;
      }

      toast.success("Check-in berhasil!");

      router.replace("/booking");
      router.refresh();
    } catch {
      setMessage("Gagal menghubungi server");
      toast.error("Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 p-8 text-center">
        <div className="mb-6 text-6xl">📍</div>

        <h1 className="text-3xl font-bold">QR Check-in</h1>

        <p className="mt-2 text-slate-400">Konfirmasi kehadiran booking ruangan</p>

        <button type="button" onClick={handleCheckin} disabled={loading} className="mt-8 w-full rounded-xl bg-cyan-500 py-3 font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-60">
          {loading ? "Memproses..." : "Check In"}
        </button>

        {message && (
          <div className="mt-5 rounded-lg bg-slate-800 p-3">
            <p className="font-semibold text-cyan-400">{message}</p>
          </div>
        )}
      </div>
    </main>
  );
}
