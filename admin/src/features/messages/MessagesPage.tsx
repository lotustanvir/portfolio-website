import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as messageService from "./message.service";
import MessagesToolbar from "./components/MessagesToolbar";
import MessageTable from "./components/MessageTable";
import MessageDetailDialog from "./components/MessageDetailDialog";
import MessageReplyDialog from "./components/MessageReplyDialog";
import MessageDeleteDialog from "./components/MessageDeleteDialog";
import MessagesSkeleton from "./components/MessagesSkeleton";
import Pagination from "@/components/common/Pagination";
import type { Message } from "@/types/message";

export default function MessagesPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState("all");
  const [archivedFilter, setArchivedFilter] = useState("all");
  const [detailTarget, setDetailTarget] = useState<Message | null>(null);
  const [replyTarget, setReplyTarget] = useState<Message | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);

  const qp = {
    page, limit: 10,
    ...(search ? { search } : {}),
    ...(readFilter !== "all" ? { isRead: readFilter } : {}),
    ...(archivedFilter !== "all" ? { isArchived: archivedFilter } : {}),
  };

  const { data, isLoading, error } = useQuery({ queryKey: ["messages", qp], queryFn: () => messageService.getMessages(qp) });

  const markRead = useMutation({
    mutationFn: ({ id, isRead }: { id: string; isRead: boolean }) => messageService.markRead(id, isRead),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["messages"] }); toast.success("Status updated"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const archiveMut = useMutation({
    mutationFn: ({ id, isArchived }: { id: string; isArchived: boolean }) => messageService.archiveMessage(id, isArchived),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["messages"] }); toast.success("Archive status updated"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const replyMut = useMutation({
    mutationFn: ({ id, replyMessage }: { id: string; replyMessage: string }) => messageService.replyToMessage(id, replyMessage),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["messages"] }); setReplyTarget(null); toast.success("Reply sent"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: (id: string) => messageService.deleteMessage(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["messages"] }); setDeleteTarget(null); toast.success("Message deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleDelete = useCallback(async () => { if (deleteTarget) await del.mutateAsync(deleteTarget.id); }, [deleteTarget, del]);
  const hasFilters = search !== "" || readFilter !== "all" || archivedFilter !== "all";

  if (error) return <div className="flex flex-col items-center justify-center py-20"><p className="text-lg font-medium text-destructive">Failed to load</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage contact form submissions</p>
        </div>
      </div>

      {isLoading ? <MessagesSkeleton /> : (
        <>
          <MessagesToolbar search={search} onSearchChange={(v) => { setSearch(v); setPage(1); }}
            readFilter={readFilter} onReadFilterChange={(v) => { setReadFilter(v); setPage(1); }}
            archivedFilter={archivedFilter} onArchivedFilterChange={(v) => { setArchivedFilter(v); setPage(1); }}
            hasFilters={hasFilters} onClearFilters={() => { setSearch(""); setReadFilter("all"); setArchivedFilter("all"); setPage(1); }} />
          <MessageTable messages={data?.messages ?? []}
            onView={setDetailTarget}
            onToggleRead={(m) => markRead.mutate({ id: m.id, isRead: !m.isRead })}
            onArchive={(m) => archiveMut.mutate({ id: m.id, isArchived: !m.isArchived })}
            onReply={setReplyTarget}
            onDelete={setDeleteTarget} />
          {data?.pagination && <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} />}
        </>
      )}

      <MessageDetailDialog open={!!detailTarget} onOpenChange={(o) => { if (!o) setDetailTarget(null); }} message={detailTarget} />
      <MessageReplyDialog open={!!replyTarget} onOpenChange={(o) => { if (!o) setReplyTarget(null); }}
        message={replyTarget} onSubmit={async (replyMessage) => { if (replyTarget) await replyMut.mutateAsync({ id: replyTarget.id, replyMessage }); }}
        isSending={replyMut.isPending} />
      <MessageDeleteDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}
        onConfirm={handleDelete} subject={deleteTarget?.subject ?? ""} isDeleting={del.isPending} />
    </div>
  );
}
