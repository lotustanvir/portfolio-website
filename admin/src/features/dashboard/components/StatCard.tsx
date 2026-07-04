import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: { value: number; positive: boolean };
  className?: string;
  iconClassName?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
  iconClassName,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 pt-1">
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.positive ? "text-emerald-500" : "text-destructive"
                )}
              >
                {trend.positive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
            iconClassName || "bg-primary/10 text-primary"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
