import Skeleton from "@/components/ui/Skeleton";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/layout/Container";

export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <Container>
        <div className="py-10">
          <Skeleton className="h-10 w-52" />

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl bg-slate-900 p-5">
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="mt-4 h-5 w-32" />
                <Skeleton className="mt-2 h-4 w-20" />
                <Skeleton className="mt-4 h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
