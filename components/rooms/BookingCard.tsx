"use client";

import QRCode from "react-qr-code";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import CancelBookingButton from "@/components/rooms/CancelBookingButton";

type BookingStatus =
  | "PENDING"
  | "APPROVED"
  | "CHECKED_IN"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED";

type Booking = {
  id: string;
  status: BookingStatus;
  qrToken: string | null;
  startTime: Date;
  endTime: Date;
  room: { name: string; location: string };
};

const statusLabels: Record<BookingStatus, string> = {
  PENDING: "Menunggu Persetujuan",
  APPROVED: "Disetujui",
  CHECKED_IN: "Sudah Check-in",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
  REJECTED: "Ditolak",
};

const statusColors: Record<BookingStatus, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-400",
  APPROVED: "bg-cyan-500/10 text-cyan-400",
  CHECKED_IN: "bg-green-500/10 text-green-400",
  COMPLETED: "bg-slate-700 text-slate-300",
  CANCELLED: "bg-red-500/10 text-red-400",
  REJECTED: "bg-orange-500/10 text-orange-400",
};

export default function BookingCard({ booking }: { booking: Booking }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "");
  const isApproved = booking.status === "APPROVED";
  const isCheckedIn = booking.status === "CHECKED_IN";
  const canCancel = booking.status === "PENDING" || isApproved;
  const qrUrl = isApproved && booking.qrToken && baseUrl
    ? `${baseUrl}/checkin/${booking.qrToken}`
    : null;

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-lg">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="w-full flex-1 space-y-3">
          <h2 className="text-2xl font-bold">{booking.room.name}</h2>
          <p className="text-sm text-slate-400">📍 {booking.room.location}</p>
          <p className="text-sm text-slate-300">
            📅 {format(booking.startTime, "dd MMMM yyyy", { locale: id })}
          </p>
          <p className="font-semibold text-cyan-400">
            🕐 {format(booking.startTime, "HH:mm")} - {format(booking.endTime, "HH:mm")}
          </p>
          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusColors[booking.status]}`}>
            {statusLabels[booking.status]}
          </span>
          {canCancel && (
            <div className="pt-3">
              <CancelBookingButton bookingId={booking.id} />
            </div>
          )}
        </div>

        <div className="flex flex-col items-center text-center">
          {isCheckedIn ? (
            <div className="flex h-[164px] w-[164px] flex-col items-center justify-center rounded-xl bg-green-500/10 text-green-400">
              <div className="text-5xl">✅</div>
              <p className="mt-3 font-bold">Sudah Check-in</p>
            </div>
          ) : qrUrl ? (
            <>
              <div className="rounded-xl bg-white p-3">
                <QRCode value={qrUrl} size={140} />
              </div>
              <p className="mt-3 max-w-[210px] text-sm text-slate-400">
                Tunjukkan QR kepada petugas untuk dipindai.
              </p>
            </>
          ) : (
            <div className="flex min-h-[164px] w-[200px] flex-col items-center justify-center rounded-xl bg-slate-800 p-4 text-sm text-slate-400">
              {isApproved
                ? "QR belum tersedia. Minta admin menerbitkan QR untuk booking ini."
                : "QR tidak tersedia untuk status ini."}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
