import api from "@/lib/api";
import { DASHBOARD } from "@/constants/endpoints";
import type { DashboardResponse, DashboardData } from "@/types/dashboard";

export async function getDashboard(): Promise<DashboardData> {
  const { data } = await api.get<DashboardResponse>(DASHBOARD);
  return data.data;
}
