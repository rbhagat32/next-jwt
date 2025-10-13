"use server";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const getLoggedInUser = async () => {
  const userId = (await headers()).get("x-user-id");
  if (!userId) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/api/logout");

  return user;
};

export { getLoggedInUser };
