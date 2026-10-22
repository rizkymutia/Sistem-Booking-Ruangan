import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <div className="text-7xl">🔒</div>

        <h1 className="mt-4 text-4xl font-bold">403 Forbidden</h1>

        <p className="mt-2 text-slate-400">Anda tidak memiliki akses ke halaman ini.</p>

        <Link href="/dashboard" className="mt-6 inline-block rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950">
          Kembali ke Dashboard
        </Link>
      </div>
    </main>
  );
}
