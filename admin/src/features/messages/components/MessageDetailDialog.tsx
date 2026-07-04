import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Message } from "@/types/message";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  message: Message | null;
}

export default function MessageDetailDialog({ open, onOpenChange, message }: Props) {
  if (!message) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>{message.subject}</DialogTitle>
            {message.isReplied && <Badge variant="outline" className="bg-blue-500/10 text-blue-500">Replied</Badge>}
          </div>
          <DialogDescription>
            From {message.name} &lt;{message.email}&gt;
            {" · "}
            {format(new Date(message.createdAt), "MMM d, yyyy h:mm a")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-4 text-sm leading-relaxed whitespace-pre-wrap">
            {message.message}
          </div>

          {message.replyMessage && (
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
              <p className="mb-2 text-xs font-medium text-blue-500">Your Reply</p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.replyMessage}</p>
              {message.repliedAt && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Replied on {format(new Date(message.repliedAt), "MMM d, yyyy h:mm a")}
                  {message.repliedBy ? ` by ${message.repliedBy}` : ""}
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
