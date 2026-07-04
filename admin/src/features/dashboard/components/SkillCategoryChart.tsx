import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { SkillStatistics } from "@/types/dashboard";

const CATEGORY_COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#3b82f6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#8b5cf6",
];

interface SkillCategoryChartProps {
  data: SkillStatistics;
}

export default function SkillCategoryChart({ data }: SkillCategoryChartProps) {
  const chartData = Object.entries(data.categories).map(
    ([category, stats], index) => ({
      name: category,
      skills: stats.count,
      avgPercentage: stats.averagePercentage,
      fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    })
  );

  if (chartData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        No skill data available
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12 }}
            width={70}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "13px",
            }}
            formatter={(value) => [value, "Skills"]}
          />
          <Bar dataKey="skills" radius={[0, 4, 4, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
