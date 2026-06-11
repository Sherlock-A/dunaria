import { getStats } from "@/lib/adminStats";
import { DashboardClient } from "@/components/admin/DashboardClient";

export default async function AdminDashboard() {
  const stats = await getStats();
  return <DashboardClient initialStats={stats} />;
}
