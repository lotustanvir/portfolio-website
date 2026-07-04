import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Loader2, Save } from "lucide-react";
import * as settingsService from "./settings.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { UpdateSettingsInput } from "@/types/settings";

const sections = [
  {
    id: "general",
    title: "General",
    description: "Basic website information",
    fields: [
      { key: "siteTitle", label: "Site Title", placeholder: "My Portfolio", type: "text" },
      { key: "siteDescription", label: "Site Description", placeholder: "A showcase of my work", type: "textarea" },
    ],
  },
  {
    id: "seo",
    title: "SEO",
    description: "Search engine optimization",
    fields: [
      { key: "seoTitle", label: "SEO Title", placeholder: "Portfolio - John Doe", type: "text" },
      { key: "seoDescription", label: "SEO Description", placeholder: "Discover my projects...", type: "textarea" },
    ],
  },
  {
    id: "hero",
    title: "Hero Section",
    description: "Landing page hero content",
    fields: [
      { key: "heroTitle", label: "Hero Title", placeholder: "Hi, I'm John", type: "text" },
      { key: "heroSubtitle", label: "Hero Subtitle", placeholder: "Full Stack Developer", type: "text" },
      { key: "heroImage", label: "Hero Image URL", placeholder: "/images/hero.jpg", type: "text" },
    ],
  },
  {
    id: "about",
    title: "About",
    description: "About section content",
    fields: [
      { key: "about", label: "About Text", placeholder: "Write about yourself...", type: "textarea" },
    ],
  },
  {
    id: "contact",
    title: "Contact Information",
    description: "How visitors can reach you",
    fields: [
      { key: "email", label: "Email", placeholder: "john@example.com", type: "email" },
      { key: "phone", label: "Phone", placeholder: "+1 234 567 890", type: "text" },
      { key: "location", label: "Location", placeholder: "San Francisco, CA", type: "text" },
    ],
  },
  {
    id: "social",
    title: "Social Links",
    description: "Your social media profiles",
    fields: [
      { key: "github", label: "GitHub URL", placeholder: "https://github.com/johndoe", type: "url" },
      { key: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/johndoe", type: "url" },
      { key: "facebook", label: "Facebook URL", placeholder: "https://facebook.com/johndoe", type: "url" },
      { key: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/johndoe", type: "url" },
    ],
  },
  {
    id: "branding",
    title: "Branding",
    description: "Visual identity elements",
    fields: [
      { key: "logo", label: "Logo URL", placeholder: "/images/logo.png", type: "text" },
      { key: "favicon", label: "Favicon URL", placeholder: "/favicon.ico", type: "text" },
      { key: "themeColor", label: "Theme Color", placeholder: "#6366f1", type: "text" },
    ],
  },
  {
    id: "resume",
    title: "Resume",
    description: "Resume download link",
    fields: [
      { key: "resumeUrl", label: "Resume URL", placeholder: "/uploads/resume.pdf", type: "text" },
    ],
  },
];

export default function SettingsPage() {
  const qc = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsService.getSettings,
  });

  const updateMut = useMutation({
    mutationFn: (input: UpdateSettingsInput) => settingsService.updateSettings(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<UpdateSettingsInput>();

  useEffect(() => {
    if (settings) {
      reset({
        siteTitle: settings.siteTitle ?? "",
        siteDescription: settings.siteDescription ?? "",
        seoTitle: settings.seoTitle ?? "",
        seoDescription: settings.seoDescription ?? "",
        heroTitle: settings.heroTitle ?? "",
        heroSubtitle: settings.heroSubtitle ?? "",
        heroImage: settings.heroImage ?? "",
        about: settings.about ?? "",
        email: settings.email ?? "",
        phone: settings.phone ?? "",
        location: settings.location ?? "",
        github: settings.github ?? "",
        linkedin: settings.linkedin ?? "",
        facebook: settings.facebook ?? "",
        instagram: settings.instagram ?? "",
        resumeUrl: settings.resumeUrl ?? "",
        themeColor: settings.themeColor ?? "",
        logo: settings.logo ?? "",
        favicon: settings.favicon ?? "",
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: UpdateSettingsInput) => {
    const cleaned: UpdateSettingsInput = {};
    for (const [key, value] of Object.entries(data)) {
      (cleaned as any)[key] = value || undefined;
    }
    await updateMut.mutateAsync(cleaned);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-36" /><Skeleton className="h-4 w-52 mt-1" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}><CardHeader><Skeleton className="h-5 w-32" /><Skeleton className="h-3 w-48 mt-1" /></CardHeader>
            <CardContent className="space-y-4">{Array.from({ length: 2 }).map((_, j) => <Skeleton key={j} className="h-10 w-full" />)}</CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Website Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure your portfolio website</p>
        </div>
        <Button onClick={handleSubmit(onSubmit)} disabled={updateMut.isPending || !isDirty} size="lg">
          {updateMut.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save All</>}
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {sections.map((section, si) => (
          <motion.div key={section.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.05 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key}>{field.label}</Label>
                    {field.type === "textarea" ? (
                      <Textarea id={field.key} rows={3} placeholder={field.placeholder} {...register(field.key as any)} />
                    ) : (
                      <Input id={field.key} type={field.type} placeholder={field.placeholder} {...register(field.key as any)} />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </form>
    </div>
  );
}
