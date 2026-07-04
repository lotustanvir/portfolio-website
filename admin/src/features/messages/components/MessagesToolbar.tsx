import { Search, Download, FilterX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getExportUrl } from "@/features/messages/message.service";

interface Props {
  search: string; onSearchChange: (v: string) => void;
  readFilter: string; onReadFilterChange: (v: string) => void;
  archivedFilter: string; onArchivedFilterChange: (v: string) => void;
  hasFilters: boolean; onClearFilters: () => void;
}

export default function MessagesToolbar({
  search, onSearchChange, readFilter, onReadFilterChange,
  archivedFilter, onArchivedFilterChange, hasFilters, onClearFilters,
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search messages..." value={search} onChange={(e) => onSearchChange(e.target.value)} className="pl-9" />
        </div>
        <Select value={readFilter} onValueChange={onReadFilterChange}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="Read Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Messages</SelectItem>
            <SelectItem value="true">Read</SelectItem>
            <SelectItem value="false">Unread</SelectItem>
          </SelectContent>
        </Select>
        <Select value={archivedFilter} onValueChange={onArchivedFilterChange}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="Archive" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Archived</SelectItem>
            <SelectItem value="false">Active</SelectItem>
          </SelectContent>
        </Select>
        {hasFilters && <Button variant="ghost" size="sm" onClick={onClearFilters}><FilterX className="mr-1 h-4 w-4" /> Clear</Button>}
      </div>
      <a href={getExportUrl()} download>
        <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
      </a>
    </div>
  );
}
