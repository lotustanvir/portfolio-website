import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, EyeOff, Briefcase } from "lucide-react";
import type { Experience } from "@/types/experience";
import { cn } from "@/lib/utils";

const employmentColors: Record<string, string> = {
  FULL_TIME: "bg-blue-500/10 text-blue-500",
  PART_TIME: "bg-amber-500/10 text-amber-500",
  CONTRACT: "bg-violet-500/10 text-violet-500",
  INTERNSHIP: "bg-emerald-500/10 text-emerald-500",
  REMOTE: "bg-cyan-500/10 text-cyan-500",
  FREELANCE: "bg-rose-500/10 text-rose-500",
};

interface ExperienceTableProps {
  experiences: Experience[];
  onEdit: (exp: Experience) => void;
  onDelete: (exp: Experience) => void;
}

export default function ExperienceTable({ experiences, onEdit, onDelete }: ExperienceTableProps) {
  if (experiences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Briefcase className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No experience entries found</h3>
        <p className="text-sm text-muted-foreground mt-1">Add your first work experience to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {experiences.map((exp) => (
            <TableRow key={exp.id}>
              <TableCell>
                <span className="font-medium">{exp.position}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">{exp.company}</span>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={cn("font-normal", employmentColors[exp.employmentType])}>
                  {exp.employmentType.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">{exp.location}</span>
              </TableCell>
              <TableCell>
                <span className="text-xs text-muted-foreground">
                  {new Date(exp.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  {" — "}
                  {exp.isCurrent ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—"}
                </span>
              </TableCell>
              <TableCell>
                {exp.isVisible ? (
                  <Eye className="h-4 w-4 text-emerald-500" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(exp)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(exp)} className="text-destructive hover:text-destructive">
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
