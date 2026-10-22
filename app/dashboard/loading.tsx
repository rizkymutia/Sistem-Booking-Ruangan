import Skeleton from "@/components/ui/Skeleton";
import Container from "@/components/layout/Container";
import Navbar from "@/components/layout/Navbar";

export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <Container>
        <div className="py-10">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="mt-3 h-4 w-72" />

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-slate-900 p-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-4 h-10 w-16" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
