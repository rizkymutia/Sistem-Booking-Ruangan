"use client";

import QRCode from "react-qr-code";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";

type Booking = {
  id: string;
  status: string;
  startTime: Date;
  endTime: Date;
  room: {
    name: string;
    location: string;
  };
};

export default function BookingCard({ booking }: { booking: Booking }) {
  const qrUrl = `http://localhost:3000/checkin/${booking.id}`;
  const checkedIn = booking.status === "CHECKED_IN";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        {/* Informasi Booking */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{booking.room.name}</h2>

          <p className="text-slate-400">{booking.room.location}</p>

          <p className="text-slate-300">
            {format(booking.startTime, "dd MMMM yyyy", {
              locale: id,
            })}
          </p>

          <p className="font-semibold text-cyan-400">
            {format(booking.startTime, "HH:mm")} - {format(booking.endTime, "HH:mm")}
          </p>

          {checkedIn ? (
            <span className="inline-flex rounded-full bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-400">CHECKED_IN</span>
          ) : (
            <span className="inline-flex rounded-full bg-orange-500/20 px-3 py-1 text-sm font-semibold text-orange-400">PENDING</span>
          )}
        </div>

        {/* QR / Status */}
        <div className="text-center">
          {checkedIn ? (
            <div className="flex h-[164px] w-[164px] flex-col items-center justify-center rounded-xl border border-green-500/30 bg-green-500/10">
              <div className="text-5xl">✅</div>

              <p className="mt-3 font-bold text-green-400">Sudah Check-in</p>
            </div>
          ) : (
            <>
              <div className="rounded-xl bg-white p-3">
                <QRCode value={qrUrl} size={140} />
              </div>

              <Link href={`/checkin/${booking.id}`} className="mt-3 block rounded-lg bg-cyan-500 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400">
                Buka QR
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
