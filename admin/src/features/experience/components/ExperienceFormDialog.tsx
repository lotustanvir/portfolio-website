import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Experience, CreateExperienceInput } from "@/types/experience";

const EMPLOYMENT_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE", "FREELANCE"] as const;

const experienceSchema = z.object({
  company: z.string().min(1, "Company is required").max(200),
  position: z.string().min(1, "Position is required").max(200),
  employmentType: z.enum(EMPLOYMENT_TYPES),
  description: z.string().min(10, "Description must be at least 10 characters"),
  responsibilities: z.string().optional(),
  location: z.string().min(1, "Location is required").max(200),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isCurrent: z.boolean(),
  isVisible: z.boolean(),
});

type FormData = z.infer<typeof experienceSchema>;

interface ExperienceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateExperienceInput) => Promise<void>;
  experience?: Experience | null;
  isSubmitting: boolean;
}

export default function ExperienceFormDialog({
  open, onOpenChange, onSubmit, experience, isSubmitting,
}: ExperienceFormDialogProps) {
  const isEditing = !!experience;

  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(experienceSchema) as any,
    defaultValues: {
      company: "", position: "", employmentType: "FULL_TIME",
      description: "", responsibilities: "", location: "",
      startDate: "", endDate: "", isCurrent: false, isVisible: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (experience) {
        reset({
          company: experience.company,
          position: experience.position,
          employmentType: experience.employmentType,
          description: experience.description,
          responsibilities: experience.responsibilities || "",
          location: experience.location,
          startDate: experience.startDate.split("T")[0],
          endDate: experience.endDate?.split("T")[0] || "",
          isCurrent: experience.isCurrent,
          isVisible: experience.isVisible,
        });
      } else {
        reset({
          company: "", position: "", employmentType: "FULL_TIME",
          description: "", responsibilities: "", location: "",
          startDate: "", endDate: "", isCurrent: false, isVisible: true,
        });
      }
    }
  }, [open, experience, reset]);

  const isCurrent = watch("isCurrent");

  const onFormSubmit = async (data: FormData) => {
    await onSubmit({
      ...data,
      endDate: data.endDate || undefined,
      responsibilities: data.responsibilities || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Experience" : "New Experience"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the work experience details." : "Add a new work experience entry."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" placeholder="Acme Corp" {...register("company")} />
              {errors.company && <p className="text-xs text-destructive">{errors.company.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input id="position" placeholder="Senior Developer" {...register("position")} />
              {errors.position && <p className="text-xs text-destructive">{errors.position.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Employment Type</Label>
              <Select value={watch("employmentType")} onValueChange={(v) => setValue("employmentType", v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t.replace("_", " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="San Francisco, CA" {...register("location")} />
              {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe your role and achievements..." rows={3} {...register("description")} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsibilities">Responsibilities (optional)</Label>
            <Textarea id="responsibilities" placeholder="Key responsibilities..." rows={3} {...register("responsibilities")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" {...register("startDate")} />
              {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" {...register("endDate")} disabled={isCurrent} />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch id="isCurrent" checked={isCurrent} onCheckedChange={(c) => setValue("isCurrent", c)} />
              <Label htmlFor="isCurrent">Current position</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="isVisible" checked={watch("isVisible")} onCheckedChange={(c) => setValue("isVisible", c)} />
              <Label htmlFor="isVisible">Visible on portfolio</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{isEditing ? "Saving..." : "Creating..."}</>
              ) : (
                isEditing ? "Save Changes" : "Create Experience"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
