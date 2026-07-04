import api from "@/lib/api";
import { AUTH } from "@/constants/endpoints";
import type { Admin } from "@/types/auth";

interface S<T> { success: boolean; message: string; data: T; timestamp: string }
type AR = S<{ admin: Admin }>;

export async function updateProfile(data: { name?: string; email?: string }) {
  const res = await api.patch<AR>(AUTH.UPDATE_PROFILE, data);
  return res.data.data.admin;
}

export async function updateProfileImage(profileImage: string) {
  const res = await api.patch<AR>(AUTH.UPDATE_PROFILE_IMAGE, { profileImage });
  return res.data.data.admin;
}

export async function changePassword(currentPassword: string, newPassword: string) {
  await api.patch(AUTH.CHANGE_PASSWORD, { currentPassword, newPassword });
}
