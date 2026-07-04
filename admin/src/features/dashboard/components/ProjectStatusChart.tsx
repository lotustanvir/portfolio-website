import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { ProjectStatistics } from "@/types/dashboard";

const STATUS_COLORS: Record<string, string> = {
  completed: "#22c55e",
  in_progress: "#3b82f6",
  draft: "#a1a1aa",
  archived: "#f43f5e",
};

const STATUS_LABELS: Record<string, string> = {
  completed: "Completed",
  in_progress: "In Progress",
  draft: "Draft",
  archived: "Archived",
};

interface ProjectStatusChartProps {
  data: ProjectStatistics;
}

export default function ProjectStatusChart({ data }: ProjectStatusChartProps) {
  const chartData = Object.entries(data.byStatus).map(([status, count]) => ({
    name: STATUS_LABELS[status] || status,
    value: count,
    color: STATUS_COLORS[status] || "#6366f1",
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        No project data available
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "13px",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value: string) => (
              <span className="text-sm text-muted-foreground">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
