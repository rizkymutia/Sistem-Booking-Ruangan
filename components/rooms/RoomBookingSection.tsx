"use client";

import { useState } from "react";
import BookingForm from "./BookingForm";
import RoomCalendar from "../calendar/RoomCalendar";

export type SelectedSlot = {
  date: string;
  start: string;
  end: string;
};

export default function RoomBookingSection({ roomId }: { roomId: string }) {
  const [slot, setSlot] = useState<SelectedSlot | null>(null);

  return (
    <div className="space-y-8">
      <BookingForm key={`${roomId}-${slot?.date ?? ""}-${slot?.start ?? ""}-${slot?.end ?? ""}`} roomId={roomId} selectedSlot={slot} />
      <RoomCalendar roomId={roomId} onSelectSlot={setSlot} />
    </div>
  );
}
