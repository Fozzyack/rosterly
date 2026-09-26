import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/auth";
import { Dashboard } from "./dashboard";

export const metadata: Metadata = {
  title: "Dashboard | Rosterly",
  description: "A calmer view of your team's week. Plan shifts, check coverage, and keep everyone in the loop.",
};

export default async function DashboardPage() {
  if (!(await cookies()).has(SESSION_COOKIE)) redirect("/login");
  return <Dashboard />;
}
