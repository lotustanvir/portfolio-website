import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "./dashboard.service";
import StatsGrid from "./components/StatsGrid";
import ProjectStatusChart from "./components/ProjectStatusChart";
import SkillCategoryChart from "./components/SkillCategoryChart";
import RecentItems from "./components/RecentItems";
import DashboardSkeleton from "./components/DashboardSkeleton";

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    refetchInterval: 60_000,
  });

  if (isLoading) return <DashboardSkeleton />;

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-destructive">Failed to load dashboard</p>
        <p className="text-sm text-muted-foreground mt-1">
          {error instanceof Error ? error.message : "An unexpected error occurred"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your portfolio and activity
        </p>
      </div>

      {/* Stats Grid */}
      <StatsGrid totals={data.totals} />

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 font-semibold">Project Status</h3>
          <ProjectStatusChart data={data.projectStatistics} />
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 font-semibold">Skills by Category</h3>
          <SkillCategoryChart data={data.skillStatistics} />
        </div>
      </div>

      {/* Recent Items */}
      <RecentItems
        projects={data.latestProjects}
        messages={data.latestMessages}
        certificates={data.latestCertificates}
      />
    </div>
  );
}
