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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Project, CreateProjectInput } from "@/types/project";

const PROJECT_CATEGORIES = [
  "Web Development",
  "Mobile App",
  "Data Science",
  "Machine Learning",
  "DevOps",
  "Design",
];

const projectSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be at most 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  image: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  liveDemo: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  github: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  featured: z.boolean(),
});

type FormData = z.infer<typeof projectSchema>;

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateProjectInput) => Promise<void>;
  project?: Project | null;
  isSubmitting: boolean;
}

export default function ProjectFormDialog({
  open,
  onOpenChange,
  onSubmit,
  project,
  isSubmitting,
}: ProjectFormDialogProps) {
  const isEditing = !!project;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(projectSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      category: "",
      image: "",
      liveDemo: "",
      github: "",
      status: "DRAFT",
      featured: false,
    },
  });

  useEffect(() => {
    if (open) {
      if (project) {
        reset({
          title: project.title,
          description: project.description,
          category: project.category,
          image: project.image || "",
          liveDemo: project.liveDemo || "",
          github: project.github || "",
          status: project.status,
          featured: project.featured,
        });
      } else {
        reset({
          title: "",
          description: "",
          category: "",
          image: "",
          liveDemo: "",
          github: "",
          status: "DRAFT",
          featured: false,
        });
      }
    }
  }, [open, project, reset]);

  const onFormSubmit = async (data: FormData) => {
    await onSubmit({
      ...data,
      image: data.image || undefined,
      liveDemo: data.liveDemo || undefined,
      github: data.github || undefined,
    });
  };

  const status = watch("status");
  const featured = watch("featured");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Project" : "New Project"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the project details below."
              : "Fill in the details to create a new project."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="My Awesome Project" {...register("title")} />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project..."
              rows={4}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
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
                  {PROJECT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setValue("status", value as "DRAFT" | "PUBLISHED" | "ARCHIVED")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" placeholder="https://example.com/image.jpg" {...register("image")} />
            {errors.image && (
              <p className="text-xs text-destructive">{errors.image.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="liveDemo">Live Demo URL</Label>
              <Input
                id="liveDemo"
                placeholder="https://myproject.com"
                {...register("liveDemo")}
              />
              {errors.liveDemo && (
                <p className="text-xs text-destructive">{errors.liveDemo.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub URL</Label>
              <Input
                id="github"
                placeholder="https://github.com/user/repo"
                {...register("github")}
              />
              {errors.github && (
                <p className="text-xs text-destructive">{errors.github.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="featured"
              checked={featured}
              onCheckedChange={(checked) => setValue("featured", checked)}
            />
            <Label htmlFor="featured">Featured project</Label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Saving..." : "Creating..."}
                </>
              ) : (
                isEditing ? "Save Changes" : "Create Project"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
