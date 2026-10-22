import { redirect } from "next/navigation";
import { getUser } from "./getUser";

export async function requireAdmin() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/forbidden");
  }

  return user;
}
