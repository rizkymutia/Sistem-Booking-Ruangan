"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/logout", {
      method: "POST",
    });

    toast.success("Logout berhasil");

    router.push("/");
    router.refresh();
  }

  return (
    <button onClick={logout} className="flex items-center gap-2 rounded-lg border border-red-500/40 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10">
      <LogOut size={16} />
      Logout
    </button>
  );
}
