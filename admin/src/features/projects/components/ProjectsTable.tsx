import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2, Star, ExternalLink } from "lucide-react";
import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  PUBLISHED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  DRAFT: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  ARCHIVED: "bg-muted text-muted-foreground border-muted-foreground/20",
};

interface ProjectsTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export default function ProjectsTable({
  projects,
  onEdit,
  onDelete,
}: ProjectsTableProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <ExternalLink className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No projects found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Create your first project to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Technologies</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{project.title}</span>
                  {project.featured && (
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {project.category}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn("font-normal", statusColors[project.status])}
                >
                  {project.status.charAt(0) + project.status.slice(1).toLowerCase()}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {project.technologies?.slice(0, 3).map((pt) => (
                    <Badge key={pt.id} variant="secondary" className="text-xs font-normal">
                      {pt.technology.name}
                    </Badge>
                  ))}
                  {(project.technologies?.length ?? 0) > 3 && (
                    <Badge variant="secondary" className="text-xs font-normal">
                      +{project.technologies.length - 3}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(project)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(project)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
