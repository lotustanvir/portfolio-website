import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, EyeOff, Award, ExternalLink } from "lucide-react";
import type { Certificate } from "@/types/certificate";

interface Props {
  certificates: Certificate[];
  onEdit: (c: Certificate) => void;
  onDelete: (c: Certificate) => void;
}

export default function CertificateTable({ certificates, onEdit, onDelete }: Props) {
  if (certificates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4"><Award className="h-8 w-8 text-muted-foreground" /></div>
        <h3 className="text-lg font-medium">No certificates found</h3>
        <p className="text-sm text-muted-foreground mt-1">Add your first certificate to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Issuer</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Expiry</TableHead>
            <TableHead>Credential</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificates.map((c) => (
            <TableRow key={c.id}>
              <TableCell><span className="font-medium">{c.title}</span></TableCell>
              <TableCell><span className="text-sm text-muted-foreground">{c.issuer}</span></TableCell>
              <TableCell><span className="text-xs text-muted-foreground">{new Date(c.issueDate).toLocaleDateString()}</span></TableCell>
              <TableCell>
                {c.expiryDate ? (
                  <span className="text-xs text-muted-foreground">{new Date(c.expiryDate).toLocaleDateString()}</span>
                ) : <span className="text-xs text-muted-foreground">No expiry</span>}
              </TableCell>
              <TableCell>
                {c.credentialLink ? (
                  <a href={c.credentialLink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" onClick={(e) => e.stopPropagation()}>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : <span className="text-xs text-muted-foreground">—</span>}
              </TableCell>
              <TableCell>{c.isVisible ? <Eye className="h-4 w-4 text-emerald-500" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(c)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(c)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
