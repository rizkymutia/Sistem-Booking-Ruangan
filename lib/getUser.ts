import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

type TokenPayload = {
  id: string;
};

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

    // Ambil data TERBARU dari database
    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    return user;
  } catch {
    return null;
  }
}
