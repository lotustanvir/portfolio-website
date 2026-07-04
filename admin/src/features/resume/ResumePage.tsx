import { useState, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as resumeService from "./resume.service";
import ResumeToolbar from "./components/ResumeToolbar";
import ResumeTable from "./components/ResumeTable";
import ResumeFormDialog from "./components/ResumeFormDialog";
import ResumeDeleteDialog from "./components/ResumeDeleteDialog";
import ResumeSkeleton from "./components/ResumeSkeleton";
import Pagination from "@/components/common/Pagination";
import type { Resume, CreateResumeInput } from "@/types/resume";

export default function ResumePage() {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Resume | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Resume | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const qp = { page, limit: 10, ...(search ? { search } : {}) };
  const { data, isLoading, error } = useQuery({ queryKey: ["resume", qp], queryFn: () => resumeService.getResumes(qp) });

  const create = useMutation({
    mutationFn: (i: CreateResumeInput) => resumeService.createResume(i),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["resume"] }); setFormOpen(false); toast.success("Resume created"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: CreateResumeInput }) => resumeService.updateResume(id, input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["resume"] }); setFormOpen(false); setEditing(null); toast.success("Resume updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: (id: string) => resumeService.deleteResume(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["resume"] }); setDeleteTarget(null); toast.success("Resume deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const activate = useMutation({
    mutationFn: (id: string) => resumeService.activateResume(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["resume"] }); toast.success("Resume activated"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }
    setIsUploading(true);
    try {
      const result = await resumeService.uploadResumePdf(file);
      toast.success(`Uploaded: ${result.filename}`);
      setEditing(null);
      setFormOpen(true);
      // Pre-fill the form with the uploaded URL
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, []);

  const handleSubmit = useCallback(async (d: CreateResumeInput) => {
    if (editing) await update.mutateAsync({ id: editing.id, input: d }); else await create.mutateAsync(d);
  }, [editing, create, update]);

  const handleDelete = useCallback(async () => { if (deleteTarget) await del.mutateAsync(deleteTarget.id); }, [deleteTarget, del]);
  const hasFilters = search !== "";

  if (error) return <div className="flex flex-col items-center justify-center py-20"><p className="text-lg font-medium text-destructive">Failed to load</p></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Resume</h1><p className="text-sm text-muted-foreground mt-1">Manage resume versions and PDF uploads</p></div>

      <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleUpload} />

      {isLoading ? <ResumeSkeleton /> : (
        <>
          <ResumeToolbar search={search} onSearchChange={(v) => { setSearch(v); setPage(1); }}
            onCreateClick={() => { setEditing(null); setFormOpen(true); }}
            onUploadClick={() => fileInputRef.current?.click()}
            hasFilters={hasFilters} onClearFilters={() => { setSearch(""); setPage(1); }} isUploading={isUploading} />
          <ResumeTable resumes={data?.resumes ?? []}
            onEdit={(r) => { setEditing(r); setFormOpen(true); }}
            onDelete={setDeleteTarget}
            onActivate={(r) => activate.mutate(r.id)}
            isActivating={activate.isPending} />
          {data?.pagination && <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} />}
        </>
      )}
      <ResumeFormDialog open={formOpen} onOpenChange={(o) => { setFormOpen(o); if (!o) setEditing(null); }}
        onSubmit={handleSubmit} resume={editing} isSubmitting={create.isPending || update.isPending} />
      <ResumeDeleteDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}
        onConfirm={handleDelete} resumeTitle={deleteTarget?.title ?? ""} isDeleting={del.isPending} />
    </div>
  );
}
