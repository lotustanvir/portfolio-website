import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as skillsService from "./skills.service";
import SkillsToolbar from "./components/SkillsToolbar";
import SkillsTable from "./components/SkillsTable";
import SkillFormDialog from "./components/SkillFormDialog";
import SkillDeleteDialog from "./components/SkillDeleteDialog";
import SkillsSkeleton from "./components/SkillsSkeleton";
import Pagination from "@/components/common/Pagination";
import type { Skill, CreateSkillInput } from "@/types/skill";

export default function SkillsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);

  const queryParams = {
    page,
    limit: 10,
    ...(search ? { search } : {}),
    ...(categoryFilter !== "all" ? { category: categoryFilter } : {}),
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["skills", queryParams],
    queryFn: () => skillsService.getSkills(queryParams),
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateSkillInput) => skillsService.createSkill(input),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["skills"] }); setFormOpen(false); toast.success("Skill created"); },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: CreateSkillInput }) => skillsService.updateSkill(id, input),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["skills"] }); setFormOpen(false); setEditingSkill(null); toast.success("Skill updated"); },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => skillsService.deleteSkill(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["skills"] }); setDeleteTarget(null); toast.success("Skill deleted"); },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleFormSubmit = useCallback(async (data: CreateSkillInput) => {
    if (editingSkill) await updateMutation.mutateAsync({ id: editingSkill.id, input: data });
    else await createMutation.mutateAsync(data);
  }, [editingSkill, createMutation, updateMutation]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
  }, [deleteTarget, deleteMutation]);

  const hasFilters = search !== "" || categoryFilter !== "all";

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-destructive">Failed to load skills</p>
        <p className="text-sm text-muted-foreground mt-1">{error instanceof Error ? error.message : "An error occurred"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Skills</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your technical skills</p>
      </div>

      {isLoading ? <SkillsSkeleton /> : (
        <>
          <SkillsToolbar search={search} onSearchChange={(v) => { setSearch(v); setPage(1); }}
            categoryFilter={categoryFilter} onCategoryFilterChange={(v) => { setCategoryFilter(v); setPage(1); }}
            onCreateClick={() => { setEditingSkill(null); setFormOpen(true); }}
            hasFilters={hasFilters} onClearFilters={() => { setSearch(""); setCategoryFilter("all"); setPage(1); }} />
          <SkillsTable skills={data?.skills ?? []} onEdit={(s) => { setEditingSkill(s); setFormOpen(true); }} onDelete={setDeleteTarget} />
          {data?.pagination && <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} />}
        </>
      )}

      <SkillFormDialog open={formOpen} onOpenChange={(o) => { setFormOpen(o); if (!o) setEditingSkill(null); }}
        onSubmit={handleFormSubmit} skill={editingSkill} isSubmitting={createMutation.isPending || updateMutation.isPending} />
      <SkillDeleteDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}
        onConfirm={handleDelete} skillName={deleteTarget?.name ?? ""} isDeleting={deleteMutation.isPending} />
    </div>
  );
}
