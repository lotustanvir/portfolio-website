import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Skill, CreateSkillInput } from "@/types/skill";

const SKILL_CATEGORIES = [
  "Frontend", "Backend", "Database", "Programming", "Cloud", "DevOps",
  "AI", "Machine Learning", "Data Analytics", "Business Analysis",
  "UI/UX", "Testing", "Tools", "Soft Skills", "Languages", "Other",
];

const skillSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be at most 100 characters"),
  category: z.string().min(1, "Category is required"),
  percentage: z.coerce.number().int().min(0, "Min 0").max(100, "Max 100"),
  icon: z.string().optional(),
  color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Must be a valid hex color")
    .or(z.literal(""))
    .optional(),
  isVisible: z.boolean(),
});

type FormData = z.infer<typeof skillSchema>;

interface SkillFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateSkillInput) => Promise<void>;
  skill?: Skill | null;
  isSubmitting: boolean;
}

export default function SkillFormDialog({
  open,
  onOpenChange,
  onSubmit,
  skill,
  isSubmitting,
}: SkillFormDialogProps) {
  const isEditing = !!skill;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(skillSchema) as any,
    defaultValues: {
      name: "", category: "", percentage: 0, icon: "", color: "", isVisible: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (skill) {
        reset({
          name: skill.name,
          category: skill.category,
          percentage: skill.percentage,
          icon: skill.icon || "",
          color: skill.color || "",
          isVisible: skill.isVisible,
        });
      } else {
        reset({ name: "", category: "", percentage: 0, icon: "", color: "", isVisible: true });
      }
    }
  }, [open, skill, reset]);

  const onFormSubmit = async (data: FormData) => {
    await onSubmit({
      ...data,
      icon: data.icon || undefined,
      color: data.color || undefined,
    });
  };

  const isVisible = watch("isVisible");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Skill" : "New Skill"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the skill details below." : "Add a new skill to your portfolio."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="React" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={watch("category")}
                onValueChange={(value) => setValue("category", value, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {SKILL_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="percentage">Proficiency (%)</Label>
              <Input id="percentage" type="number" min={0} max={100} {...register("percentage")} />
              {errors.percentage && <p className="text-xs text-destructive">{errors.percentage.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon">Icon (optional)</Label>
              <Input id="icon" placeholder="react" {...register("icon")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color (optional)</Label>
              <Input id="color" placeholder="#61DAFB" {...register("color")} />
              {errors.color && <p className="text-xs text-destructive">{errors.color.message}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch id="isVisible" checked={isVisible} onCheckedChange={(c) => setValue("isVisible", c)} />
            <Label htmlFor="isVisible">Visible on portfolio</Label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{isEditing ? "Saving..." : "Creating..."}</>
              ) : (
                isEditing ? "Save Changes" : "Create Skill"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
