"use client";

import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function LogoutButton() {
  const handleLogout = async () => {
    toast.success("Logged out successfully !");
    redirect("/api/logout");
  };

  return <Button onClick={handleLogout}>Logout</Button>;
}
