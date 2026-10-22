import Link from "next/link";
import Container from "./Container";
import { getUser } from "@/lib/getUser";
import LogoutButton from "@/components/layout/LogoutButton";

export default async function Navbar() {
  const user = await getUser();

  return (
    <nav className="border-b border-slate-800/60 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Space<span className="text-cyan-400">Sync</span>
          </Link>

          <div className="hidden gap-8 text-sm text-slate-300 md:flex">
            <Link href="/">Home</Link>
            <Link href="/rooms">Ruangan</Link>
            <Link href="/dashboard">Dashboard</Link>

            {user && <Link href="/booking">Booking</Link>}

            {user?.role === "ADMIN" && (
              <>
                <Link href="/admin">Admin</Link>
                <Link href="/admin/bookings">Manage Booking</Link>
                <Link href="/admin/reports">Reports</Link>
              </>
            )}
          </div>

          <div className="flex gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-cyan-400">{user.name}</span>

                <LogoutButton />
              </div>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
}
