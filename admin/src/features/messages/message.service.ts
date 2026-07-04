import api from "@/lib/api";
import { MESSAGES } from "@/constants/endpoints";
import type { Message, MessageQueryParams } from "@/types/message";

interface P<T> { success: boolean; data: T[]; pagination: { page: number; limit: number; total: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean }; timestamp: string }
interface S<T> { success: boolean; message: string; data: T; timestamp: string }
type MR = S<{ message: Message }>;

export async function getMessages(params: MessageQueryParams) {
  const { data } = await api.get<P<Message>>(MESSAGES, { params });
  return { messages: data.data, pagination: data.pagination };
}

export async function getMessage(id: string) {
  const { data } = await api.get<MR>(`${MESSAGES}/${id}`);
  return data.data.message;
}

export async function markRead(id: string, isRead: boolean) {
  const { data } = await api.patch<MR>(`${MESSAGES}/${id}/read`, { isRead });
  return data.data.message;
}

export async function archiveMessage(id: string, isArchived: boolean) {
  const { data } = await api.patch<MR>(`${MESSAGES}/${id}/archive`, { isArchived });
  return data.data.message;
}

export async function replyToMessage(id: string, replyMessage: string) {
  const { data } = await api.post<MR>(`${MESSAGES}/${id}/reply`, { replyMessage });
  return data.data.message;
}

export async function deleteMessage(id: string) {
  await api.delete(`${MESSAGES}/${id}`);
}

export function getExportUrl(params?: Record<string, string>) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return `${MESSAGES}/export${qs}`;
}
