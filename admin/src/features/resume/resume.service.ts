import api from "@/lib/api";
import { RESUME } from "@/constants/endpoints";
import type { Resume, CreateResumeInput, UpdateResumeInput, ResumeQueryParams } from "@/types/resume";

interface P<T> { success: boolean; data: T[]; pagination: { page: number; limit: number; total: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean }; timestamp: string }
interface S<T> { success: boolean; message: string; data: T; timestamp: string }
type RR = S<{ resume: Resume }>;

export async function getResumes(params: ResumeQueryParams) {
  const { data } = await api.get<P<Resume>>(RESUME, { params });
  return { resumes: data.data, pagination: data.pagination };
}

export async function getActiveResume() {
  const { data } = await api.get<RR>(`${RESUME}/active`);
  return data.data.resume;
}

export async function createResume(input: CreateResumeInput) {
  const { data } = await api.post<RR>(RESUME, input);
  return data.data.resume;
}

export async function updateResume(id: string, input: UpdateResumeInput) {
  const { data } = await api.put<RR>(`${RESUME}/${id}`, input);
  return data.data.resume;
}

export async function activateResume(id: string) {
  const { data } = await api.patch<RR>(`${RESUME}/${id}/activate`);
  return data.data.resume;
}

export async function deleteResume(id: string) {
  await api.delete(`${RESUME}/${id}`);
}

export async function uploadResumePdf(file: File) {
  const formData = new FormData();
  formData.append("resume", file);
  const { data } = await api.post<{ success: boolean; data: { fileUrl: string; filename: string }; message: string; timestamp: string }>(
    `${RESUME}/upload`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data.data;
}
