import { Search, Plus, Upload, FilterX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  search: string; onSearchChange: (v: string) => void;
  onCreateClick: () => void; onUploadClick: () => void;
  hasFilters: boolean; onClearFilters: () => void;
  isUploading: boolean;
}

export default function ResumeToolbar({ search, onSearchChange, onCreateClick, onUploadClick, hasFilters, onClearFilters, isUploading }: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search resumes..." value={search} onChange={(e) => onSearchChange(e.target.value)} className="pl-9" />
        </div>
        {hasFilters && <Button variant="ghost" size="sm" onClick={onClearFilters}><FilterX className="mr-1 h-4 w-4" /> Clear</Button>}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onUploadClick} disabled={isUploading}>
          <Upload className="mr-2 h-4 w-4" />{isUploading ? "Uploading..." : "Upload PDF"}
        </Button>
        <Button onClick={onCreateClick}><Plus className="mr-2 h-4 w-4" /> New Resume</Button>
      </div>
    </div>
  );
}
