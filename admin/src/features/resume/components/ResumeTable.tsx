import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Download, CheckCircle2, Circle, FileText } from "lucide-react";
import type { Resume } from "@/types/resume";
import { cn } from "@/lib/utils";

interface Props {
  resumes: Resume[];
  onEdit: (r: Resume) => void;
  onDelete: (r: Resume) => void;
  onActivate: (r: Resume) => void;
  isActivating: boolean;
}

export default function ResumeTable({ resumes, onEdit, onDelete, onActivate, isActivating }: Props) {
  if (resumes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4"><FileText className="h-8 w-8 text-muted-foreground" /></div>
        <h3 className="text-lg font-medium">No resume versions found</h3>
        <p className="text-sm text-muted-foreground mt-1">Upload or create your first resume version.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Downloads</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resumes.map((r) => (
            <TableRow key={r.id}>
              <TableCell><span className="font-medium">{r.title}</span></TableCell>
              <TableCell><span className="text-sm text-muted-foreground">{r.version}</span></TableCell>
              <TableCell>
                {r.isActive ? (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Active
                  </Badge>
                ) : (
                  <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => onActivate(r)} disabled={isActivating}>
                    <Circle className="mr-1 h-3 w-3 text-muted-foreground" /> Set Active
                  </Button>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Download className="h-3 w-3" />
                  {r.downloadCount}
                </div>
              </TableCell>
              <TableCell><span className="text-xs text-muted-foreground">{new Date(r.uploadedAt).toLocaleDateString()}</span></TableCell>
              <TableCell><span className="text-xs text-muted-foreground">{new Date(r.updatedAt).toLocaleDateString()}</span></TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(r)} disabled={r.isActive}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(r)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
