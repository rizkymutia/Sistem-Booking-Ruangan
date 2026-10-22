import Navbar from "@/components/layout/Navbar";
import Container from "@/components/layout/Container";
import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <Container>
        <div className="py-10">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="mt-3 h-4 w-80" />

          <div className="mt-8 space-y-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-slate-900 p-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-3 flex-1">
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-5 w-24" />
                  </div>

                  <div className="flex flex-col items-center">
                    <Skeleton className="h-[140px] w-[140px] rounded-xl" />
                    <Skeleton className="mt-3 h-9 w-28" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
