import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Certificate, CreateCertificateInput } from "@/types/certificate";

const schema = z.object({
  title: z.string().min(1, "Required").max(200),
  issuer: z.string().min(1, "Required").max(200),
  description: z.string().optional(),
  issueDate: z.string().min(1, "Required"),
  expiryDate: z.string().optional(),
  credentialLink: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  isVisible: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean; onOpenChange: (o: boolean) => void; onSubmit: (d: CreateCertificateInput) => Promise<void>;
  certificate?: Certificate | null; isSubmitting: boolean;
}

export default function CertificateFormDialog({ open, onOpenChange, onSubmit, certificate, isSubmitting }: Props) {
  const isEditing = !!certificate;

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { title: "", issuer: "", description: "", issueDate: "", expiryDate: "", credentialLink: "", isVisible: true },
  });

  useEffect(() => {
    if (open) {
      if (certificate) {
        reset({
          title: certificate.title, issuer: certificate.issuer,
          description: certificate.description || "",
          issueDate: certificate.issueDate.split("T")[0],
          expiryDate: certificate.expiryDate?.split("T")[0] || "",
          credentialLink: certificate.credentialLink || "",
          isVisible: certificate.isVisible,
        });
      } else {
        reset({ title: "", issuer: "", description: "", issueDate: "", expiryDate: "", credentialLink: "", isVisible: true });
      }
    }
  }, [open, certificate, reset]);

  const onFormSubmit = async (data: FormData) => {
    await onSubmit({
      ...data,
      description: data.description || undefined,
      expiryDate: data.expiryDate || undefined,
      credentialLink: data.credentialLink || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Certificate" : "New Certificate"}</DialogTitle>
          <DialogDescription>{isEditing ? "Update the certificate details." : "Add a new certificate."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="AWS Solutions Architect" {...register("title")} />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="issuer">Issuer</Label>
              <Input id="issuer" placeholder="Amazon Web Services" {...register("issuer")} />
              {errors.issuer && <p className="text-xs text-destructive">{errors.issuer.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" rows={3} {...register("description")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input id="issueDate" type="date" {...register("issueDate")} />
              {errors.issueDate && <p className="text-xs text-destructive">{errors.issueDate.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date (optional)</Label>
              <Input id="expiryDate" type="date" {...register("expiryDate")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="credentialLink">Credential URL (optional)</Label>
            <Input id="credentialLink" placeholder="https://credential.example.com/..." {...register("credentialLink")} />
            {errors.credentialLink && <p className="text-xs text-destructive">{errors.credentialLink.message}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Switch id="isVisible" checked={watch("isVisible")} onCheckedChange={(c) => setValue("isVisible", c)} />
            <Label htmlFor="isVisible">Visible on portfolio</Label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{isEditing ? "Saving..." : "Creating..."}</> : (isEditing ? "Save Changes" : "Create Certificate")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
