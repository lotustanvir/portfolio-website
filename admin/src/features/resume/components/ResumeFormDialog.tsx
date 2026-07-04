import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Resume, CreateResumeInput } from "@/types/resume";

const schema = z.object({
  title: z.string().min(1, "Required").max(200),
  version: z.string().min(1, "Required").max(50),
  fileUrl: z.string().min(1, "File URL is required"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean; onOpenChange: (o: boolean) => void; onSubmit: (d: CreateResumeInput) => Promise<void>;
  resume?: Resume | null; isSubmitting: boolean;
}

export default function ResumeFormDialog({ open, onOpenChange, onSubmit, resume, isSubmitting }: Props) {
  const isEditing = !!resume;
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { title: "", version: "", fileUrl: "" },
  });

  useEffect(() => {
    if (open) {
      if (resume) {
        reset({ title: resume.title, version: resume.version, fileUrl: resume.fileUrl });
      } else {
        reset({ title: "", version: "", fileUrl: "" });
      }
    }
  }, [open, resume, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Resume" : "New Resume"}</DialogTitle>
          <DialogDescription>{isEditing ? "Update the resume metadata." : "Create a new resume version. Upload the PDF first, then paste the URL."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Software Engineer Resume" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="version">Version</Label>
            <Input id="version" placeholder="v2.1" {...register("version")} />
            {errors.version && <p className="text-xs text-destructive">{errors.version.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="fileUrl">File URL</Label>
            <Input id="fileUrl" placeholder="/uploads/resume-..." {...register("fileUrl")} />
            {errors.fileUrl && <p className="text-xs text-destructive">{errors.fileUrl.message}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{isEditing ? "Saving..." : "Creating..."}</> : (isEditing ? "Save Changes" : "Create Resume")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
