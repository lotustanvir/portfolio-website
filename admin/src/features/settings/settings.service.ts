import api from "@/lib/api";
import { SETTINGS } from "@/constants/endpoints";
import type { WebsiteSettings, UpdateSettingsInput } from "@/types/settings";

interface S<T> { success: boolean; message: string; data: T; timestamp: string }
type SR = S<{ settings: WebsiteSettings }>;

export async function getSettings() {
  const { data } = await api.get<SR>(SETTINGS);
  return data.data.settings;
}

export async function updateSettings(input: UpdateSettingsInput) {
  const { data } = await api.put<SR>(SETTINGS, input);
  return data.data.settings;
}
