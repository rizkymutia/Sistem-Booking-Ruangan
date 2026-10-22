"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Booking = {
  id: string;
  status: string;
  startTime: Date;
  endTime: Date;
  user: {
    name: string;
    email: string;
  };
  room: {
    name: string;
  };
};

export default function AdminBookingCard({ booking }: { booking: Booking }) {
  const router = useRouter();

  async function updateStatus(status: string) {
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookingId: booking.id,
        status,
      }),
    });

    if (res.ok) {
      toast.success(`Booking ${status}`);
      router.refresh();
    } else {
      toast.error("Gagal mengubah status");
    }
  }
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-bold">{booking.room.name}</h2>

          <p className="text-slate-400">{booking.user.name}</p>

          <p className="text-sm text-slate-500">{booking.user.email}</p>

          <p className="mt-2 text-cyan-400">
            {format(booking.startTime, "dd MMM yyyy", {
              locale: id,
            })}{" "}
            • {format(booking.startTime, "HH:mm")} - {format(booking.endTime, "HH:mm")}
          </p>
        </div>

        {booking.status === "PENDING" ? (
          <div className="flex gap-3">
            <button onClick={() => updateStatus("APPROVED")} className="rounded-lg bg-green-600 px-4 py-2 font-semibold hover:bg-green-500">
              Approve
            </button>

            <button onClick={() => updateStatus("REJECTED")} className="rounded-lg bg-red-600 px-4 py-2 font-semibold hover:bg-red-500">
              Reject
            </button>
          </div>
        ) : (
          <span className={`rounded-full px-3 py-1 text-sm font-bold ${booking.status === "APPROVED" ? "bg-green-500/20 text-green-400" : booking.status === "CHECKED_IN" ? "bg-cyan-500/20 text-cyan-400" : "bg-red-500/20 text-red-400"}`}>
            {booking.status}
          </span>
        )}
      </div>
    </div>
  );
}
