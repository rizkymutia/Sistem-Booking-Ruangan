import Skeleton from "@/components/ui/Skeleton";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/layout/Container";

export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <Container>
        <div className="py-10">
          <Skeleton className="h-10 w-72" />

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-slate-900 p-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-4 h-10 w-16" />
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-slate-900 p-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="mt-6 h-[260px] w-full rounded-xl" />
          </div>
        </div>
      </Container>
    </main>
  );
}
