import {
  Folders,
  Code2,
  Briefcase,
  GraduationCap,
  Award,
  MessageSquareText,
  Download,
} from "lucide-react";
import type { DashboardTotals } from "@/types/dashboard";
import StatCard from "./StatCard";

interface StatsGridProps {
  totals: DashboardTotals;
}

const statConfigs: Array<{
  title: string;
  key: keyof DashboardTotals;
  icon: typeof Folders;
  description: string;
  iconClassName?: string;
}> = [
  {
    title: "Total Projects",
    key: "projects",
    icon: Folders,
    description: "Active portfolio projects",
    iconClassName: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Skills",
    key: "skills",
    icon: Code2,
    description: "Technical skills tracked",
    iconClassName: "bg-violet-500/10 text-violet-500",
  },
  {
    title: "Experience",
    key: "experience",
    icon: Briefcase,
    description: "Work history entries",
    iconClassName: "bg-amber-500/10 text-amber-500",
  },
  {
    title: "Education",
    key: "education",
    icon: GraduationCap,
    description: "Academic qualifications",
    iconClassName: "bg-emerald-500/10 text-emerald-500",
  },
  {
    title: "Certificates",
    key: "certificates",
    icon: Award,
    description: "Professional certifications",
    iconClassName: "bg-rose-500/10 text-rose-500",
  },
  {
    title: "Unread Messages",
    key: "unreadMessages",
    icon: MessageSquareText,
    description: "Awaiting your reply",
    iconClassName: "bg-cyan-500/10 text-cyan-500",
  },
  {
    title: "Resume Downloads",
    key: "resumeDownloads",
    icon: Download,
    description: "Total resume downloads",
    iconClassName: "bg-orange-500/10 text-orange-500",
  },
];

export default function StatsGrid({ totals }: StatsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {statConfigs.map((config, index) => (
        <StatCard
          key={config.key}
          title={config.title}
          value={totals[config.key]}
          icon={config.icon}
          description={config.description}
          iconClassName={config.iconClassName}
        />
      ))}
    </div>
  );
}
