import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { startReminderJob } from "@/lib/reminder";

export const metadata: Metadata = {
  title: "SpaceSync",
  description: "Smart Room Booking System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Jalankan scheduler (sementara untuk development)
  startReminderJob();

  return (
    <html lang="id">
      <body>
        {children}

        <Toaster position="top-right" richColors closeButton duration={2500} />
      </body>
    </html>
  );
}
