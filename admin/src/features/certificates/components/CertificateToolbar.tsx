import { Search, Plus, FilterX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  search: string; onSearchChange: (v: string) => void; onCreateClick: () => void; hasFilters: boolean; onClearFilters: () => void;
}

export default function CertificateToolbar({ search, onSearchChange, onCreateClick, hasFilters, onClearFilters }: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search certificates..." value={search} onChange={(e) => onSearchChange(e.target.value)} className="pl-9" />
        </div>
        {hasFilters && <Button variant="ghost" size="sm" onClick={onClearFilters}><FilterX className="mr-1 h-4 w-4" /> Clear</Button>}
      </div>
      <Button onClick={onCreateClick}><Plus className="mr-2 h-4 w-4" /> New Certificate</Button>
    </div>
  );
}
