import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as experienceService from "./experience.service";
import ExperienceToolbar from "./components/ExperienceToolbar";
import ExperienceTable from "./components/ExperienceTable";
import ExperienceFormDialog from "./components/ExperienceFormDialog";
import ExperienceDeleteDialog from "./components/ExperienceDeleteDialog";
import ExperienceSkeleton from "./components/ExperienceSkeleton";
import Pagination from "@/components/common/Pagination";
import type { Experience, CreateExperienceInput, EmploymentType } from "@/types/experience";

export default function ExperiencePage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [employmentFilter, setEmploymentFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);

  const queryParams = {
    page, limit: 10,
    ...(search ? { search } : {}),
    ...(employmentFilter !== "all" ? { employmentType: employmentFilter as EmploymentType } : {}),
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["experience", queryParams],
    queryFn: () => experienceService.getExperiences(queryParams),
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateExperienceInput) => experienceService.createExperience(input),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["experience"] }); setFormOpen(false); toast.success("Experience created"); },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: CreateExperienceInput }) => experienceService.updateExperience(id, input),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["experience"] }); setFormOpen(false); setEditingExp(null); toast.success("Experience updated"); },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => experienceService.deleteExperience(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["experience"] }); setDeleteTarget(null); toast.success("Experience deleted"); },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleFormSubmit = useCallback(async (data: CreateExperienceInput) => {
    if (editingExp) await updateMutation.mutateAsync({ id: editingExp.id, input: data });
    else await createMutation.mutateAsync(data);
  }, [editingExp, createMutation, updateMutation]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
  }, [deleteTarget, deleteMutation]);

  const hasFilters = search !== "" || employmentFilter !== "all";

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-destructive">Failed to load experiences</p>
        <p className="text-sm text-muted-foreground mt-1">{error instanceof Error ? error.message : "An error occurred"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Experience</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your work history</p>
      </div>

      {isLoading ? <ExperienceSkeleton /> : (
        <>
          <ExperienceToolbar search={search} onSearchChange={(v) => { setSearch(v); setPage(1); }}
            employmentFilter={employmentFilter} onEmploymentFilterChange={(v) => { setEmploymentFilter(v); setPage(1); }}
            onCreateClick={() => { setEditingExp(null); setFormOpen(true); }}
            hasFilters={hasFilters} onClearFilters={() => { setSearch(""); setEmploymentFilter("all"); setPage(1); }} />
          <ExperienceTable experiences={data?.experiences ?? []} onEdit={(e) => { setEditingExp(e); setFormOpen(true); }} onDelete={setDeleteTarget} />
          {data?.pagination && <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} />}
        </>
      )}

      <ExperienceFormDialog open={formOpen} onOpenChange={(o) => { setFormOpen(o); if (!o) setEditingExp(null); }}
        onSubmit={handleFormSubmit} experience={editingExp} isSubmitting={createMutation.isPending || updateMutation.isPending} />
      <ExperienceDeleteDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}
        onConfirm={handleDelete} experienceTitle={deleteTarget ? `${deleteTarget.position} at ${deleteTarget.company}` : ""} isDeleting={deleteMutation.isPending} />
    </div>
  );
}
