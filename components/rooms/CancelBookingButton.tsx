"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  bookingId: string;
};

export default function CancelBookingButton({ bookingId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    if (loading) return;

    const confirmed = window.confirm(
      "Batalkan booking ini? Tindakan ini tidak dapat dibatalkan.",
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/bookings/${encodeURIComponent(bookingId)}/cancel`,
        { method: "PATCH" },
      );

      const data: { message?: string } = await res.json();

      if (!res.ok) {
        toast.error(data.message ?? "Gagal membatalkan booking.");
        return;
      }

      toast.success(data.message ?? "Booking berhasil dibatalkan.");
      router.refresh();
    } catch {
      toast.error("Gagal menghubungi server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCancel}
      disabled={loading}
      className="rounded-lg border border-red-500/60 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
      aria-label="Batalkan booking"
    >
      {loading ? "Membatalkan..." : "Batalkan Booking"}
    </button>
  );
}
