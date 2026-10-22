import Link from "next/link";

type Room = {
  id: string;
  code: string;
  name: string;
  floor: number;
  capacity: number;
  location: string;
  description: string | null;
};

export default function RoomCard({ room }: { room: Room }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 hover:border-cyan-500 transition">
      <div className="flex h-44 items-center justify-center bg-slate-800">
        <span className="text-3xl font-bold text-slate-600">{room.code}</span>
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{room.name}</h2>

          <span className="rounded bg-cyan-500/20 px-2 py-1 text-xs text-cyan-400">{room.code}</span>
        </div>

        <p className="text-sm text-slate-400">{room.location}</p>

        <div className="flex justify-between text-sm">
          <span>👥 {room.capacity}</span>
          <span>🏢 Lt. {room.floor}</span>
        </div>

        <p className="line-clamp-2 text-sm text-slate-400">{room.description}</p>

        <Link href={`/rooms/${room.id}`} className="block w-full rounded-lg bg-cyan-500 py-2 text-center font-semibold text-slate-950 hover:bg-cyan-400">
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}
