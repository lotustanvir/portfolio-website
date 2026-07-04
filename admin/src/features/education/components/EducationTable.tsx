import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, EyeOff, GraduationCap } from "lucide-react";
import type { Education } from "@/types/education";
import { cn } from "@/lib/utils";

interface EducationTableProps {
  educations: Education[];
  onEdit: (e: Education) => void;
  onDelete: (e: Education) => void;
}

export default function EducationTable({ educations, onEdit, onDelete }: EducationTableProps) {
  if (educations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4"><GraduationCap className="h-8 w-8 text-muted-foreground" /></div>
        <h3 className="text-lg font-medium">No education records found</h3>
        <p className="text-sm text-muted-foreground mt-1">Add your first education entry to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Institution</TableHead>
            <TableHead>Degree</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>CGPA</TableHead>
            <TableHead>Years</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {educations.map((e) => (
            <TableRow key={e.id}>
              <TableCell><span className="font-medium">{e.institution}</span></TableCell>
              <TableCell><span className="text-sm text-muted-foreground">{e.degree}</span></TableCell>
              <TableCell><span className="text-sm text-muted-foreground">{e.department || "—"}</span></TableCell>
              <TableCell><span className="text-sm text-muted-foreground">{e.cgpa || "—"}</span></TableCell>
              <TableCell>
                <span className="text-xs text-muted-foreground">
                  {e.startYear} — {e.isCurrent ? "Present" : e.endYear ?? "—"}
                </span>
              </TableCell>
              <TableCell>{e.isVisible ? <Eye className="h-4 w-4 text-emerald-500" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(e)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(e)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
