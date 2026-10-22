"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer, SlotInfo } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { id } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { id };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type BookingEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
};

type Props = {
  roomId: string;
  onSelectSlot?: (slot: { date: string; start: string; end: string }) => void;
};

export default function RoomCalendar({ roomId, onSelectSlot }: Props) {
  const [events, setEvents] = useState<BookingEvent[]>([]);

  useEffect(() => {
    async function loadEvents() {
      const res = await fetch(`/api/rooms/${roomId}/bookings`);
      const data = await res.json();

      setEvents(
        data.map((e: any) => ({
          id: e.id,
          title: e.title,
          start: new Date(e.start),
          end: new Date(e.end),
        })),
      );
    }

    loadEvents();
  }, [roomId]);

  const defaultDate = useMemo(() => new Date(), []);

  function handleSelect(slot: SlotInfo) {
    onSelectSlot?.({
      date: format(slot.start as Date, "yyyy-MM-dd"),
      start: format(slot.start as Date, "HH:mm"),
      end: format(slot.end as Date, "HH:mm"),
    });
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h3 className="mb-4 text-xl font-bold text-white">Jadwal Ruangan</h3>

      <div className="calendar-dark w-full">
        <Calendar
          localizer={localizer}
          events={events}
          defaultView="week"
          views={["month", "week", "day"]}
          defaultDate={defaultDate}
          startAccessor="start"
          endAccessor="end"
          selectable
          step={30}
          timeslots={2}
          min={new Date(2026, 0, 1, 7, 0)}
          max={new Date(2026, 0, 1, 22, 0)}
          onSelectSlot={handleSelect}
          style={{ height: 700, width: "100%" }}
        />
      </div>
    </div>
  );
}
