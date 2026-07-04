import { Search, Plus, FilterX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExperienceToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  employmentFilter: string;
  onEmploymentFilterChange: (value: string) => void;
  onCreateClick: () => void;
  hasFilters: boolean;
  onClearFilters: () => void;
}

const EMPLOYMENT_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE", "FREELANCE"];

export default function ExperienceToolbar({
  search, onSearchChange, employmentFilter, onEmploymentFilterChange,
  onCreateClick, hasFilters, onClearFilters,
}: ExperienceToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search experiences..." value={search} onChange={(e) => onSearchChange(e.target.value)} className="pl-9" />
        </div>
        <Select value={employmentFilter} onValueChange={onEmploymentFilterChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Employment Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {EMPLOYMENT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>{t.replace("_", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <FilterX className="mr-1 h-4 w-4" /> Clear
          </Button>
        )}
      </div>
      <Button onClick={onCreateClick}>
        <Plus className="mr-2 h-4 w-4" /> New Experience
      </Button>
    </div>
  );
}
