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

interface SkillsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  onCreateClick: () => void;
  hasFilters: boolean;
  onClearFilters: () => void;
}

const SKILL_CATEGORIES = [
  "Frontend", "Backend", "Database", "Programming", "Cloud", "DevOps",
  "AI", "Machine Learning", "Data Analytics", "Business Analysis",
  "UI/UX", "Testing", "Tools", "Soft Skills", "Languages", "Other",
];

export default function SkillsToolbar({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  onCreateClick,
  hasFilters,
  onClearFilters,
}: SkillsToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search skills..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {SKILL_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
        <Plus className="mr-2 h-4 w-4" /> New Skill
      </Button>
    </div>
  );
}
