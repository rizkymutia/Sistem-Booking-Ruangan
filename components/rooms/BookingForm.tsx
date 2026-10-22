"use client";

import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

type SelectedSlot = {
  date: string;
  start: string;
  end: string;
};

type Recommendation = {
  roomId: string;
  roomName: string;
  start: string;
  end: string;
};

export default function BookingForm({ roomId, selectedSlot }: { roomId: string; selectedSlot: SelectedSlot | null }) {
  const [date, setDate] = useState(selectedSlot?.date ?? "");
  const [start, setStart] = useState(selectedSlot?.start ?? "");
  const [end, setEnd] = useState(selectedSlot?.end ?? "");

  const [bookingRoomId, setBookingRoomId] = useState(roomId);
  const [bookingRoomName, setBookingRoomName] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  function applyRecommendation(r: Recommendation) {
    const recommendedStart = new Date(r.start);
    const recommendedEnd = new Date(r.end);

    if (Number.isNaN(recommendedStart.getTime()) || Number.isNaN(recommendedEnd.getTime())) {
      toast.error("Jadwal rekomendasi tidak valid");
      return;
    }

    setBookingRoomId(r.roomId);
    setBookingRoomName(r.roomName);

    setDate(format(recommendedStart, "yyyy-MM-dd"));
    setStart(format(recommendedStart, "HH:mm"));
    setEnd(format(recommendedEnd, "HH:mm"));

    setRecommendations([]);
    setMessage("Rekomendasi dipilih. Periksa jadwal sebelum booking.");
  }
  async function submitBooking() {
    if (!date || !start || !end) {
      toast.error("Silakan pilih slot terlebih dahulu");
      return;
    }
    const startDate = new Date(`${date}T${start}:00`);
    const endDate = new Date(`${date}T${end}:00`);

    if (!Number.isFinite(startDate.getTime()) || !Number.isFinite(endDate.getTime()) || startDate <= new Date() || endDate <= startDate) {
      toast.error("Tanggal atau waktu booking tidak valid");
      return;
    }

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId: bookingRoomId,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      }),
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (res.ok) {
      toast.success("Booking berhasil");
      setRecommendations([]);
    } else {
      toast.error(data.message || "Terjadi kesalahan");

      if (data.recommendations) {
        setRecommendations(data.recommendations);
      }
    }

    setMessage(data.message ?? "");
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white">Booking</h3>
      {bookingRoomName && <p className="text-sm text-cyan-300">Ruangan rekomendasi: {bookingRoomName}</p>}
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white" />

      <div className="grid grid-cols-2 gap-3">
        <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-white" />

        <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-white" />
      </div>

      <button onClick={submitBooking} className="w-full rounded-lg bg-cyan-500 py-3 font-semibold text-slate-950 hover:bg-cyan-400">
        Book Now
      </button>

      {message && (
        <div className="rounded-lg bg-slate-800 p-4">
          <p className="font-medium text-cyan-400">{message}</p>

          {recommendations.length > 0 && (
            <div className="mt-4 space-y-3">
              <p className="text-sm font-semibold text-white">Rekomendasi Slot Terdekat</p>

              {recommendations.map((r) => (
                <div key={r.roomId} className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-cyan-300">{r.roomName}</p>

                      <p className="text-sm text-slate-300">{new Date(r.start).toLocaleDateString("id-ID")}</p>

                      <p className="text-sm text-slate-400">
                        {new Date(r.start).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}

                        {" - "}

                        {new Date(r.end).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <button onClick={() => applyRecommendation(r)} className="rounded-md bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
                      Gunakan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
