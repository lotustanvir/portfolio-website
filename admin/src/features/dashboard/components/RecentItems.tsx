import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  FileText,
  MessageSquare,
  Award,
  ArrowRight,
  CheckCircle2,
  Circle,
} from "lucide-react";
import type { LatestProject, LatestMessage, LatestCertificate } from "@/types/dashboard";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

interface RecentItemsProps {
  projects: LatestProject[];
  messages: LatestMessage[];
  certificates: LatestCertificate[];
}

export default function RecentItems({
  projects,
  messages,
  certificates,
}: RecentItemsProps) {
  const navigate = useNavigate();

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Latest Projects */}
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            <h3 className="font-semibold">Latest Projects</h3>
          </div>
          <button
            onClick={() => navigate(ROUTES.PROJECTS)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View all <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="divide-y">
          {projects.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              No projects yet
            </p>
          ) : (
            projects.map((project) => (
              <button
                key={project.id}
                onClick={() => navigate(ROUTES.PROJECT_EDIT(project.id))}
                className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-muted/50"
              >
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{project.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {project.category}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-xs font-medium capitalize",
                    project.status === "COMPLETED" && "text-emerald-500",
                    project.status === "IN_PROGRESS" && "text-blue-500",
                    project.status === "DRAFT" && "text-muted-foreground"
                  )}
                >
                  {project.status.replace("_", " ").toLowerCase()}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Latest Messages */}
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-cyan-500" />
            <h3 className="font-semibold">Latest Messages</h3>
          </div>
          <button
            onClick={() => navigate(ROUTES.MESSAGES)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View all <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="divide-y">
          {messages.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              No messages yet
            </p>
          ) : (
            messages.map((message) => (
              <button
                key={message.id}
                onClick={() => navigate(ROUTES.MESSAGE_DETAIL(message.id))}
                className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-muted/50"
              >
                {message.isRead ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 fill-blue-500 text-blue-500" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{message.subject}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {message.name} &middot;{" "}
                    {formatDistanceToNow(new Date(message.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Latest Certificates */}
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-rose-500" />
            <h3 className="font-semibold">Latest Certificates</h3>
          </div>
          <button
            onClick={() => navigate(ROUTES.CERTIFICATES)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View all <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="divide-y">
          {certificates.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              No certificates yet
            </p>
          ) : (
            certificates.map((cert) => (
              <button
                key={cert.id}
                onClick={() => navigate(ROUTES.CERTIFICATE_EDIT(cert.id))}
                className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-muted/50"
              >
                <Award className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{cert.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {cert.issuer}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(cert.issueDate).getFullYear()}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
