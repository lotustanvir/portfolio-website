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
import type { Education, CreateEducationInput } from "@/types/education";

const schema = z.object({
  institution: z.string().min(1, "Required").max(200),
  degree: z.string().min(1, "Required").max(200),
  department: z.string().optional(),
  cgpa: z.string().optional(),
  startYear: z.coerce.number().int().min(1900).max(2100),
  endYear: z.coerce.number().int().min(1900).max(2100).optional().or(z.literal("")),
  isCurrent: z.boolean(),
  description: z.string().optional(),
  isVisible: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmit: (d: CreateEducationInput) => Promise<void>;
  education?: Education | null;
  isSubmitting: boolean;
}

export default function EducationFormDialog({ open, onOpenChange, onSubmit, education, isSubmitting }: Props) {
  const isEditing = !!education;
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { institution: "", degree: "", department: "", cgpa: "", startYear: 2020, endYear: "", isCurrent: false, description: "", isVisible: true },
  });

  useEffect(() => {
    if (open) {
      if (education) {
        reset({
          institution: education.institution, degree: education.degree,
          department: education.department || "", cgpa: education.cgpa || "",
          startYear: education.startYear, endYear: education.endYear ?? "" as any,
          isCurrent: education.isCurrent, description: education.description || "",
          isVisible: education.isVisible,
        });
      } else {
        reset({ institution: "", degree: "", department: "", cgpa: "", startYear: 2020, endYear: "", isCurrent: false, description: "", isVisible: true });
      }
    }
  }, [open, education, reset]);

  const isCurrent = watch("isCurrent");

  const onFormSubmit = async (data: FormData) => {
    await onSubmit({
      institution: data.institution, degree: data.degree,
      department: data.department || undefined, cgpa: data.cgpa || undefined,
      startYear: data.startYear, endYear: data.endYear ? Number(data.endYear) : undefined,
      isCurrent: data.isCurrent, description: data.description || undefined,
      isVisible: data.isVisible,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Education" : "New Education"}</DialogTitle>
          <DialogDescription>{isEditing ? "Update the education details." : "Add a new education entry."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="institution">Institution</Label>
              <Input id="institution" placeholder="University" {...register("institution")} />
              {errors.institution && <p className="text-xs text-destructive">{errors.institution.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="degree">Degree</Label>
              <Input id="degree" placeholder="B.Sc. Computer Science" {...register("degree")} />
              {errors.degree && <p className="text-xs text-destructive">{errors.degree.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department (optional)</Label>
              <Input id="department" placeholder="Computer Science" {...register("department")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cgpa">CGPA (optional)</Label>
              <Input id="cgpa" placeholder="3.8 / 4.0" {...register("cgpa")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startYear">Start Year</Label>
              <Input id="startYear" type="number" {...register("startYear")} />
              {errors.startYear && <p className="text-xs text-destructive">{errors.startYear.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endYear">End Year</Label>
              <Input id="endYear" type="number" {...register("endYear")} disabled={isCurrent} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" rows={3} {...register("description")} />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch id="isCurrent" checked={isCurrent} onCheckedChange={(c) => setValue("isCurrent", c)} />
              <Label htmlFor="isCurrent">Currently studying</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="isVisible" checked={watch("isVisible")} onCheckedChange={(c) => setValue("isVisible", c)} />
              <Label htmlFor="isVisible">Visible on portfolio</Label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{isEditing ? "Saving..." : "Creating..."}</> : (isEditing ? "Save Changes" : "Create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
