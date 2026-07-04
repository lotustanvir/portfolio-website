import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from "lucide-react";
import type { Message } from "@/types/message";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  message: Message | null;
  onSubmit: (replyMessage: string) => Promise<void>;
  isSending: boolean;
}

export default function MessageReplyDialog({ open, onOpenChange, message, onSubmit, isSending }: Props) {
  const [replyMessage, setReplyMessage] = useState("");

  const handleSubmit = async () => {
    if (!replyMessage.trim()) return;
    await onSubmit(replyMessage.trim());
    setReplyMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) setReplyMessage(""); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reply to {message?.name}</DialogTitle>
          <DialogDescription>
            Re: {message?.subject}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-3 text-sm max-h-32 overflow-y-auto">
            <p className="text-xs text-muted-foreground mb-1">Original message:</p>
            <p className="line-clamp-4">{message?.message}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reply">Your Reply</Label>
            <Textarea
              id="reply"
              rows={5}
              placeholder="Type your reply..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { onOpenChange(false); setReplyMessage(""); }} disabled={isSending}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSending || !replyMessage.trim()}>
            {isSending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : <><Send className="mr-2 h-4 w-4" /> Send Reply</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
