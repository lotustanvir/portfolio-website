import { formatDistanceToNow } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Archive, ArchiveRestore, MessageSquareReply, Trash2, Mail, MailOpen } from "lucide-react";
import type { Message } from "@/types/message";
import { cn } from "@/lib/utils";

interface Props {
  messages: Message[];
  onView: (m: Message) => void;
  onToggleRead: (m: Message) => void;
  onArchive: (m: Message) => void;
  onReply: (m: Message) => void;
  onDelete: (m: Message) => void;
}

export default function MessageTable({ messages, onView, onToggleRead, onArchive, onReply, onDelete }: Props) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4"><Mail className="h-8 w-8 text-muted-foreground" /></div>
        <h3 className="text-lg font-medium">No messages found</h3>
        <p className="text-sm text-muted-foreground mt-1">When users submit the contact form, their messages will appear here.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8"></TableHead>
            <TableHead>From</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Received</TableHead>
            <TableHead className="w-[180px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((m) => (
            <TableRow key={m.id} className={cn(!m.isRead && "bg-primary/5 font-medium")}>
              <TableCell>
                {m.isRead ? (
                  <MailOpen className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Mail className="h-4 w-4 text-primary" />
                )}
              </TableCell>
              <TableCell>
                <button className="text-left hover:underline" onClick={() => onView(m)}>
                  <span className="block text-sm">{m.name}</span>
                  <span className="block text-xs text-muted-foreground">{m.email}</span>
                </button>
              </TableCell>
              <TableCell>
                <button className="text-left hover:underline" onClick={() => onView(m)}>
                  <span className="line-clamp-1 text-sm">{m.subject}</span>
                </button>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {m.isReplied && <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-500 border-blue-500/20">Replied</Badge>}
                  {m.isArchived && <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-500 border-amber-500/20">Archived</Badge>}
                  {!m.isRead && <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-500 border-emerald-500/20">New</Badge>}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onToggleRead(m)} title={m.isRead ? "Mark unread" : "Mark read"}>
                    {m.isRead ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onArchive(m)} title={m.isArchived ? "Unarchive" : "Archive"}>
                    {m.isArchived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onReply(m)} title="Reply" disabled={m.isArchived}>
                    <MessageSquareReply className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(m)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
