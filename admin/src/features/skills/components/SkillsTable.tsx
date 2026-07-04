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
import { Edit, Trash2, Eye, EyeOff, Code2 } from "lucide-react";
import type { Skill } from "@/types/skill";

interface SkillsTableProps {
  skills: Skill[];
  onEdit: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
}

export default function SkillsTable({ skills, onEdit, onDelete }: SkillsTableProps) {
  if (skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Code2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No skills found</h3>
        <p className="text-sm text-muted-foreground mt-1">Add your first skill to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Proficiency</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skills.map((skill) => (
            <TableRow key={skill.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {skill.color && (
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: skill.color }}
                    />
                  )}
                  <span className="font-medium">{skill.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">{skill.category}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{skill.percentage}%</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">{skill.displayOrder}</span>
              </TableCell>
              <TableCell>
                {skill.isVisible ? (
                  <Eye className="h-4 w-4 text-emerald-500" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(skill)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(skill)} className="text-destructive hover:text-destructive">
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
