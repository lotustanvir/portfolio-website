import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as educationService from "./education.service";
import EducationToolbar from "./components/EducationToolbar";
import EducationTable from "./components/EducationTable";
import EducationFormDialog from "./components/EducationFormDialog";
import EducationDeleteDialog from "./components/EducationDeleteDialog";
import EducationSkeleton from "./components/EducationSkeleton";
import Pagination from "@/components/common/Pagination";
import type { Education, CreateEducationInput } from "@/types/education";

export default function EducationPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Education | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Education | null>(null);

  const qp = { page, limit: 10, ...(search ? { search } : {}) };
  const { data, isLoading, error } = useQuery({ queryKey: ["education", qp], queryFn: () => educationService.getEducations(qp) });

  const create = useMutation({
    mutationFn: (i: CreateEducationInput) => educationService.createEducation(i),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["education"] }); setFormOpen(false); toast.success("Education created"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: CreateEducationInput }) => educationService.updateEducation(id, input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["education"] }); setFormOpen(false); setEditing(null); toast.success("Education updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: (id: string) => educationService.deleteEducation(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["education"] }); setDeleteTarget(null); toast.success("Education deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleSubmit = useCallback(async (d: CreateEducationInput) => {
    if (editing) await update.mutateAsync({ id: editing.id, input: d }); else await create.mutateAsync(d);
  }, [editing, create, update]);

  const handleDelete = useCallback(async () => { if (deleteTarget) await del.mutateAsync(deleteTarget.id); }, [deleteTarget, del]);
  const hasFilters = search !== "";

  if (error) return <div className="flex flex-col items-center justify-center py-20"><p className="text-lg font-medium text-destructive">Failed to load</p></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Education</h1><p className="text-sm text-muted-foreground mt-1">Manage your academic qualifications</p></div>
      {isLoading ? <EducationSkeleton /> : (
        <>
          <EducationToolbar search={search} onSearchChange={(v) => { setSearch(v); setPage(1); }} onCreateClick={() => { setEditing(null); setFormOpen(true); }} hasFilters={hasFilters} onClearFilters={() => { setSearch(""); setPage(1); }} />
          <EducationTable educations={data?.educations ?? []} onEdit={(e) => { setEditing(e); setFormOpen(true); }} onDelete={setDeleteTarget} />
          {data?.pagination && <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} />}
        </>
      )}
      <EducationFormDialog open={formOpen} onOpenChange={(o) => { setFormOpen(o); if (!o) setEditing(null); }} onSubmit={handleSubmit} education={editing} isSubmitting={create.isPending || update.isPending} />
      <EducationDeleteDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }} onConfirm={handleDelete} educationLabel={deleteTarget ? `${deleteTarget.degree} at ${deleteTarget.institution}` : ""} isDeleting={del.isPending} />
    </div>
  );
}
