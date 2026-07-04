import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as certificateService from "./certificate.service";
import CertificateToolbar from "./components/CertificateToolbar";
import CertificateTable from "./components/CertificateTable";
import CertificateFormDialog from "./components/CertificateFormDialog";
import CertificateDeleteDialog from "./components/CertificateDeleteDialog";
import CertificateSkeleton from "./components/CertificateSkeleton";
import Pagination from "@/components/common/Pagination";
import type { Certificate, CreateCertificateInput } from "@/types/certificate";

export default function CertificatesPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Certificate | null>(null);

  const qp = { page, limit: 10, ...(search ? { search } : {}) };
  const { data, isLoading, error } = useQuery({ queryKey: ["certificates", qp], queryFn: () => certificateService.getCertificates(qp) });

  const create = useMutation({
    mutationFn: (i: CreateCertificateInput) => certificateService.createCertificate(i),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["certificates"] }); setFormOpen(false); toast.success("Certificate created"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: CreateCertificateInput }) => certificateService.updateCertificate(id, input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["certificates"] }); setFormOpen(false); setEditing(null); toast.success("Certificate updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: (id: string) => certificateService.deleteCertificate(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["certificates"] }); setDeleteTarget(null); toast.success("Certificate deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleSubmit = useCallback(async (d: CreateCertificateInput) => {
    if (editing) await update.mutateAsync({ id: editing.id, input: d }); else await create.mutateAsync(d);
  }, [editing, create, update]);

  const handleDelete = useCallback(async () => { if (deleteTarget) await del.mutateAsync(deleteTarget.id); }, [deleteTarget, del]);
  const hasFilters = search !== "";

  if (error) return <div className="flex flex-col items-center justify-center py-20"><p className="text-lg font-medium text-destructive">Failed to load</p></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Certificates</h1><p className="text-sm text-muted-foreground mt-1">Manage your professional certifications</p></div>
      {isLoading ? <CertificateSkeleton /> : (
        <>
          <CertificateToolbar search={search} onSearchChange={(v) => { setSearch(v); setPage(1); }} onCreateClick={() => { setEditing(null); setFormOpen(true); }} hasFilters={hasFilters} onClearFilters={() => { setSearch(""); setPage(1); }} />
          <CertificateTable certificates={data?.certificates ?? []} onEdit={(c) => { setEditing(c); setFormOpen(true); }} onDelete={setDeleteTarget} />
          {data?.pagination && <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} />}
        </>
      )}
      <CertificateFormDialog open={formOpen} onOpenChange={(o) => { setFormOpen(o); if (!o) setEditing(null); }} onSubmit={handleSubmit} certificate={editing} isSubmitting={create.isPending || update.isPending} />
      <CertificateDeleteDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }} onConfirm={handleDelete} certTitle={deleteTarget?.title ?? ""} isDeleting={del.isPending} />
    </div>
  );
}
