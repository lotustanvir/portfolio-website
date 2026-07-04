import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Loader2, Save, Camera, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import * as profileService from "./profile.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Valid email required"),
  profileImage: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, "Must contain a special character"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { admin, setAdmin } = useAuth();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema) as any,
    values: {
      name: admin?.name ?? "",
      email: admin?.email ?? "",
      profileImage: admin?.profileImage ?? "",
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema) as any,
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const profileMut = useMutation({
    mutationFn: (data: { name: string; email: string }) => profileService.updateProfile(data),
    onSuccess: (adminData) => { setAdmin(adminData); toast.success("Profile updated"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const imageMut = useMutation({
    mutationFn: (url: string) => profileService.updateProfileImage(url),
    onSuccess: (adminData) => { setAdmin(adminData); toast.success("Profile image updated"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const passwordMut = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      profileService.changePassword(data.currentPassword, data.newPassword),
    onSuccess: () => {
      passwordForm.reset();
      toast.success("Password changed. Please login again.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const onProfileSubmit = (data: ProfileForm) => {
    profileMut.mutate({ name: data.name, email: data.email });
  };

  const onImageSubmit = () => {
    const url = profileForm.watch("profileImage");
    if (url) imageMut.mutate(url);
  };

  const onPasswordSubmit = (data: PasswordForm) => {
    passwordMut.mutate({ currentPassword: data.currentPassword, newPassword: data.newPassword });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account settings</p>
      </div>

      {/* Profile Information */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profile Information</CardTitle>
            <CardDescription>Update your name, email, and profile photo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                {admin?.profileImage ? <AvatarImage src={admin.profileImage} alt={admin?.name} /> : null}
                <AvatarFallback className="text-lg">{admin?.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="font-medium">{admin?.name}</p>
                <p className="text-sm text-muted-foreground">{admin?.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{admin?.role?.toLowerCase().replace("_", " ")}</p>
              </div>
            </div>

            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...profileForm.register("name")} />
                  {profileForm.formState.errors.name && (
                    <p className="text-xs text-destructive">{profileForm.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...profileForm.register("email")} />
                  {profileForm.formState.errors.email && (
                    <p className="text-xs text-destructive">{profileForm.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileImage">Profile Image URL</Label>
                <div className="flex gap-2">
                  <Input id="profileImage" placeholder="https://example.com/photo.jpg" className="flex-1" {...profileForm.register("profileImage")} />
                  <Button type="button" variant="outline" size="icon" onClick={onImageSubmit} disabled={imageMut.isPending} title="Update photo">
                    {imageMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" disabled={profileMut.isPending || !profileForm.formState.isDirty}>
                {profileMut.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Change Password */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Change Password</CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input id="currentPassword" type={showCurrent ? "text" : "password"} {...passwordForm.register("currentPassword")} />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowCurrent(!showCurrent)}>
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-xs text-destructive">{passwordForm.formState.errors.currentPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input id="newPassword" type={showNew ? "text" : "password"} {...passwordForm.register("newPassword")} />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowNew(!showNew)}>
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-xs text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
                )}
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  <li className={passwordForm.watch("newPassword")?.length >= 12 ? "text-emerald-500" : ""}>At least 12 characters</li>
                  <li className={/[A-Z]/.test(passwordForm.watch("newPassword") || "") ? "text-emerald-500" : ""}>One uppercase letter</li>
                  <li className={/[a-z]/.test(passwordForm.watch("newPassword") || "") ? "text-emerald-500" : ""}>One lowercase letter</li>
                  <li className={/[0-9]/.test(passwordForm.watch("newPassword") || "") ? "text-emerald-500" : ""}>One number</li>
                  <li className={/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(passwordForm.watch("newPassword") || "") ? "text-emerald-500" : ""}>One special character</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input id="confirmPassword" type={showConfirm ? "text" : "password"} {...passwordForm.register("confirmPassword")} />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" disabled={passwordMut.isPending}>
                {passwordMut.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : <><Lock className="mr-2 h-4 w-4" /> Change Password</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
