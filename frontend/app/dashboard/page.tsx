import type { Metadata } from "next";
import { Dashboard } from "./dashboard";

export const metadata: Metadata = {
  title: "Dashboard | Rosterly",
  description: "A calmer view of your team's week. Plan shifts, check coverage, and keep everyone in the loop.",
};

export default function DashboardPage() {
  return <Dashboard />;
}
