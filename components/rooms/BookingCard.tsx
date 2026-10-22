"use client";

import QRCode from "react-qr-code";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import CancelBookingButton from "@/components/rooms/CancelBookingButton";

type BookingStatus = "PENDING" | "APPROVED" | "CHECKED_IN" | "COMPLETED" | "CANCELLED" | "REJECTED";

type Booking = {
  id: string;
  status: BookingStatus;
  startTime: Date;
  endTime: Date;
  room: {
    name: string;
    location: string;
  };
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
  // URL aplikasi dari environment variable
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "");

  const qrUrl = baseUrl ? `${baseUrl}/checkin/${booking.id}` : null;

  // Status booking
  const isPending = booking.status === "PENDING";
  const isApproved = booking.status === "APPROVED";
  const isCheckedIn = booking.status === "CHECKED_IN";

  // Booking dapat dibatalkan jika PENDING atau APPROVED.
  // Backend tetap memvalidasi waktu dan kepemilikan.
  const canCancel = isPending || isApproved;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition hover:border-slate-700">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        {/* INFORMASI BOOKING */}
        <div className="w-full flex-1 space-y-3">
          {/* Nama ruangan */}
          <h2 className="text-2xl font-bold text-white">{booking.room.name}</h2>

          {/* Lokasi ruangan */}
          <p className="text-sm text-slate-400">📍 {booking.room.location}</p>

          {/* Tanggal booking */}
          <p className="text-sm text-slate-300">📅 {format(booking.startTime, "dd MMMM yyyy", { locale: id })}</p>

          {/* Waktu booking */}
          <p className="font-semibold text-cyan-400">
            🕐 {format(booking.startTime, "HH:mm")}
            {" - "}
            {format(booking.endTime, "HH:mm")}
          </p>

          {/* Status booking */}
          <div className="pt-1">
            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusColors[booking.status]}`}>{statusLabels[booking.status]}</span>
          </div>

          {/* TOMBOL CANCEL BOOKING */}
          {canCancel && (
            <div className="pt-3">
              <CancelBookingButton bookingId={booking.id} />
            </div>
          )}
        </div>

        {/* QR CODE DAN STATUS CHECK-IN */}
        <div className="flex flex-col items-center text-center">
          {/* SUDAH CHECK-IN */}
          {isCheckedIn ? (
            <div className="flex h-[164px] w-[164px] flex-col items-center justify-center rounded-xl border border-green-500/30 bg-green-500/10">
              <div className="text-5xl">✅</div>

              <p className="mt-3 font-bold text-green-400">Sudah Check-in</p>
            </div>
          ) : isApproved && qrUrl ? (
            /* BOOKING APPROVED - TAMPILKAN QR */
            <>
              <div className="rounded-xl bg-white p-3">
                <QRCode value={qrUrl} size={140} />
              </div>

              <p className="mt-3 text-xs text-slate-400">QR Check-in</p>

              <Link href={`/checkin/${booking.id}`} className="mt-3 block rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                Buka Check-in
              </Link>
            </>
          ) : isApproved ? (
            /* APPROVED TAPI URL BELUM DIATUR */
            <div className="max-w-[200px] rounded-xl bg-slate-800 p-4">
              <p className="text-sm text-amber-400">URL aplikasi belum dikonfigurasi.</p>
            </div>
          ) : (
            /* STATUS LAIN - TIDAK ADA QR */
            <div className="flex h-[164px] w-[164px] flex-col items-center justify-center rounded-xl border border-slate-700 bg-slate-800 p-4">
              <div className="text-4xl">🔒</div>

              <p className="mt-3 text-sm text-slate-400">
                {isPending ? "Menunggu persetujuan admin" : booking.status === "CANCELLED" ? "Booking telah dibatalkan" : booking.status === "REJECTED" ? "Booking ditolak" : "QR Check-in tidak tersedia"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
